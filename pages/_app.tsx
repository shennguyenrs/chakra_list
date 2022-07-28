import type { AppProps } from 'next/app';
import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';

// Chakra theme
import theme from '../styles/index';

// Components
import { Loader, Include } from '../components/common';

// Contexts
import { UserContext } from '../contexts/userContexts';

// Models
import { CleanUser, UserType, WithoutUserTask } from '../models';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<CleanUser | null>(null);
  const [tasks, setTasks] = useState<WithoutUserTask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  let localTasks: WithoutUserTask[] = [];

  // Get local storage
  if (typeof window !== 'undefined') {
    localTasks = JSON.parse(localStorage.getItem('localTasks') as string);
  }

  const checkUser = async () => {
    setLoading(true);

    try {
      const response = await axios.get<{
        user: CleanUser;
        tasks: WithoutUserTask[];
      }>('/api/auth/user');
      setUser(response.data.user);

      // If local tasks exists, sync it to cloud
      if (localTasks.length > 0) {
        await axios.post('/api/tasks', {
          local: localTasks,
        });

        const updatedTasks = await axios.get('/api/tasks');
        setTasks(updatedTasks.data.tasks);
      } else {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.delete('/api/auth/user');
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const saveTasks = async (newTasks: WithoutUserTask[]) => {
    try {
      setTasks(newTasks);

      if (user && user?._id !== UserType.DEMO) {
        await axios.post('/api/tasks', { local: newTasks });
      } else {
        localStorage.localTasks = JSON.stringify(newTasks);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const contextInput = useMemo(
    () => ({
      user,
      setUser,
      tasks,
      setTasks,
      saveTasks,
      loading,
      checkUser,
      logout,
    }),
    [user, tasks, loading]
  );

  // Check local tasks
  useEffect(() => {
    if (Boolean(localTasks)) {
      setTasks(localTasks);
    }
  }, []);

  // Check user and tasks on loading page
  useEffect(() => {
    if (!user) {
      checkUser();
    }
  }, [user]);

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>My Productivity Manager</title>
        <meta
          name="description"
          content="Chakra todo list application with Framer motion"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Include condition={loading}>
        <Loader />
      </Include>
      <Include condition={!loading}>
        <UserContext.Provider value={contextInput}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </Include>
    </ChakraProvider>
  );
}

export default MyApp;

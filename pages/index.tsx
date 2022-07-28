import { useRouter } from 'next/router';
import { useEffect, useContext, useRef, MouseEvent } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

// Context
import { UserContext } from '../contexts/userContexts';

// Components
import UserView from '../components/UserView';

// Models
import { UserType } from '../models';

const Home = () => {
  // States
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  // Alert control
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any | null>();

  // Handle user sigin
  const handleSigin = (e: MouseEvent) => {
    e.preventDefault();
    router.push('/auth/signin');
  };

  // Handle use demo account
  const handleDemoAccount = (e: MouseEvent) => {
    e.preventDefault();
    setUser({ _id: 'demo', email: 'demo' });
    onClose();
  };

  // Open alert on loading page if user not logined
  // or redirect to user page
  useEffect(() => {
    if (!user) {
      onOpen();
    }

    if (user && user._id !== UserType.DEMO) {
      router.push('/user/' + user._id);
    }
  }, [user]);

  return (
    <>
      <UserView />
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            📝 Welcome to My Productivity Manager
          </AlertDialogHeader>
          <AlertDialogBody>
            <p>
              This application is in developing more features 🚧. It is ony
              available for some invited users for saving their data online.
              User can use demo to save on local storage! Click on demo or
              signin with magic link 🪄 Thank you 💪
            </p>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={handleDemoAccount}>Demo</Button>
            <Button colorScheme="pink" ml={3} onClick={handleSigin}>
              Sign in
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Home;

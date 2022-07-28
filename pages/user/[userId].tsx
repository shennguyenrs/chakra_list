import type { GetServerSideProps, NextPage } from 'next';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Components
import UserView from '../../components/UserView';

// Contexts
import { UserContext } from '../../contexts/userContexts';

interface Props {
  reqId: string;
}

const AuthUser: NextPage<Props> = (props) => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  // Redirect to correct user id page
  useEffect(() => {
    if (props.reqId !== (user?._id as string)) {
      router.push('/user/' + user?._id);
    }
  }, [user, props.reqId]);

  return <UserView />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.tokenCookie;
  const reqId = context.params?.user || null;

  // Redirect to home if token not exist
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: { reqId } };
};

export default AuthUser;

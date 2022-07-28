import { useState, useEffect, useContext, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { Flex, Spacer, Tooltip, useColorMode } from '@chakra-ui/react';
import { IoMoon, IoSunny, IoLogIn, IoLogOut } from 'react-icons/io5';

// Components
import { MHeading } from './MotionComponents';
import RoundedButton from './RoundedButton';
import Include from './Include';

// Colors
import {
  gray_100,
  gray_900,
  gradient_pink,
  gradient_orange,
} from '../../styles/abstracts/colors';

// Contexts
import { UserContext } from '../../contexts/userContexts';

// Model
import { UserType } from '../../models';

// Animate variants
const variants = {
  initial: {
    y: 0,
    opacity: 1,
  },
  appear: {
    y: [-100, 25, 0],
    opacity: [0, 1],
    transition: {
      duration: 2,
    },
  },
};

const HeaderBar = ({ content }: { content: string }) => {
  // Chakra-UI
  const { user, logout } = useContext(UserContext);
  const { colorMode, toggleColorMode } = useColorMode();
  const [animateHeader, setAnimateHeader] = useState<boolean>(false);
  const router = useRouter();

  // Handle login
  const handleLogin = (e: MouseEvent) => {
    e.preventDefault();
    router.push('/auth/signin');
  };

  // Stop animate after the first time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!animateHeader) {
        setAnimateHeader(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [animateHeader]);

  return (
    <Flex alignItems="center">
      <MHeading
        bgGradient={`linear(to-bl, ${gradient_pink}, ${gradient_orange})`}
        bgClip="text"
        variants={variants}
        initial={animateHeader ? false : 'initial'}
        animate="appear"
      >
        {content}
      </MHeading>
      <Spacer />
      <Flex position="fixed" top="0" right={['0', '2rem']} m="2rem" gap="1rem">
        <Tooltip label="Change theme">
          <RoundedButton onClick={toggleColorMode}>
            <Include condition={colorMode === 'light'}>
              <IoMoon color={gray_100} />
            </Include>
            <Include condition={colorMode === 'dark'}>
              <IoSunny color={gray_900} />
            </Include>
          </RoundedButton>
        </Tooltip>
        <Include condition={user?._id === UserType.DEMO}>
          <Tooltip label="Login">
            <RoundedButton onClick={handleLogin}>
              <Include condition={colorMode === 'light'}>
                <IoLogIn color={gray_100} />
              </Include>
              <Include condition={colorMode === 'dark'}>
                <IoLogIn color={gray_900} />
              </Include>
            </RoundedButton>
          </Tooltip>
        </Include>
        <Include condition={user?._id !== UserType.DEMO}>
          <Tooltip label="Logout">
            <RoundedButton onClick={logout}>
              <Include condition={colorMode === 'light'}>
                <IoLogOut color={gray_100} />
              </Include>
              <Include condition={colorMode === 'dark'}>
                <IoLogOut color={gray_900} />
              </Include>
            </RoundedButton>
          </Tooltip>
        </Include>
      </Flex>
    </Flex>
  );
};

export default HeaderBar;

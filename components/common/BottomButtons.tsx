import { useRouter } from 'next/router';
import { Flex, Tooltip, useColorMode } from '@chakra-ui/react';

// Icons
import { IoTime } from 'react-icons/io5';

// Styles
import { gray_100, gray_900 } from '../../styles/abstracts/colors';

// Components
import RoundedButton from './RoundedButton';
import Include from './Include';

const BottomButtons = () => {
  const router = useRouter();

  // Change backgound colors
  const { colorMode } = useColorMode();

  return (
    <Flex
      position="fixed"
      bottom={['2rem', '4rem']}
      right={['0', '2rem']}
      m="2rem"
    >
      <Tooltip label="Pomodoro timer">
        <RoundedButton onClick={() => router.push('/pomodoro')}>
          <Include condition={colorMode === 'light'}>
            <IoTime color={gray_100} />
          </Include>
          <Include condition={colorMode === 'dark'}>
            <IoTime color={gray_900} />
          </Include>
        </RoundedButton>
      </Tooltip>
    </Flex>
  );
};

export default BottomButtons;

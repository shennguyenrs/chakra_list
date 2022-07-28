import { NextPage } from 'next';
import {
  Flex,
  ButtonGroup,
  Box,
  Input,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent } from 'react';
import useSound from 'use-sound';
import { useRouter } from 'next/router';

// Icons
import { IoList } from 'react-icons/io5';

// Colors
import { gray_100, gray_900 } from '../styles/abstracts/colors';

// Components
import { HeadBar, RoundedButton } from '../components/common';

// Sounds
const successSoundFile =
  '/sounds/411088__inspectorj__bell-candle-damper-a-h4n_2s.wav'; // For production

const initialTime = [25, 0];

const PomodorTimer: NextPage = () => {
  const [taskName, setTaskName] = useState<string>('');
  const [[min, sec], setTimer] = useState<number[]>(initialTime);
  const [onStart, setOnStart] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const router = useRouter();

  // Play sounds
  const [play] = useSound(successSoundFile);

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Change timer every 1 second
  useEffect(() => {
    if (onStart) {
      const startTickTok = setInterval(() => ticking(), 1000);
      return () => clearInterval(startTickTok);
    }
  });

  // Change backgound colors
  const bgTheme = useColorModeValue('gray.100', 'gray.900');

  // Convert number time to text
  const stringTime = () => {
    const minutes = min < 10 ? '0' + min.toString() : min.toString();
    const seconds = sec < 10 ? '0' + sec.toString() : sec.toString();

    return minutes + ':' + seconds;
  };

  // Ticking timer
  const ticking = () => {
    if (min === 0 && sec === 0) {
      setOnStart(false);
      handleReset();
      play();
      onOpen();
      setTaskName('');
    } else if (sec === 0) {
      setTimer([min - 1, 59]);
    } else {
      setTimer([min, sec - 1]);
    }
  };

  const handleChangeTaskName = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  // Reset timer
  const handleReset = () => {
    setTimer(initialTime);
  };

  // Take break with a value of time
  const takeBreak = (value: number[]) => {
    onClose();
    setTimer(value);
    setOnStart(true);
  };

  return (
    <>
      <Flex
        width="100vw"
        height="100vh"
        backgroundColor={bgTheme}
        padding="2rem"
        direction="column"
        position="relative"
        textAlign="center"
      >
        <HeadBar content="Pomodoro Timer" />
        <Flex
          width="100%"
          height="100%"
          direction="column"
          justifyContent="center"
          alignContent="center"
        >
          <Input
            type="text"
            variant="unstyled"
            placeholder="What are you working on now?"
            fontSize="8vh"
            textAlign="center"
            value={taskName}
            onChange={handleChangeTaskName}
          />
          <Text fontSize="20vh" fontWeight="bold">
            {stringTime()}
          </Text>
          <Box>
            <ButtonGroup spacing="6">
              <Button
                colorScheme={onStart ? 'red' : 'teal'}
                onClick={() => setOnStart(!onStart)}
              >
                {onStart ? 'Stop' : 'Start'}
              </Button>
              <Button
                colorScheme="gray"
                isActive={onStart}
                onClick={handleReset}
              >
                Reset
              </Button>
            </ButtonGroup>
          </Box>
        </Flex>
        <Box position="fixed" bottom="0" right="0" m="2rem">
          <Tooltip label="Tasks List">
            <RoundedButton onClick={() => router.push('/')}>
              {colorMode === 'light' ? (
                <IoList color={gray_100} />
              ) : (
                <IoList color={gray_900} />
              )}
            </RoundedButton>
          </Tooltip>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Great 🎉 You done a session!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Lets have a short break for 5 minutes or long break for 10 minutes
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={() => takeBreak([5, 0])}>
              Continue
            </Button>
            <Button variant="ghost" onClick={() => takeBreak([10, 0])}>
              Take long break
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PomodorTimer;

import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogFooter,
  useDisclosure,
} from '@chakra-ui/react';
import {
  useState,
  useRef,
  useMemo,
  useEffect,
  useContext,
  MouseEvent,
} from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';

// Context
import { UserContext } from '../../contexts/userContexts';

// Models
import { UserType } from '../../models';

// Components
import { Include } from '../../components/common';

// Constants
const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const SignIn = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [alertHeader, setAlertHeader] = useState<string>(
    'Your magic link is preparing...'
  );
  const [alertMes, setAlertMes] = useState<string>('');
  const [errMes, setErrMes] = useState<string>('');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any | null>();

  // Check if user logined and redirect to homepage
  useEffect(() => {
    if (user && user?._id !== UserType.DEMO) {
      router.push('/');
    }
  }, [user, router]);

  // Handle change state on input email
  const handleEmailChange = useMemo(
    () =>
      _.debounce(() => {
        const currentValue = emailRef.current?.value as string;
        setEmail(currentValue);

        // Check email pattern
        if (!emailPattern.test(currentValue)) {
          setErrMes('Email is not in correct format! Please try again!');
        } else {
          setErrMes('');
        }

        if (currentValue === '') {
          setErrMes('');
        }
      }, 500),
    []
  );

  // Handle clear form
  const handleClearForm = () => {
    if (emailRef.current !== null) {
      emailRef.current.value = '';
    }

    handleEmailChange();
  };

  //Handle submit email
  const submitForm = async (e: MouseEvent) => {
    e.preventDefault();

    // Dont allow submit form on error happens
    if (Boolean(errMes)) return;

    // Open alert dialog
    onOpen();

    // Reset input form
    handleClearForm();

    try {
      await axios.post('/api/auth/signin', { email });

      setAlertHeader('Your magic link have been sent');
      setAlertMes('Check your email or spam carefully to login!');
    } catch (err) {
      setAlertHeader('Can not send your magic link');
      setAlertMes('You did not been invited! Please use demo instead!');
    }
  };

  return (
    <>
      <Flex
        w="100vw"
        h="95vh"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <FormControl w="60vw" isInvalid={Boolean(errMes)} isRequired>
          <FormLabel>Enter your email</FormLabel>
          <InputGroup>
            <Input
              ref={emailRef}
              onChange={handleEmailChange}
              type="email"
              placeholder="yourexample@email.com"
            />
            <Include condition={email !== ''}>
              <InputRightElement
                children={<IoClose onClick={handleClearForm} />}
              />
            </Include>
          </InputGroup>
          <Include condition={email !== ''}>
            <FormErrorMessage>{errMes}</FormErrorMessage>
          </Include>
        </FormControl>
        <Button
          mt="2rem"
          colorScheme="pink"
          onClick={submitForm}
          isDisabled={Boolean(errMes) || email === ''}
        >
          Send the magic link
        </Button>
      </Flex>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>🪄 {alertHeader}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <p>{alertMes}</p>
          </AlertDialogBody>
          <AlertDialogFooter />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SignIn;

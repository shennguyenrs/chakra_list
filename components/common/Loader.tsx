import { Flex, Spinner, Text } from '@chakra-ui/react';

const Loader = () => (
  <Flex w="100vw" h="100vh" justifyContent="center" alignItems="center">
    <Spinner size="xl" color="pink.500" />
    <Text ml="1rem" fontSize="4xl">
      Loading
    </Text>
  </Flex>
);

export default Loader;

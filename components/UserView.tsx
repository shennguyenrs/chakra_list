import { Flex, useColorModeValue } from '@chakra-ui/react';

// Models
import { WithoutUserTask } from '../models';

// Components
import { HeadBar, Footer, BottomButtons } from './common';
import TodoList from './todolist';

const UserView = () => {
  // Change backgound colors
  const bgTheme = useColorModeValue('gray.100', 'gray.900');

  return (
    <>
      <Flex
        w="100vw"
        h="95vh"
        backgroundColor={bgTheme}
        padding="2rem"
        direction="column"
        position="relative"
        overflow="hidden"
      >
        <HeadBar content="My Chakra list" />
        <TodoList />
        <BottomButtons />
      </Flex>
      <Footer />
    </>
  );
};

export default UserView;

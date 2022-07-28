import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { KeyboardEvent } from 'react';
import { IoAdd } from 'react-icons/io5';

// Colors
import { gradient_pink } from '../../styles/abstracts/colors';

const AddNewTask = ({ addTask }: { addTask: (taskName: string) => void }) => {
  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const taskName: string = (e.target as HTMLInputElement).value;
      addTask(taskName);

      // Clear input form
      (e.target as HTMLInputElement).value = '';
    }
  };

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <IoAdd color={gradient_pink} />
      </InputLeftElement>
      <Input
        type="text"
        variant="unstyled"
        placeholder="Add new task..."
        paddingTop="0.5rem"
        onKeyDown={handleEnter}
      />
    </InputGroup>
  );
};

export default AddNewTask;

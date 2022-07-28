import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  useDisclosure,
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { ChangeEvent, MouseEvent, useRef, useState, useEffect } from 'react';
import { IoCheckmarkCircle, IoEllipseOutline, IoTrash } from 'react-icons/io5';

// Model
import { WithoutUserTask } from '../../models';

// Colors
import { gradient_pink, gray_700 } from '../../styles/abstracts/colors';

// Components
import { MFlex, MVStack, Include } from '../common';

enum TaskState {
  NOT_DONE = 'notDone',
  DONE = 'isDone',
}

// Motion settings
const container = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -100 },
  show: { opacity: 1, x: 0 },
};

const TaskList = ({
  tasks,
  markTask,
  editTask,
  deleteTask,
}: {
  tasks: WithoutUserTask[];
  markTask: (id: string) => void;
  editTask: (id: string, name: string) => void;
  deleteTask: (id: string) => void;
}) => {
  const [doneTasks, setDoneTasks] = useState<WithoutUserTask[]>([]);
  const [undoneTasks, setUndoneTasks] = useState<WithoutUserTask[]>([]);
  const [editedName, setEditedName] = useState<string>('');
  const [editingId, setEditingId] = useState<string | undefined>();
  const [onShow, setOnShow] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const taskInputRef = useRef(null);

  useEffect(() => {
    if (tasks.length > 0) {
      const done = tasks.filter((task) => task.isDone);
      const undone = tasks.filter((task) => !task.isDone);

      setDoneTasks(done);
      setUndoneTasks(undone);
    }

    if (tasks.length === 0) {
      setDoneTasks([]);
      setUndoneTasks([]);
    }
  }, [tasks]);

  // Handle click on task
  const handleClickOnTask = (e: MouseEvent<HTMLHeadElement>, id: string) => {
    setEditingId(id);
    setEditedName((e.target as HTMLHeadingElement).innerHTML);

    // Open Modal
    onOpen();
  };

  // Handle editing task name
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  // Handle save new task name
  const handleSaveName = () => {
    if (editingId !== undefined) {
      editTask(editingId, editedName);
    }

    // Close modal
    onClose();
  };

  // Handle delete task
  const handleDeleteName = () => {
    if (editingId !== undefined) {
      deleteTask(editingId);
    }

    // Close modal
    onClose();
  };

  const RenderConditionalTasks = (
    conditionalTasks: WithoutUserTask[],
    taskState: TaskState
  ) => {
    return conditionalTasks.map((task: WithoutUserTask) => (
      <MFlex
        key={task._id}
        variants={item}
        alignItems="center"
        exit={{ opacity: 0 }}
      >
        <Include condition={taskState === TaskState.NOT_DONE}>
          <IoEllipseOutline
            color={gradient_pink}
            onClick={() => markTask(task._id ?? '')}
            cursor="pointer"
          />
        </Include>
        <Include condition={taskState === TaskState.DONE}>
          <IoCheckmarkCircle
            color={gray_700}
            onClick={() => markTask(task._id ?? '')}
            cursor="pointer"
          />
        </Include>
        <Text
          variant={taskState}
          cursor="pointer"
          pl=".4rem"
          onClick={(e) => handleClickOnTask(e, task._id ?? '')}
        >
          {task.name}
        </Text>
      </MFlex>
    ));
  };

  return (
    <MVStack
      p="1rem"
      mt="1rem"
      align="left"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {RenderConditionalTasks(undoneTasks, TaskState.NOT_DONE)}
        <Include condition={Boolean(doneTasks.length)}>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton onClick={() => setOnShow(!onShow)}>
                <Box flex="1" textAlign="left">
                  {onShow ? 'Hide' : 'Show'} done tasks
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {RenderConditionalTasks(doneTasks, TaskState.DONE)}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Include>
      </AnimatePresence>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={taskInputRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Task name</FormLabel>
              <Input
                ref={taskInputRef}
                type="text"
                defaultValue={editedName}
                onChange={handleChangeName}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={handleDeleteName}
              colorScheme="pink"
              leftIcon={<IoTrash />}
            >
              Delete
            </Button>
            <Button onClick={handleSaveName}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MVStack>
  );
};

export default TaskList;

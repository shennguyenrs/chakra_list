import { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components
import TaskList from './TaskList';
import AddNewTask from './AddNewTask';

// Models
import { WithoutUserTask } from '../../models';

// Contexts
import { UserContext } from '../../contexts/userContexts';

const TodoList = () => {
  const { tasks, saveTasks } = useContext(UserContext);

  // Handle mask task at done on click
  const handleUpdateTasks = (id: string) => {
    let stateTasks = [...tasks];
    const index = stateTasks.findIndex((item) => item._id === id);
    stateTasks[index].isDone = !stateTasks[index].isDone;

    // Update state
    saveTasks(stateTasks);
  };

  // Handle edit task
  const handleEditTask = (id: string, newName: string) => {
    let stateTasks = [...tasks];
    const index = stateTasks.findIndex((item) => item._id === id);
    stateTasks[index].name = newName;

    // Update state
    saveTasks(stateTasks);
  };

  // Handle add new task
  const handleAddNewTask = (taskName: string) => {
    let stateTasks = [...tasks];
    let newTask: WithoutUserTask = {
      name: taskName,
      isDone: false,
      _id: uuidv4(),
    };

    stateTasks.push(newTask);

    // Update state
    saveTasks(stateTasks);
  };

  // Handle delete task
  const handleDeleteTask = async (id: string) => {
    let stateTasks: WithoutUserTask[] = [];
    stateTasks = tasks.filter((item) => item._id !== id);

    // Update state
    saveTasks(stateTasks);
  };

  return (
    <>
      <TaskList
        tasks={tasks}
        markTask={handleUpdateTasks}
        editTask={handleEditTask}
        deleteTask={handleDeleteTask}
      />
      <AddNewTask addTask={handleAddNewTask} />
    </>
  );
};

export default TodoList;

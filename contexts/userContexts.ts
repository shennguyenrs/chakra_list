import { createContext } from 'react';

// Models
import { USERCTXT } from '../models';

const defaultContext: USERCTXT = {
  user: null,
  setUser: () => {},
  tasks: [],
  setTasks: () => {},
  saveTasks: () => {},
  loading: false,
  checkUser: undefined,
  logout: undefined,
};

export const UserContext = createContext<USERCTXT>(defaultContext);

import { Dispatch, SetStateAction } from 'react';

export interface USER {
  _id?: string;
  email: string;
  sessionToken: string | null;
  loginToken: string | null;
}

export type CleanUser = Omit<USER, 'sessionToken' | 'loginToken'>;

export interface USERCTXT {
  user: CleanUser | null;
  setUser: (user: CleanUser) => void;
  tasks: WithoutUserTask[];
  setTasks: Dispatch<SetStateAction<WithoutUserTask[]>>;
  saveTasks: (tasks: WithoutUserTask[]) => void;
  loading: Boolean;
  checkUser: (() => Promise<void>) | undefined;
  logout: (() => Promise<void>) | undefined;
}

export enum AuthStatus {
  LOGINED = 'logined',
  LOGOUT = 'logout',
}

export enum UserType {
  DEMO = 'demo',
  REGISTERED = 'registered',
}

export interface TASK {
  _id?: string;
  name: string;
  isDone: boolean;
  user: string;
}

export interface PROJECT {
  _id?: string;
  name: string;
  users: USER[];
  tasks: CleanTask[];
}

export type CleanTask = Omit<TASK, '_id' | 'user'>;
export type WithoutUserTask = Omit<TASK, 'user'>;

export interface JWTPAYLOAD {
  id: string;
  code: string;
}

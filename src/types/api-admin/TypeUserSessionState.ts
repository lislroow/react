import { GridColDef } from '@mui/x-data-grid';

export type TypeUserSessionState = {
  sessionId: string,
  creation: string,
  lastAccessed: string,
  afterExpires: number,
  uid: string,
  userId?: string,
  email?: string,
  nickname?: string,
  picture?: string
};

export const ColUserSessionState: GridColDef[] = [
  // {field: 'sessionId', headerName: 'sessionId', width: 300},
  {field: 'uid', headerName: 'uid', width: 150},
  {field: 'nickname', headerName: 'nickname', width: 100},
  {field: 'userId', headerName: 'userId', width: 100},
  {field: 'email', headerName: 'email', width: 120},
  {field: 'creation', headerName: 'creation', width: 170},
  {field: 'lastAccessed', headerName: 'lastAccessed', width: 170},
  {field: 'afterExpires', headerName: 'EXP', width: 70},
  // {field: 'picture', headerName: 'picture'},
];
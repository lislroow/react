import { GridColDef } from '@mui/x-data-grid';

export type TypeCustomer = {
  email?: string,
  image?: string,
  name?: string,
  birthday?: string,
  gender?: string,
  job?: string,
  isDel?: number,
  createDate?: string,
  modifyDate?: string
};

export const ColCustomer: GridColDef[] = [
  {field: 'userId', headerName: 'userId'},
  {field: 'site', headerName: 'site'},
  {field: 'nickname', headerName: '닉네임'},
  {field: 'email', headerName: 'email'},
  {field: 'picture', headerName: '이미지'},
  {field: 'birthday', headerName: '생년월일'},
  {field: 'gender', headerName: '성별'},
  {field: 'job', headerName: '직업'},
];

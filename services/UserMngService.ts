import { http } from '@/components/http';
import {
  ModifyManagerReq,
  ManagerRes,
  ChangePasswordReq,
  RegistrationReq,
  SendRegistrationReq,
} from '@/types/UserMngTypes';

const getManagersSearch = (data: ManagerRes) => {
  return http.get('/auth-api/v1/user-mng/managers/search', {params: data});
}

const getManager = (id: any) => {
  return http.get(`/auth-api/v1/user-mng/manager/${id}`);
}

const postRegistrationSend = (data: SendRegistrationReq) => {
  return http.post('/auth-api/v1/user-mng/manager/registration/send', data);
}

const postRegistration = (data: RegistrationReq) => {
  return http.post('/auth-api/v1/user-mng/manager/registration', data);
}

const deleteManager = (id: any) => {
  return http.delete(`/auth-api/v1/user-mng/manager/${id}`);
}

const putManager = (data: ModifyManagerReq) => {
  return http.put('/auth-api/v1/user-mng/manager', data);
}

const putManagerPassword = (data: ChangePasswordReq) => {
  return http.put('/auth-api/v1/user-mng/manager/password/change', data);
}

const UserMngService = {
  getManagersSearch,
  getManager,
  postRegistrationSend,
  postRegistration,
  deleteManager,
  putManagerPassword,
  putManager,
};

export default UserMngService;

import { http } from '@/components/http';
import {
  ReqManager,
  Manager,
  ChangePassword,
  Registration,
  SendRegistration,
} from '@/types/UserMngTypes';

const getManagersSearch = (data: Manager) => {
  return http.get('/auth-api/v1/user-mng/managers/search', {params: data});
}

const getManager = (id: any) => {
  return http.get(`/auth-api/v1/user-mng/manager/${id}`);
}

const postRegistrationSend = (data: SendRegistration) => {
  return http.post('/auth-api/v1/user-mng/manager/registration/send', data);
}

const postRegistration = (data: Registration) => {
  return http.post('/auth-api/v1/user-mng/manager/registration', data);
}

const deleteManager = (id: any) => {
  return http.delete(`/auth-api/v1/user-mng/manager/${id}`);
}

const putManager = (data: Manager) => {
  return http.put('/auth-api/v1/user-mng/manager', data);
}

const putManagerPassword = (data: ChangePassword) => {
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

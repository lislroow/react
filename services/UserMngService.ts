import { http } from '@/components/http';
import {
  ReqManagers,
  Manager,
} from '@/types/UserMngTypes';

const getManagersSearch = (data: Manager) => {
  return http.get('/auth-api/v1/user-mng/managers/search', {params: data});
}

const getManager = (id: any) => {
  return http.get(`/auth-api/v1/user-mng/manager/${id}`);
}

const postManager = (data: Manager) => {
  return http.post('/auth-api/v1/user-mng/manager', data);
}

const deleteManager = (id: any) => {
  return http.delete(`/auth-api/v1/user-mng/manager/${id}`);
}

const putManager = (data: Manager) => {
  return http.put('/auth-api/v1/user-mng/manager', data);
}

const SampleService = {
  getManagersSearch,
  getManager,
  postManager,
  deleteManager,
  putManager,
};

export default SampleService;

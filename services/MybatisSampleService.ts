import { http } from '@/components/http';
import {
  SearchScientistReq,
  AddScientistReq,
  ModifyScientistReq,
} from '@/types/MybatisSampleType';

const getScientistsSearch = (data: SearchScientistReq) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const getScientist = (id: any) => {
  return http.get(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const postScientist = (data: AddScientistReq) => {
  return http.post('/story-api/v1/mybatis-sample/scientist', data);
}

const deleteScientist = (id: any) => {
  return http.delete(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const putScientist = (data: ModifyScientistReq) => {
  return http.put('/story-api/v1/mybatis-sample/scientist', data);
}

const SampleService = {
  getScientistsSearch,
  getScientist,
  postScientist,
  deleteScientist,
  putScientist,
};

export default SampleService;

import { http } from '@/components/http';
import {
  ReqScientists,
  Scientists,
} from '@/types/SampleType';

const getScientistsSearch = (data: ReqScientists) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const getScientist = (id: any) => {
  return http.get(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const postScientistsSearch = (data: Scientists) => {
  return http.post('/story-api/v1/mybatis-sample/scientist', data);
}

const deleteScientistsSearch = (id: any) => {
  return http.delete(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const putScientistsSearch = (data: Scientists) => {
  return http.put('/story-api/v1/mybatis-sample/scientist', data);
}

const SampleService = {
  getScientistsSearch,
  getScientist,
  postScientistsSearch,
  deleteScientistsSearch,
  putScientistsSearch,
};

export default SampleService;

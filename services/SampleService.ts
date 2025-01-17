import { http } from '@/components/http';
import {
  ReqScientists,
  Scientist,
} from '@/types/SampleType';

const getScientistsSearch = (data: ReqScientists) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const getScientist = (id: any) => {
  return http.get(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const postScientist = (data: Scientist) => {
  return http.post('/story-api/v1/mybatis-sample/scientist', data);
}

const deleteScientist = (id: any) => {
  return http.delete(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const putScientist = (data: Scientist) => {
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

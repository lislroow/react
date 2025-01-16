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

const postScientistsSearch = (data: Scientist) => {
  return http.post('/story-api/v1/mybatis-sample/scientist', data);
}

const deleteScientistsSearch = (id: any) => {
  return http.delete(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const putScientistsSearch = (data: Scientist) => {
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

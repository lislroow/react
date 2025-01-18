import { http } from '@/components/http';
import {
  ScientistSearchReq as ScientistSearchReq,
  ScientistAddReq as ScientistAddReq,
  ScientistModifyReq as ScientistModifyReq,
} from '@/types/MybatisSampleType';

const getScientistsSearch = (data: ScientistSearchReq) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const getScientist = (id: any) => {
  return http.get(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const postScientist = (data: ScientistAddReq) => {
  return http.post('/story-api/v1/mybatis-sample/scientist', data);
}

const deleteScientist = (id: any) => {
  return http.delete(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const putScientist = (data: ScientistModifyReq) => {
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

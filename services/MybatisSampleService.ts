import { http, excelDown } from '@/components/http';
import {
  ScientistSearchReq,
  ScientistAddReq,
  ScientistModifyReq,
} from '@/types/MybatisSampleType';

const getScientistsAllExcelDown = () => {
  excelDown('/story-api/excel-down/v1/mybatis-sample/scientists/all');
}
const getScientistsSearchExcelDown = (data: ScientistSearchReq) => {
  excelDown('/story-api/excel-down/v1/mybatis-sample/scientists/search', data);
}
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

const MybatisSampleService = {
  getScientistsAllExcelDown,
  getScientistsSearchExcelDown,
  getScientistsSearch,
  getScientist,
  postScientist,
  deleteScientist,
  putScientist,
};

export default MybatisSampleService;

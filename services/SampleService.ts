import { http } from '@/components/http';
import {
  ReqScientists,
} from '@/types/SampleType';

const getScientistsSearch = (data: ReqScientists) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const getScientist = (id: any) => {
  return http.get(`/story-api/v1/mybatis-sample/scientist/${id}`);
}

const SampleService = {
  getScientistsSearch,
  getScientist,
};

export default SampleService;

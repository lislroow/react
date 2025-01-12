import { http } from 'lib/http';

import {
  ReqScientists,
} from 'types/SampleType';

const getScientistsSearch = (data: ReqScientists) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const SampleService = {
  getScientistsSearch,
};

export default SampleService;

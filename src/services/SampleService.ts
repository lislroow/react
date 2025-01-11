import { http } from 'lib/http';

import {
  reqScientists,
} from 'types/SampleType';

const getScientistsSearch = (data: reqScientists) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const SampleService = {
  getScientistsSearch,
};

export default SampleService;

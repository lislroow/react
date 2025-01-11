import { http } from 'utils/http';

import {
  reqPagedScientists,
  resPagedScientists,
} from 'types/SampleType';

const getScientistsSearch = (data: reqPagedScientists) => {
  return http.get('/story-api/v1/mybatis-sample/scientists/search', {params: data});
}

const SampleService = {
  getScientistsSearch,
};

export default SampleService;

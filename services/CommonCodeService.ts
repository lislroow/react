import { http } from '@/components/http';
import {
  ReqCodeGroups,
  ReqCodes,
} from '@/types/CommonCodeType';

const getCommonCodeMngCodeGroupssSearch = (data: ReqCodeGroups) => {
  return http.get('/story-api/v1/common-code/mng/codes/search', {params: data});
}

const getCommonCodeMngCodesSearch = (data: ReqCodes) => {
  return http.get('/story-api/v1/common-code/mng/codes/search', {params: data});
}

const SampleService = {
  getCommonCodeMngCodeGroupssSearch,
  getCommonCodeMngCodesSearch,
};

export default SampleService;

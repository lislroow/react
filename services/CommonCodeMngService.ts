import { http } from '@/components/http';
import {
  ReqCodeGroups,
  ReqCodes,
} from '@/types/CommonCodeType';

const getCodeGroupssSearch = (data: ReqCodeGroups) => {
  return http.get('/story-api/v1/common-code/mng/codes/search', {params: data});
}

const getCodesSearch = (data: ReqCodes) => {
  return http.get('/story-api/v1/common-code/mng/codes/search', {params: data});
}

const CommonCodeMngService = {
  getCodeGroupssSearch,
  getCodesSearch,
};

export default CommonCodeMngService;

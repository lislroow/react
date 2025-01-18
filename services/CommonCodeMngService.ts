import { http } from '@/components/http';
import {
  CodeGroupSearchReq,
  CodeSearchReq,
} from '@/types/CommonCodeType';

const getCodeGroupsSearch = (data: CodeGroupSearchReq) => {
  return http.get('/story-api/v1/common-code/mng/code-groups/search', {params: data});
}

const getCodesSearch = (data: CodeSearchReq) => {
  return http.get('/story-api/v1/common-code/mng/codes/search', {params: data});
}

const CommonCodeMngService = {
  getCodeGroupssSearch: getCodeGroupsSearch,
  getCodesSearch,
};

export default CommonCodeMngService;

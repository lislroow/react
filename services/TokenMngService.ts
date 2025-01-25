import { http } from '@/components/http';
import {
  SearchClientTokenReq,
} from '@/types/TokenMngTypes';

const getClientTokensSearch = (data: SearchClientTokenReq) => {
  return http.get('/auth-api/v1/token-mng/search', {params: data});
}

const postClientToken = (data: SearchClientTokenReq) => {
  return http.post('/auth-api/v1/token-mng/token-client', data);
}


const TokenMngService = {
  getClientTokensSearch,
  postClientToken,
};

export default TokenMngService;

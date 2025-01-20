import { http } from '@/components/http';
import {
  SearchClientTokenReq,
} from '@/types/TokenMngTypes';

const getSearchClientTokens = (data: SearchClientTokenReq) => {
  return http.get('/auth-api/v1/token-mng/search', {params: data});
}

const postAddClientToken = (data: SearchClientTokenReq) => {
  return http.post('/auth-api/v1/token-mng/token-client', data);
}


const TokenMngService = {
  getSearchClientTokens,
  postAddClientToken,
};

export default TokenMngService;

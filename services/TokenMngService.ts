import { http } from '@/components/http';
import {
  ClientTokenSearchReq,
} from '@/types/TokenMngTypes';

const getTokensSearch = (data: ClientTokenSearchReq) => {
  return http.get('/auth-api/v1/token-mng/search', {params: data});
}


const TokenMngService = {
  getTokensSearch,
};

export default TokenMngService;

import { http } from '@/components/http';
import {
  TokenSearchReq,
} from '@/types/TokenMngTypes';

const getTokensSearch = (data: TokenSearchReq) => {
  return http.get('/auth-api/v1/token-mng/search', {params: data});
}


const TokenMngService = {
  getTokensSearch,
};

export default TokenMngService;

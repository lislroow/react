import { excelDown, http } from '@/components/http';
import {
  FundMstSearchReq,
} from '@/types/FundType';

// planet
const getFundMstsSearch = (data: FundMstSearchReq) => {
  return http.get('/story-api/v1/fund/fund-mst/search', {params: data});
}


const FundService = {
  getFundMstsSearch,
};

export default FundService;

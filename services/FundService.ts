import { excelDown, http } from '@/components/http';
import {
  FundMstSearchReq,
} from '@/types/FundType';

const getFundMstsSearch = (data: FundMstSearchReq) => {
  return http.get('/story-api/v1/fund/fund-mst/search', {params: data});
}
const getIrLineChart = (fundCd: string) => {
  return http.get(`/story-api/v1/fund/ir/line-chart/${fundCd}`);
}


const FundService = {
  getFundMstsSearch,
  getIrLineChart,
};

export default FundService;

// satellite
export interface FundMstSearchReq {
  fundCd?: string;
  fundFnm?: string;
  page?: number;
  size?: number;
}
export interface FundMstSearchRes {
  fundCd?: string; // 펀드코드
  amcCd?: string;
  amcFundCd?: string;
  fundFnm?: string; // 펀드명
  fundGb?: string;
  kitcaSortCd?: string;
  xtypeLcd?: string;
  xtypeCd?: string;
  unitPrice?: number; // 단위가
  basUnit?: number;
  seoljYmd?: string; // 설정일
  chgYmd?: string;
  haejiGb?: string;
  haejiYmd?: string;
  fstSeoljAek?: number; // 최초설정액
  fstSeoljJwa?: number; // 최초설정좌수
  fstGijunGa?: number; // 최초기준가
  stockPnibRt?: number;
  kosdaqPnibRt?: number;
  bmCd?: string;
  bmNm?: string;
  bmEnm?: string;
  excHdgeYnCd?: string;
  kitcaTypeCd?: string;
}

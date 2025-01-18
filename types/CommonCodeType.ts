export interface CodeGroupSearchReq {
  cdGrp?: string;
  page?: number;
  size?: number;
}
export interface CodeSearchReq {
  cdGrp?: string;
  cdGrpNm?: string;
  cd?: string;
  cdNm?: string;
  useYn?: string;
  page?: number;
  size?: number;
}

export interface CodeGroupSearchRes {
  cdGrp?: string;
  cdGrpNm?: string;
  useYn?: string;
}

export interface CodeSearchRes {
  cdGrp?: string;
  cdGrpNm?: string;
  cd?: string;
  seq?: number;
  cdNm?: string;
  useYn?: string;
}

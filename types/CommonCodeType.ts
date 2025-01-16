export interface ReqCodeGroups {
  cdGrp?: string;
}

export interface ResCodeGroups {
  cdGrp?: string;
  cdGrpNm?: string;
  useYn?: string;
}

export interface ReqCodes {
  cdGrp?: string;
  cdGrpNm?: string;
  cd?: string;
  cdNm?: string;
  useYn?: string;
}

export interface ResCodes {
  cdGrp?: string;
  cdGrpNm?: string;
  cd?: string;
  seq?: number;
  cdNm?: string;
  useYn?: string;
}

export interface Code {
  cdGrp?: string;
  cdGrpNm?: string;
  cd?: string;
  seq?: number;
  cdNm?: string;
  useYn?: string;
}

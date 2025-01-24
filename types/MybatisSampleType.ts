export interface ScientistSearchReq {
  name?: string;
  fosCd?: string;
  century?: number;
  page?: number;
  size?: number;
}

export interface ScientistSearchRes {
  id: number;
  name: string;
  fosNm: string;
  birthYear: number;
  deathYear: number;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

export interface ScientistAddReq {
  name: string;
  birthYear: number;
  deathYear: number;
  fosCd: string;
}

export interface ScientistModifyReq {
  id: number;
  name: string;
  birthYear: number;
  deathYear: number;
  fosCd: string;
}

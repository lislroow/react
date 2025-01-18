export interface SearchScientistReq {
  name?: string;
  fosCd?: string;
  page?: number;
  size?: number;
}

export interface ScientistRes {
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

export interface ModifyScientistReq {
  id: number;
  name: string;
  birthYear: number;
  deathYear: number;
  fosCd: string;
}

export interface AddScientistReq {
  name: string;
  birthYear: number;
  deathYear: number;
  fosCd: string;
}

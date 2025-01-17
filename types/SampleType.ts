export interface ReqScientist {
  name?: string;
  fosCd?: string;
  page?: number;
  size?: number;
}

export interface ResScientist {
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

export interface Scientist {
  id: number;
  name: string;
  fosCd: string;
  birthYear: number;
  deathYear: number;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

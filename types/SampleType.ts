export interface ReqScientists {
  name?: string;
  fosCd?: string;
  page?: number;
  size?: number;
}

export interface ResScientists {
  id: number;
  name: string;
  fosNm: string;
  birthYear: number;
  deathYear: number;
}

export interface Scientist {
  id: number;
  name: string;
  fosCd: string;
  birthYear: number;
  deathYear: number;
}

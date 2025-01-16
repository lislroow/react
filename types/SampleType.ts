export interface ReqScientists {
  name?: string;
  page?: number;
  size?: number;
}

export interface ResScientists {
  id: number;
  name: string;
  birthYear: number;
  deathYear: number;
}

export interface Scientist {
  id: number;
  name: string;
  birthYear: number;
  deathYear: number;
}

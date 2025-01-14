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

export interface Scientists {
  id: number;
  name: string;
  birthYear: number;
  deathYear: number;
}

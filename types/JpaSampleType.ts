export interface StarSearchReq {
  name?: string;
  page?: number;
  size?: number;
}

export interface StarSearchRes {
  id: number;
  name: string;
  distance: number;
  brightness: number;
  mass: number;
  temperature: number;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

export interface StarAddReq {
  name: string;
  distance: number;
  brightness: number;
  mass: number;
  temperature: number;
}

export interface StarModifyReq extends StarAddReq {
  id: number;
}

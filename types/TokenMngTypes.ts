export interface TokenSearchReq {
  tokenId?: string;
  id?: string;
  clientIp?: string;
  useYn?: string;
  page?: number;
  size?: number;
}

export interface TokenSearchRes {
  tokenId?: string;
  id?: string;
  clientIp?: string;
  useYn?: string;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

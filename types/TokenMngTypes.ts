export interface TokenSearchReq {
  tokenId?: string;
  clientId?: string;
  enableYn?: string;
  lockedYn?: string;
  page?: number;
  size?: number;
}

export interface TokenSearchRes {
  tokenId?: string;
  clientId?: string;
  enableYn?: string;
  lockedYn?: string;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

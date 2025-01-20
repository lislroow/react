export interface ClientTokenSearchReq {
  clientId?: string;
  tokenKey?: string;
  contactName?: string;
  enableYn?: string;
  page?: number;
  size?: number;
}

export interface ClientTokenSearchRes {
  contactName?: string;
  contactEmail?: string;
  tokenKey?: string;
  clientId?: string;
  clientIp?: string;
  clientName?: string;
  roles?: string;
  enableYn?: string;
  expDate?: string;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

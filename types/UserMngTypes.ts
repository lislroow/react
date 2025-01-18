export interface Manager {
  id?: string;
  loginId?: string;
  mgrName?: string;
  role?: string;
  disabledYn?: string;
  lockedYn?: string;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

export interface ReqManager {
  loginId?: string;
  mgrName?: string;
  role?: string;
  disabledYn?: string;
  lockedYn?: string;
  page?: number;
  size?: number;
}

export interface ResManager {
  id?: string;
  loginId?: string;
  mgrName?: string;
  role?: string;
  disabledYn?: string;
  lockedYn?: string;
  pwdExpDate?: string;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}

export interface ChangePassword {
  id?: string;
  currentLoginPwd?: string;
  newLoginPwd?: string;
  confirmLoginPwd?: string;
}

export interface SendRegistration {
  toEmail?: string;
  toName?: string;
  grantRole?: string;
}

export interface Registration {
  registerCode?: string;
  newLoginPwd?: string;
  confirmLoginPwd?: string;
}

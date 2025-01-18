export interface ManagerSearchReq {
  loginId?: string;
  mgrName?: string;
  roles?: string;
  disabledYn?: string;
  lockedYn?: string;
  page?: number;
  size?: number;
}


export interface ManagerModifyReq {
  id?: string;
  roles?: string;
  disabledYn?: string;
  lockedYn?: string;
}

export interface ManagerSearchRes {
  id?: string;
  loginId?: string;
  mgrName?: string;
  roles?: string;
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

export interface ChangePasswordReq {
  id?: string;
  currentLoginPwd?: string;
  newLoginPwd?: string;
  confirmLoginPwd?: string;
}

export interface SendRegistrationReq {
  toEmail?: string;
  toName?: string;
  grantRoles?: string;
}

export interface RegistrationReq {
  registerCode?: string;
  newLoginPwd?: string;
  confirmLoginPwd?: string;
}

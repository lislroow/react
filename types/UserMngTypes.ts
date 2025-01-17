export interface Manager {
  id?: string;
  loginId?: string;
  mgrName?: string;
  role?: string;
  disabledYn?: string;
  lockedYn?: string;
}

export interface ReqManagers {
  loginId?: string;
  mgrName?: string;
  role?: string;
  disabledYn?: string;
  lockedYn?: string;
  page?: number;
  size?: number;
}

export interface ResManagers {
  id?: string;
  loginId?: string;
  mgrName?: string;
  role?: string;
  disabledYn?: string;
  lockedYn?: string;
  pwdExpDate?: string;
}

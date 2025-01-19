import {
  AllCodeRes
} from "@/types/CodeType";
import { MenuInfo } from "@/types/CommonType";
import { UserInfo } from "@/types/UserTypes";


const clear = (): void => {
  localStorage.clear();
  sessionStorage.clear();
}

const hasCodes = (): boolean => {
  return localStorage.getItem('code') ? true : false;
}
const setCodes = (data?: AllCodeRes[]): void => {
  localStorage.setItem('code', JSON.stringify(data));
}
const getCodes = (): AllCodeRes[] => {
  return JSON.parse(localStorage.getItem('code'));
}

const setLastActiveTime = (now?: number): void => {
  localStorage.setItem('lastActiveTime', now.toString());
}
const getLastActiveTime = (): number => {
  const lastActiveTime = localStorage.getItem('lastActiveTime');
  return lastActiveTime ? parseInt(lastActiveTime) : 0;
}

const setX_RTKID = (rtkUuid: string): void => {
  localStorage.setItem('X-RTKID', rtkUuid);
}
const getX_RTKID = (): string => {
  return localStorage.getItem('X-RTKID');
}

const setX_ATKID = (rtkUuid: string): void => {
  localStorage.setItem('X-ATKID', rtkUuid);
}
const getX_ATKID = (): string => {
  return localStorage.getItem('X-ATKID');
}

const setX_SESSION_SEC = (clientSessionSec?: number): void => {
  localStorage.setItem('X-SESSION-SEC', clientSessionSec.toString());
}
const getX_SESSION_SEC = (def?: number): number => {
  const sessionSec = localStorage.getItem('X-SESSION-SEC');
  return sessionSec ? parseInt(sessionSec) : def;
}

const setUser = (user?: UserInfo): void => {
  localStorage.setItem('user', JSON.stringify(user));
}
const getUser = (): UserInfo => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

const setMenu = (menu?: any): void => {
  localStorage.setItem('menu', JSON.stringify(menu));
}
const getMenu = (): MenuInfo[] => {
  const menu = localStorage.getItem('menu');
  return menu ? JSON.parse(menu) : null;
}

const storage = {
  clear,
  hasCodes,
  setCodes,
  getCodes,
  setLastActiveTime,
  getLastActiveTime,
  setX_RTKID,
  getX_RTKID,
  setX_ATKID,
  getX_ATKID,
  setX_SESSION_SEC,
  getX_SESSION_SEC,
  setUser,
  getUser,
  setMenu,
  getMenu,
};

export default storage;

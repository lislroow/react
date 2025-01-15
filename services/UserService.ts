import { Cookies } from 'react-cookie';
import { NextRouter, useRouter } from 'next/router';

import { http } from '@/components/http';

const login = (formData: FormData) => {
  return http.post('/auth-api/v1/member/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

const loginBySocial = (social: string) => {
  const router = useRouter();
  switch (social) {
  case 'google':
  case 'kakao':
  case 'naver':
    break;
  default:
    console.log(`${social} login not allowed`);
    return;
  }
  router.push(`/auth-api/v1/member/login/oauth2/authorization/${social}`);
}

const isLogin = (): Boolean => {
  return localStorage.getItem('X-RTKID') !== null;
};

const logout = (router: NextRouter) => {
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  Object.entries(allCookies).map(([key, value]) => {
    cookies.remove(key);
  });
  localStorage.clear();
  sessionStorage.clear();
  router.push(`/auth-api/v1/member/logout?redirect_uri=/`);
};

const updateLastAccess = () => {
  localStorage.setItem('lastAccess', Date.now()+'');
};

const getRemainTime = (): number => {
  const lastAccess = Number(localStorage.getItem('lastAccess') ?? -1);
  const expireTime = Math.floor((lastAccess - Date.now()) / 1000) + 1800;
  return expireTime < 0 ? -1 : expireTime;
}

const getUserInfo = () => {
  const userType = localStorage.getItem('X-RTKID')?.split(":")[0] || '';
  switch (userType) {
    case 'member':
      return getMemberInfo();
    case 'manager':
      return getManagerInfo();
    default:
      console.log(`${userType} is not yet!`);
      return null;
    }
}

const getUserType = (): string => {
  return localStorage.getItem('X-RTKID')?.split(":")[0] || '';
}

const getMemberInfo = () => {
  return http.get('/auth-api/v1/user/member/info', {});
}

const getManagerInfo = () => {
  return http.get('/auth-api/v1/user/manager/info', {});
}

const UserService = {
  login,
  loginBySocial,
  isLogin,
  logout,
  updateLastAccess,
  getRemainTime,
  getUserType,
  getUserInfo,
  getMemberInfo,
  getManagerInfo,
};

export default UserService;

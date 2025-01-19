import { Cookies } from 'react-cookie';
import { NextRouter, useRouter } from 'next/router';

import { getLastActiveTime, http } from '@/components/http';
import storage from '@/components/storage';

const loginByIdPwd = (userType: string, formData: FormData) => {
  if (userType === 'manager') {
    return http.post('/auth-api/v1/manager/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } else if (userType === 'member') {
    return http.post('/auth-api/v1/member/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
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
  return storage.getX_RTKID() !== null;
};

const logout = (router: NextRouter) => {
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  Object.entries(allCookies).map(([key, value]) => {
    cookies.remove(key);
  });
  storage.clear();
  router.push(`/auth-api/v1/member/logout?redirect_uri=/`);
};

const updateLastAccessTime = () => {
  storage.setLastActiveTime(Date.now());
};

const getRemainTime = (): number => {
  const lastAccess = storage.getLastActiveTime();
  const sessionSec = storage.getX_SESSION_SEC(1800);
  const expireTime = Math.floor((lastAccess - Date.now()) / 1000) + sessionSec;
  return expireTime < 0 ? -1 : expireTime;
}

const getUserType = (): string => {
  return storage.getX_RTKID()?.split(":")[0] || '';
}

const getInfo = () => {
  return http.get(`/auth-api/v1/user/info`, {});
}

const UserService = {
  loginByIdPwd,
  loginBySocial,
  isLogin,
  logout,
  updateLastAccessTime,
  getRemainTime,
  getUserType,
  getInfo,
};

export default UserService;

import { Cookies } from 'react-cookie';

import { http } from 'utils/http';

const login = (formData: FormData) => {
  return http.post('/auth-api/v1/member/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

const loginBySocial = (social: string) => {
  switch (social) {
  case 'google':
  case 'kakao':
  case 'naver':
    break;
  default:
    console.log(`${social} login not allowed`);
    return;
  }
  window.location.replace(`/auth-api/v1/member/login/oauth2/authorization/${social}`);
}

const isLogin = (): Boolean => {
  return localStorage.getItem('X-RTKID') !== null;
};

const logout = () => {
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  Object.entries(allCookies).map(([key, value]) => {
    cookies.remove(key);
  });
  localStorage.clear();
  sessionStorage.clear();
  console.log('logout');
  window.location.href = `/auth-api/v1/member/logout?redirect_uri=/`;
};

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
  getUserType,
  getUserInfo,
  getMemberInfo,
  getManagerInfo,
};

export default UserService;

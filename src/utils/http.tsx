import { Cookies } from 'react-cookie';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import storeFooter, { actFooterMessage } from 'redux-store/store-footer';
import { setLastAccess, getLastAccess } from 'utils/storage';

import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { error } from 'console';

export type TypeHttpCallback = (res?: Response) => void;

export const asyncGET = (url: string, callback: TypeHttpCallback, searchParam?: URLSearchParams) => {
  const fetchData = async() => {
    const api = searchParam === undefined || searchParam.size === 0
       ? `${url}`
       : `${url}?${searchParam}`;
    const headers = new Headers({
      "Authorization": "Bearer " + localStorage.getItem('X-ATKID')
    });
    const res: Response = await fetch(api, {
      method: "GET",
      headers: headers
    });
    setLastAccess();
    return res;
  };
  fetchData()
    .then(res => {
      const originRes = res.clone();
      originRes.json()
        .then(json => {
          if (!res.ok) {
            if (json.title === 'A100') {
              refreshToken(() => asyncGET(url, callback, searchParam));
            } else {
              console.log(JSON.stringify(json));
              storeAlert.dispatch(actAlertShow(json.title, json.detail));
            }
          } else if (res.ok) {
            callback(res);
          }
        });
    });
  };

export const refreshToken = (onSuccess: () => void) => {
  const fetchData = async() => {
    const api = '/auth-api/v1/token/refresh';
    const body = JSON.stringify({ "rtkUuid": localStorage.getItem('X-RTKID') });
    const res = await fetch(api, {
      method: 'post',
      headers: {
        "Content-Type":"application/json; charset=utf-8"
      },
      body: body
    });
    return res;
  };
  fetchData()
    .then(res => {
      res.json()
        .then(json => {
          if (res.ok) {
            localStorage.setItem('X-RTKID', json.rtkUuid);
            localStorage.setItem('X-ATKID', json.atkUuid);
            if (onSuccess) onSuccess();
          } else if (json.title === 'A200') {
            storeAlert.dispatch(actAlertShow(json.title, '세션이 만료되었습니다.'));
            logout();
          } else {
            storeAlert.dispatch(actAlertShow(json.title, json.detail));
            logout();
          }
        });
    })
    ;
};
  
export const asyncPOST = (url: string, callback: TypeHttpCallback, data: any) => {
  const fetchData = async() => {
    const api = url;
    const body = JSON.stringify(data);
    const res = await fetch(api, {
      method: 'post',
      headers: {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization": "Bearer " + localStorage.getItem('X-ATKID')
      },
      body: body
    });
    setLastAccess();
    return res;
  };
  fetchData()
    .then(res => {
      const originRes = res.clone();
      originRes.json()
        .then(json => {
          if (!res.ok) {
            if (json.title === 'A100') {
              refreshToken(() => asyncPOST(url, callback, data));
            } else {
              console.log(JSON.stringify(json));
              storeAlert.dispatch(actAlertShow(json.title, json.detail));
            }
          } else if (res.ok) {
            callback(res);
          }
        });
    });
};
  
export const asyncPUT = (url: string, callback: TypeHttpCallback, data: any) => {
  const fetchData = async() => {
    const api = url;
    const body = JSON.stringify(data);
    const res = await fetch(api, {
      method: 'put',
      headers: {
        "Content-Type":"application/json; charset=utf-8",
        "Authorization": "Bearer " + localStorage.getItem('X-ATKID')
      },
      body: body
    });
    setLastAccess();
    return res;
  };
  fetchData()
    .then(res => {
      const originRes = res.clone();
      originRes.json()
        .then(json => {
          if (!res.ok) {
            if (json.title === 'A100') {
              refreshToken(() => asyncPUT(url, callback, data));
            } else {
              console.log(JSON.stringify(json));
              storeAlert.dispatch(actAlertShow(json.title, json.detail));
            }
          } else if (res.ok) {
            callback(res);
          }
        });
    });
};

export const logout = () => {
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  Object.entries(allCookies).map(([key, value]) => {
    cookies.remove(key);
  });
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = `/auth-api/v1/member/logout?redirect_uri=/`;
};

export const getLastActiveTime = (): number => {
  let lastActiveTime = localStorage.getItem('lastActiveTime');
  if (!lastActiveTime) {
    fetch(`/auth/v1/session`)
      .then((res) => res.json())
      .then((user) => console.log(JSON.stringify(user)));
    localStorage.setItem('lastActiveTime', Date.now().toString());
  }
  lastActiveTime = localStorage.getItem('lastActiveTime');
  return lastActiveTime ? parseInt(lastActiveTime) : 0;
};

export type TypeSelectUserCallback = (user?: any) => void;
export const selectUser = (callback: TypeSelectUserCallback) => {
  const fetchData = async() => {
    const headers = new Headers({
      "Authorization": "Bearer " + localStorage.getItem('X-ATKID')
    });
    const userType = localStorage.getItem('X-ATKID')?.split(':')[0];
    let url = '';
    switch (userType) {
    case 'member':
      url = '/auth-api/v1/user/member/info';
      break;
    case 'manager':
      url = '/auth-api/v1/user/manager/info';
      break;
    }
    const res: Response = await fetch(url, {
      method: "GET",
      headers: headers
    });
    setLastAccess();
    return res;
  };
  fetchData()
    .then(res => {
      const originRes = res.clone();
      originRes.json()
        .then(json => {
          if (!res.ok) {
            if (json.title === 'A100') {
              refreshToken(() => selectUser(callback));
            } else {
              console.log(JSON.stringify(json));
              storeAlert.dispatch(actAlertShow(json.title, json.detail));
            }
          } else if (res.ok) {
            callback(json);
          }
        });
    });
};

export const isLogin = (): Boolean => {
  return localStorage.getItem('X-RTKID') !== null;
};


// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

const transformResponse = function (res: any) {
  if (res) {
    if (typeof res === 'object') {
      return res;
    }
    if (res.type === 'ms-vnd/excel') {
      return res;
    } else {
      return JSON.parse(res);
    }
  } else {
    return res;
  }
};

export const http = axios.create({
  baseURL: `http://localhost`,
  timeout: 30000,
  transformResponse,
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
});

const interceptor = (axiosInstance: AxiosInstance) => (error: AxiosError<AxiosRequestConfig>) => {
  const _axios = axiosInstance;
  const originalRequest = error.config;
  return Promise.reject(error);
};

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenId = localStorage.getItem('X-ATKID');
    if (tokenId) {
      config.headers['Authorization'] = 'Bearer ' + tokenId;
      console.log('Authorization 추가');
    }
    return config;
  },
  (error: AxiosError) => {
    Promise.reject(error);
  }
);

http.interceptors.response.use((res: AxiosResponse) => {
  if (res.status < 400) {
    return res;
  } else {
    storeAlert.dispatch(actAlertShow(res.data.title, res.data.detail));
    return Promise.reject(res);
  }
}, interceptor(http));

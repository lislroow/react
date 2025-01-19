import router from 'next/router';
import storeAlert, { actAlertShow } from '@/components/redux-store/store-alert';
import UserService from '@/services/UserService';

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import storage from './storage';

export const getLastActiveTime = (): number => {
  let lastActiveTime = storage.getLastActiveTime();
  if (!lastActiveTime) {
    fetch(`/auth/v1/session`)
      .then((res) => res.json())
      .then((user) => console.log(JSON.stringify(user)));
    storage.setLastActiveTime(Date.now());
  }
  return storage.getLastActiveTime();
};


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

export const refreshToken = async () => {
  try {
    const response = await axios.post('/auth-api/v1/token/refresh', {
      "rtkUuid": storage.getX_RTKID()
    });
    const { rtkUuid, atkUuid, clientSessionSec } = response.data;
    storage.setX_RTKID(rtkUuid);
    storage.setX_ATKID(atkUuid);
    storage.setX_SESSION_SEC(clientSessionSec);
  } catch (error) {
    UserService.logout(router);
    throw error;
  }
};

const interceptor = (axiosInstance: AxiosInstance) => (error: AxiosError<any>) => {
  document.body.classList.remove('spinner');
  const _axios = axiosInstance;
  const originalRequest = error.config;
  if (error.response?.status === 401 && error.response?.data?.title === 'A100') {
    return refreshToken()
      .then(() => _axios(originalRequest!));
  } else {
    storeAlert.dispatch(actAlertShow(error.response?.data.title, error.response?.data.detail.split('\n')[0]));
  }
  return Promise.reject(error);
};

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenId = storage.getX_ATKID();
    if (tokenId) {
      config.headers['Authorization'] = 'Bearer ' + tokenId;
      UserService.updateLastAccessTime();
    }
    document.body.classList.add('spinner');
    return config;
  },
  (error: AxiosError) => {
    Promise.reject(error);
  }
);

http.interceptors.response.use((res: AxiosResponse) => {
  document.body.classList.remove('spinner');
  if (res.status < 400) {
    return res;
  } else if (res.status === 401 && res.data.title === 'A100') {
    console.log(JSON.stringify(res.data));
    return Promise.reject(res);
  } else {
    return Promise.reject(res);
  }
}, interceptor(http));

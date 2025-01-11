import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import { setLastAccess } from 'utils/storage';

import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

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

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post('/auth-api/v1/token/refresh', {
      "rtkUuid": localStorage.getItem('X-RTKID')
    });
    const { rtkUuid, atkUuid } = response.data;
    
    localStorage.setItem('X-RTKID', rtkUuid);
    localStorage.setItem('X-ATKID', atkUuid);
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw error;
  }
};


const interceptor = (axiosInstance: AxiosInstance) => (error: AxiosError<any>) => {
  const _axios = axiosInstance;
  const originalRequest = error.config;
  if (error.response?.status === 401 && error.response?.data?.title === 'A100') {
    return refreshAccessToken()
      .then(() => _axios(originalRequest!))
      .catch(refreshError => {
        console.error('토큰 갱신 중 오류 발생:', refreshError);
        return Promise.reject(refreshError);
      });
  }
  return Promise.reject(error);
};

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokenId = localStorage.getItem('X-ATKID');
    if (tokenId) {
      config.headers['Authorization'] = 'Bearer ' + tokenId;
      console.log('Authorization 추가');
      setLastAccess();
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
  } else if (res.status === 401 && res.data.title === 'A100') {
    console.log(JSON.stringify(res.data));
    return Promise.reject(res);
  } else {
    storeAlert.dispatch(actAlertShow(res.data.title, res.data.detail));
    return Promise.reject(res);
  }
}, interceptor(http));

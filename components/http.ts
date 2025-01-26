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

export const excelDown = (url: string, data?: any) => {
  axios
    .get(url, {
      responseType: 'blob',
      params: data,
    })
    .then((response) => {
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = URL.createObjectURL(blob);

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?="?([^"]+)"?/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1].replace(/UTF-8''/, ''));
        }
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    })
    .catch((error) => {
      if (error.status === 503) {
        storeAlert.dispatch(actAlertShow("503", "service unavailable"));
      } else {
        storeAlert.dispatch(actAlertShow("ERROR", "excel 다운로드에 실패했습니다."));
      }
    });
}

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
    const response = await axios.post('/auth-api/v1/token/refresh-token', {
      "rtk": storage.getX_RTK()
    });
    const { rtk, atk, session } = response.data;
    storage.setX_RTK(rtk);
    storage.setX_ATK(atk);
    storage.setX_SESSION(session);
    return response;
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
    const tokenId = storage.getX_ATK();
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



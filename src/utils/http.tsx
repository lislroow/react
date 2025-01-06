import { Cookies } from 'react-cookie';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import storeFooter, { actFooterMessage } from 'redux-store/store-footer';
import { setLastAccess, getLastAccess } from 'utils/storage';

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
            if (json.title === 'A002') {
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
          } else {
            console.log(JSON.stringify(json));
            storeAlert.dispatch(actAlertShow(json.title, json.detail));
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
            if (json.title === 'A002') {
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
            if (json.title === 'A002') {
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
  window.location.href = `/auth-api/v1/logout?redirect_uri=/`;
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
    const res: Response = await fetch('/story-api/v1/member/info', {
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
            if (json.title === 'A002') {
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
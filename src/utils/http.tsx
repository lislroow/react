import { Cookies } from 'react-cookie';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import storeFooter, { actFooterMessage } from 'redux-store/store-footer';
import { setLastAccess, getLastAccess } from './storage';

import { TypeUser } from '../types/TypeUser';

export type TypeHttpCallback = (res?: Response) => void;

export const asyncGET = (url: string, callback: TypeHttpCallback, searchParam?: URLSearchParams) => {
  const fetchData = async() => {
    const api = searchParam === undefined || searchParam.size === 0
       ? `${url}`
       : `${url}?${searchParam}`;
    const res: Response = await fetch(api);
    setLastAccess();
    return res;
  };
  fetchData()
    .then(res => {
      const contentType = res.headers.get('Content-Type');
      if (res.ok) {
        if (!contentType?.includes('application/json')) {
          const [title, message] = ['ERROR', `응답 header 의 Content-Type 은 'application/json' 이 되어야 합니다.`];
          storeAlert.dispatch(actAlertShow(title, message));
          return undefined;
        }
        storeFooter.dispatch(actFooterMessage(`STATUS: ${res.status}`));
      } else {
        if (res.status === 403) {
          const [title, message] = ['ERROR', '사용자 권한 혹은 로그인 상태를 확인해주세요.'];
          storeAlert.dispatch(actAlertShow(title, message));
        }
        storeFooter.dispatch(actFooterMessage(`STATUS: ${res.status}, ${res.statusText}`));
      }
      return res;
    })
    .then(res => callback(res))
    ;
  };
  
export const asyncPOST = (url: string, callback: TypeHttpCallback, data: any) => {
  const fetchData = async() => {
    const api = url;
    const body = JSON.stringify(data);
    const res = await fetch(api, {
      method: 'post',
      headers: {
        "Content-Type":"application/json; charset=utf-8"
      },
      body: body
    });
    setLastAccess();
    return res;
  };
  fetchData()
    .then(res => {
      const contentType = res.headers.get('Content-Type');
      if (res.ok) {
        if (!contentType?.includes('application/json')) {
          const [title, message] = ['ERROR', `응답 header 의 Content-Type 은 'application/json' 이 되어야 합니다.`];
          storeAlert.dispatch(actAlertShow(title, message));
          return undefined;
        }
        storeFooter.dispatch(actFooterMessage(`STATUS: ${res.status}`));
      } else {
        if (res.status === 403) {
          const [title, message] = ['ERROR', '사용자 권한 혹은 로그인 상태를 확인해주세요.'];
          storeAlert.dispatch(actAlertShow(title, message));
        }
        storeFooter.dispatch(actFooterMessage(`STATUS: ${res.status}, ${res.statusText}`));
      }
      return res;
    })
    .then(res => callback(res))
    ;
};
  
export const asyncPUT = (url: string, callback: TypeHttpCallback, data: any) => {
  const fetchData = async() => {
    const api = url;
    const body = JSON.stringify(data);
    const res = await fetch(api, {
      method: 'put',
      headers: {
        "Content-Type":"application/json; charset=utf-8"
      },
      body: body
    });
    setLastAccess();
    return res;
  };
  fetchData()
    .then(res => {
      const contentType = res.headers.get('Content-Type');
      if (res.ok) {
        storeFooter.dispatch(actFooterMessage(`STATUS: ${res.status}`));
      } else {
        if (res.status === 403) {
          const [title, message] = ['ERROR', '사용자 권한 혹은 로그인 상태를 확인해주세요.'];
          storeAlert.dispatch(actAlertShow(title, message));
        }
        if (res.status === 405) {
          const [title, message] = ['ERROR', 'HTTP 메소드 혹은 endpoint 의 파라미터를 확인해주세요.'];
          storeAlert.dispatch(actAlertShow(title, message));
        }
        storeFooter.dispatch(actFooterMessage(`STATUS: ${res.status}, ${res.statusText}`));
      }
      return res;
    })
    .then(res => callback(res))
    ;
};

export const logout = () => {
  const cookies = new Cookies();
  const allCookies = cookies.getAll();
  Object.entries(allCookies).map(([key, value]) => {
    cookies.remove(key);
  });
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = `/auth/logout?redirect_uri=${window.location.pathname}`;
};

export const getLastActiveTime = (): number => {
  let lastActiveTime = localStorage.getItem('lastActiveTime');
  if (!lastActiveTime) {
    fetch(`/api/auth/user`)
      .then((res) => res.json())
      .then((user) => console.log(JSON.stringify(user)));
    localStorage.setItem('lastActiveTime', Date.now().toString());
  }
  lastActiveTime = localStorage.getItem('lastActiveTime');
  return lastActiveTime ? parseInt(lastActiveTime) : 0;
};

export type TypeSelectUserCallback = (user?: any) => void;
export const selectUser = (callback: TypeSelectUserCallback) => {
  const call = async() => {
    // const res = await fetch(`/api/auth/user`);
    const res = await fetch(`/api/market/customer/my-info`);
    setLastAccess();
    return res;
  };
  call()
    .then((res) => {
      const obj = !res.ok ? {} : res.json();
      console.log(`response: ${JSON.stringify(obj)}`);
      return obj;
    })
    .then((obj) => {
      console.log(`response[2]: ${JSON.stringify(obj)}`)
      if (Object.keys(obj).length > 0) {
        callback(obj);
      } else {
        // TODO await sleep(2000);
        logout();
      }
    })
    .catch((error) => {})
    .finally()
    ;
};

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
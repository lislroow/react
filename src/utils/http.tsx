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
      const contentType = res.headers.get('Content-Type');
      if (res.ok) {
        storeFooter.dispatch(actFooterMessage(`STATUS: ${res.status}`));
      } else {
        console.log('error');
      }
      return res;
    })
    .then(res => {
      const originRes = res.clone();
      originRes.json()
        .then(json => {
          if (json.header.code === 'S000') {
            callback(res);
            // refreshToken(() => asyncGET(url, callback, searchParam));
          } else if (json.header.code === 'A002') {
            refreshToken(() => asyncGET(url, callback, searchParam));
          } else {
            console.log('error!!' + JSON.stringify(json));
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
      if (!res.ok) {
        console.log('error');
      }
      return res;
    })
    .then(res => {
      res.json()
        .then(json => {
          if (json.header.code === 'S000') {
            localStorage.setItem('X-RTKID', json.body.rtkUuid);
            localStorage.setItem('X-ATKID', json.body.atkUuid);
            if (onSuccess) onSuccess();
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
  window.location.href = `/auth/v1/logout?redirect_uri=/`;
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
  const call = async() => {
    // const res = await fetch(`/auth/v1/session`);
    const res = await fetch(`/customer/v1/my/user`);
    setLastAccess();
    return res;
  };
  call()
    .then((res) => {
      const json = !res.ok ? {} : res.json();
      return json;
    })
    .then((json) => {
      if (Object.keys(json).length > 0) {
        callback(json);
      } else {
        // TODO await sleep(2000);
        logout();
      }
    })
    .catch((error) => {})
    .finally()
    ;
};

export const isLogin = (): Boolean => {
  return localStorage.getItem('X-RTKID') !== null;
};


// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
import React, { useState, useEffect } from "react";
import { Cookies } from 'react-cookie';

import { Layout } from 'components/layout/Layout';

import { logout, getLastActiveTime, selectUser } from 'utils/http';
import { getLastAccess } from 'utils/storage';

import { TypeUser } from 'types/TypeUser';

const EX05 = () => {
  const calc = (): number => {
    const lastAccess = getLastAccess();
    const expire = Math.floor((lastAccess - Date.now()) / 1000) + 1800;
    return expire;
  };
  const [ expireTime, setExpireTime ] = useState<number>(calc());
  useEffect(() => {
    const timer = setInterval(() => {
      const time = calc();
      setExpireTime(time);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [expireTime]);

  // const [ user, setUser ] = useState<TypeUser>({});
  // let storageStr = localStorage.getItem('user');
  // if (!storageStr) {
  //   const logined = new Cookies().get('LOGINED');
  //   if (Object.keys(user).length > 0) {
  //     storageStr = JSON.stringify(user);
  //     localStorage.setItem('user', storageStr);
  //     setUser(JSON.parse(storageStr));  // useEffect 다시 실행 > 다시 실행 안 됨
  //     return;
  //   } else if (logined) {
  //     selectUser(setUser);
  //     return;
  //   }
  // } else {
  //   if (Object.keys(user).length === 0) {
  //     setUser(JSON.parse(storageStr));
  //   }
  // }

  return (
    <Layout>
      <div>
        <ul>
          <li>세션 만료까지 남은 시간: {expireTime} (현재시각: {new Date().toTimeString()}</li>
          {/* <li>사용자 정보: {JSON.stringify(user)}</li> */}
        </ul>
      </div>
    </Layout>
  )
};

export default EX05;
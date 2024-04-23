import React from "react";

import { Layout } from 'components/layout/Layout';
import { Cookies } from 'react-cookie';


const EX04 = () => {
  const cookies = new Cookies();
  const allGookies = cookies.getAll();
  return (
    <Layout>
      <div>
        <p>
          'user' 라는 이름의 cookie 가 있을 경우 아래에 처리 단계별로 cookie 값을 표시합니다. 
        </p>
        <p>
          'user' cookie 는 로그인 처리 과정의 마지막 부분에서 응답 header 에 'user' 라는 이름의 cookie 값을 보냅니다. (i.e 로그인이 필요함)
        </p>
        {
          cookies.get('user') == null 
          ? ''
          : <div>
              <hr />
              <ul>
                <li>1) { cookies.get('user') }</li>
                <li>2) { window.atob(cookies.get('user')) }</li>
                {/* <li>2) { Buffer.from(cookies.get('user'), 'base64').toString() }</li> */}
                {/* <li>3) { JSON.parse(Buffer.from(cookies.get('user'), 'base64').toString()).uid }</li> */}
              </ul>
            </div>
        }
        <hr/>
        <ul>
        {
          Object.entries(allGookies).map(([key, value]) => (
            typeof value === 'string' && <li key={key}>{key} : {value}</li>
          ))
        }
        </ul>
      </div>
    </Layout>
  )
};

export default EX04;
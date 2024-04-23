import React from "react";

import { Layout } from 'components/layout/Layout';

let list = [
  {
    userId: '001',
    userIcon: 'coffee'
  },
  {
    userId: '002',
    userIcon: 'hamburger'
  }
];

const EX03 = () => {
  
  return (
    <Layout>
      <ul>
        {
          list.map(item => (
            <li key={item.userId}>{item.userIcon}</li>
          ))
        }
      </ul>
    </Layout>
  )
};

export default EX03;
import React from 'react';

import { Layout } from 'components/layout/Layout';

const Login = () => {
  const message = 'hello';
  return (
    <Layout emptyLayout={true}>
      <div>
        {message}
      </div>
    </Layout>
  );
};

export default Login;
import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { Layout } from 'components/layout/Layout';
import { asyncPOST } from 'utils/http';

type TypeOrderREQ = {
  "quantity"?: number,
  "productId"?: number,
}


const Page = () => {
  let orderREQ: TypeOrderREQ[] = [];
  orderREQ = [
    {
        "quantity": 100,
        "productId": 1
    },
    {
        "quantity": 100,
        "productId": 2
    }
  ];
  const handleOrder = () => {
    asyncPOST('/api/admin/sample/order/order-products', callback, orderREQ);
  };
  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => console.log(JSON.stringify(json)));
  };
  useEffect(() => {
    //
  }, []);
  
  return (
    <Layout>
      <div>
        <Grid container spacing={1} justifyContent='flex-end'>
          <Grid item xs={12} sm={1.5} style={{textAlign: 'right'}}>
            <Button onClick={(e) => handleOrder()} variant="contained">order</Button>
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default Page;
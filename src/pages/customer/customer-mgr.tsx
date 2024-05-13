import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import { Button, TextField } from '@mui/material';

import { Layout } from 'components/layout/Layout';
import { asyncGET, asyncPOST } from 'utils/http';

type CustomerRES = {
  "id": string,
  "name"?: string,
  "email"?: string,
}


const Page = () => {
  let customerRES: CustomerRES;
  const [id, setId] = useState('12333');
  const [name, setName] = useState('123');
  const [email, setEmail] = useState('mgkim.net@gmail.com');
  const handleSave = () => {
    //asyncPOST('/api/admin/sample/order/order-products', callback, orderREQ);
  };
  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => console.log(JSON.stringify(json)));
  };
  useEffect(() => {
    asyncGET('/api/market/customer/my-info', callback);
  }, []);
  
  return (
    <Layout>
      <div>
        <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
          <Grid item xs={12} sm={4} md={3} lg={2} style={{textAlign: 'right'}}>
            <Button onClick={(e) => handleSave()} variant="contained">save</Button>
          </Grid>
        </Grid>
        <Grid container spacing={1} alignItems='center'>
          <Grid item xs={4}>
            <TextField
              margin="normal"
              disabled
              required
              fullWidth
              id="id"
              name="id"
              label="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              margin="normal"
              disabled
              required
              fullWidth
              id="name"
              name="name"
              label="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              margin="normal"
              disabled
              required
              fullWidth
              id="email"
              name="email"
              label="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default Page;
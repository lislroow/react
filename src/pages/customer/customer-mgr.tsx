import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import { Box, Button, TextField } from '@mui/material';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import { Layout } from 'components/layout/Layout';
import { asyncGET, asyncPUT } from 'utils/http';

type Customer = {
  "id": string,
  "name"?: string,
  "email"?: string,
  "password"?: string,
  "password_confirm"?: string,
}

type CustomerREQ = {
  "id": string,
  "name"?: string,
}


const Page = () => {
  const [customer, setCustomer] = useState<Customer>({ id: '' });
  const handleBasicSave = () => {
    const req: CustomerREQ = { id: customer.id, name: customer.name };
    asyncPUT('/api/market/customer/save-basic-info', callbackBasicSave, req);
  };

  const callbackBasicSave = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    const [title, message] = ['SUCCESS', `저장 되었습니다.`];
    storeAlert.dispatch(actAlertShow(title, message));
  };

  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => {
        setCustomer(json);
      });
  };
  useEffect(() => {
    asyncGET('/api/market/customer/my-info', callback);
  }, []);
  
  return (
    <Layout>
      <Box
        component="form"
        noValidate
        autoComplete="off">
        <div>
          <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
            <Grid item xs={12} sm={4} md={3} lg={2} style={{textAlign: 'right'}}>
              <Button onClick={(e) => handleBasicSave()} variant="contained">save</Button>
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems='center'>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
                fullWidth
                id="id"
                name="id"
                label="id"
                value={customer.id}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
                fullWidth
                id="email"
                name="email"
                label="email"
                value={customer.email}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                fullWidth
                id="name"
                name="name"
                label="name"
                value={customer.name}
                onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
              />
            </Grid>
          </Grid>
          
          {/* <Grid container spacing={1} alignItems='center'>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                fullWidth
                id="password"
                name="password"
                label="password"
                value={customer.password}
                type="password"
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems='center'>
            <Grid item xs={12} sm={4}>
              <TextField
                margin="normal"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                fullWidth
                id="password_confirm"
                name="password_confirm"
                label="password confirm"
                value={customer.password_confirm}
                type="password"
              />
            </Grid>
          </Grid> */}
          
        </div>
      </Box>
    </Layout>
  )
}

export default Page;
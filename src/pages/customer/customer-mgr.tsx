import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import { Box, Button, TextField, FormControl, Checkbox, FormControlLabel, Typography } from '@mui/material';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import storeUser, { actUpdate } from 'redux-store/store-user';
import { TypeUser } from 'types/TypeUser';
import { Layout } from 'components/layout/Layout';
import { isLogin, asyncGET, asyncPUT } from 'utils/http';

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

type Delivery = {
  "id"?: string,
  "address"?: string,
  "primaryYn"?: string,
}

const Page = () => {
  const [customer, setCustomer] = useState<Customer>({ id: '' });
  const [deliveryList, setDeliveryList] = useState<Delivery[]>([]);

  // 기본정보 저장
  const callbackSaveMyinfo = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    const [title, message] = ['SUCCESS', `기본 정보가 저장 되었습니다.`];
    storeAlert.dispatch(actAlertShow(title, message));
    
    res.json()
      .then(json => {
        storeUser.dispatch(actUpdate(json.body));
      });
  };
  const handleSaveMyinfo = () => {
    const req: CustomerREQ = { id: customer.id, name: customer.name };
    asyncPUT('/customer/v1/my/info', callbackSaveMyinfo, req);
  };

  // 배송지 추가
  const handleAddDelivery = () => {
    setDeliveryList([ ...deliveryList, {}]);
  };
  
  // 배송지 저장
  const callbackSaveDelivery = (res?: Response) => {
    if (res === undefined || !res.ok) {
      const [title, message] = ['ERROR', `배송지 저장 중 오류가 발생했습니다.`];
      storeAlert.dispatch(actAlertShow(title, message));
      return;
    }
    const [title, message] = ['SUCCESS', `배송지가 저장 되었습니다.`];
    storeAlert.dispatch(actAlertShow(title, message));
    
    res.json()
      .then(json => {
        setDeliveryList(json.body);
      });
  };

  const handleSaveDeliveryList = () => {
    const req = deliveryList.filter(delivery => delivery.address);
    console.log(JSON.stringify(req));
    asyncPUT('/customer/v1/my/delivery-address', callbackSaveDelivery, req);
  };

  const handleCheckboxChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedList = deliveryList.map((delivery, i) => {
      if (index === i) {
        return { ...delivery, primaryYn: 'Y' };
      } else {
        return { ...delivery, primaryYn: 'N' };
      }
    });
    setDeliveryList(updatedList);
  };

  // 기본정보 조회
  const callbackRetrieveMyinfo = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => {
        setCustomer(json.body);
      });
  };

  // 배송지 조회
  const callbackRetrieveDeliveryList = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => {
        setDeliveryList(json.body);
      });
  };

  useEffect(() => {
    if (isLogin()) {
      asyncGET('/customer/v1/my/info', callbackRetrieveMyinfo);
      asyncGET('/customer/v1/my/delivery-address', callbackRetrieveDeliveryList);
    }
  }, []);
  
  return (
    <Layout>
      <Box
        component="form"
        noValidate
        autoComplete="off">
        <div>
          <Grid container spacing={1} alignItems='center'>
            <Grid item xs={12}>
              <Grid container alignItems='center'>
                <Grid item xs={12}>
                  <Typography>- 기본정보</Typography>
                </Grid>
              </Grid>
              <Grid container alignItems='center'>
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
                    value={customer.id || ''}
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
                    value={customer.email || ''}
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
                    value={customer.name || ''}
                    onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
                  <Grid item xs={12} sm={4} md={3} lg={2} style={{textAlign: 'right'}}>
                    <Button onClick={(e) => handleSaveMyinfo()} variant="contained">기본정보 저장</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <Grid container alignItems='center'>
                <Grid item xs={12}>
                  <Typography>- 배송지</Typography>
                </Grid>
              </Grid>
              {
                deliveryList.map((delivery, index) => (
                  <Grid container key={index} spacing={1} alignItems='center'>
                    <Grid item xs={12}>
                      <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                          <FormControl>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={delivery.primaryYn === 'Y'}
                                  onChange={handleCheckboxChange(index)}
                                  color="primary"
                                />
                              }
                              label=""
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <TextField
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            fullWidth
                            id={`delivery_${index}`}
                            name={`delivery_${index}`}
                            label={delivery.primaryYn === 'Y' ? '기본 배송지' : '배송지'}
                            value={delivery.address || ''}
                            onChange={(e) => {
                              const updatedList = [...deliveryList];
                              updatedList[index].address = e.target.value;
                              setDeliveryList(updatedList);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
              }
              <Grid container justifyContent='flex-end' alignItems='center' direction='row' style={{marginTop: '8px'}}>
                <Grid item xs={12} sm={4} md={3} lg={2} style={{textAlign: 'right'}}>
                  <Button onClick={(e) => handleAddDelivery()} variant="contained" style={{marginRight: '8px'}}>추가</Button>
                  <Button onClick={(e) => handleSaveDeliveryList()} variant="contained">저장</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Box>
    </Layout>
  )
}

export default Page;
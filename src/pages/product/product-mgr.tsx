import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import { Box, Button, TextField, FormControl, Checkbox, FormControlLabel, Typography } from '@mui/material';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import { Layout } from 'components/layout/Layout';
import { isLogin, asyncGET, asyncPUT } from 'utils/http';

type Product = {
  "id"?: number,
  "name"?: string,
  "imgThumbUrl"?: string,
}


const Page = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  
  // 상품 추가
  const handleAddProduct = () => {
    setProductList([ ...productList, {}]);
  };
  
  // 배송지 저장
  const callbackSaveProductList = (res?: Response) => {
    if (res === undefined || !res.ok) {
      const [title, message] = ['ERROR', `상품 목록 저장 중 오류가 발생했습니다.`];
      storeAlert.dispatch(actAlertShow(title, message));
      return;
    }
    const [title, message] = ['SUCCESS', `상품 목록이 저장 되었습니다.`];
    storeAlert.dispatch(actAlertShow(title, message));
    res.json()
      .then(json => {
        setProductList(json);
      });
  };
  const handleSaveProductList = () => {
    const req = productList.filter(product => product.name);
    console.log(JSON.stringify(req));
    asyncPUT('/api/market/product/save-product-list', callbackSaveProductList, req);
  };

  // 상품 목록 조회
  const callbackRetrieveProductList = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => {
        setProductList(json);
      });
  };
  useEffect(() => {
    if (isLogin()) {
      asyncGET('/api/market/product/list', callbackRetrieveProductList);
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
                  <Typography>- 상품 목록</Typography>
                </Grid>
              </Grid>
              {
                productList.map((product, index) => (
                  <Grid container key={index} spacing={1} alignItems='center'>
                    <Grid item xs={12}>
                      <Grid container spacing={1} alignItems='center'>
                        <Grid item>
                          <TextField
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            fullWidth
                            id={`delivery_${index}`}
                            name={`delivery_${index}`}
                            label={`상품_${index}`}
                            value={product.name}
                            onChange={(e) => {
                              const updatedList = [...productList];
                              updatedList[index].name = e.target.value;
                              setProductList(updatedList);
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
                  <Button onClick={(e) => handleAddProduct()} variant="contained" style={{marginRight: '8px'}}>추가</Button>
                  <Button onClick={(e) => handleSaveProductList()} variant="contained">저장</Button>
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
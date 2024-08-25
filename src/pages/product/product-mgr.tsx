import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import { Box, Button, TextField, FormControl, Checkbox, FormControlLabel, Typography, Input } from '@mui/material';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import { Layout } from 'components/layout/Layout';
import { isLogin, asyncGET, asyncPUT } from 'utils/http';
import { formatDate } from 'utils/date';
import { setLastAccess } from 'utils/storage';

type Product = {
  "id"?: number,
  "name"?: string,
  "imgThumbUrl"?: string
  "createDate"?: string
}


const Page = () => {
  const [productList, setProductList] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product>({});
  const [selectedProductImgThumb, setSelectedProductImgThumb] = useState<File>();

  // 상품 정보 저장
  const handleSaveProduct = async () => {
    const url = '/product/v1/save-product';
    const fetchData = async() => {
      const formData = new FormData();
      formData.append('req', new Blob([JSON.stringify(selectedProduct)], { type: 'application/json' }));
      selectedProductImgThumb && formData.append('imgThumb', selectedProductImgThumb);
      const res = await fetch(url, {
        method: 'PUT',
        body: formData
      });
      setLastAccess();
      return res;
    };
    fetchData()
      .then(res => {
        if (res === undefined || !res.ok) {
          const [title, message] = ['ERROR', `상품 정보 저장 중 오류가 발생했습니다.`];
          storeAlert.dispatch(actAlertShow(title, message));
          return;
        }
        const [title, message] = ['SUCCESS', `상품 정보가 저장 되었습니다.`];
        storeAlert.dispatch(actAlertShow(title, message));
        res.json()
          .then(json => {
            setSelectedProduct(json);
            // console.log('1>>'+JSON.stringify(json));
            // console.log('2>>'+JSON.stringify({...json, createDate: new Date(json.createDate)}));
            setProductList(productList.map(item => {
              if (item.id === json.id) {
                return json;
              } else {
                return item;
              }
            }));
          });
      });
  };

  // 상품 삭제
  const handleDeleteProduct = async () => {
    const url = '/product/v1/delete-product';
    const fetchData = async() => {
      const api = url;
      const body = JSON.stringify(selectedProduct);
      const res = await fetch(api, {
        method: 'delete',
        headers: {
          "Content-Type":"application/json; charset=utf-8"
        },
        body: body
      });
      setLastAccess();
      return res;
    };
    fetchData()
      .then(res => {
        if (res === undefined || !res.ok) {
          const [title, message] = ['ERROR', `상품 정보 삭제 중 오류가 발생했습니다.`];
          storeAlert.dispatch(actAlertShow(title, message));
          return;
        }
        const [title, message] = ['SUCCESS', `상품 정보가 삭제 되었습니다.`];
        storeAlert.dispatch(actAlertShow(title, message));
        res.json()
          .then(json => {
            setSelectedProduct(json);
            // console.log('1>>'+JSON.stringify(json));
            // console.log('2>>'+JSON.stringify({...json, createDate: new Date(json.createDate)}));
            setProductList(productList.map(item => {
              if (item.id === json.id) {
                return json;
              } else {
                return item;
              }
            }));
          });
      });
  }

  // 상품 목록 조회
  const callbackRetrieveProductList = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => {
        const list: Product[] = json.map((item: any) => ({
          ...item,
          createDate: new Date(item.createDate)
        }));
        setProductList(list);
      });
  };
  useEffect(() => {
    asyncGET('/product/v1/list', callbackRetrieveProductList);
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
                productList.map((product: Product, index: number) => (
                  <Grid container key={index} spacing={1} alignItems='center'
                    style={{
                      marginTop: '8px'
                    }}>
                    <Grid item xs={12}>
                      <div 
                        style={{cursor: 'pointer', display: 'flex', width: '100%',
                        border: selectedProduct === product ? '1px solid gray' : 'none'}}
                        onClick={() => {
                          setSelectedProduct(product);
                        }}>
                        <img
                          src={product.imgThumbUrl || ''}
                          style={{float: 'left', width: '140px'}} />
                        <div style={{ marginLeft: '8px' }}>
                          <Typography>{product.name || ''}</Typography>
                          <Typography>등록일: { formatDate(product.createDate!) }</Typography>
                        </div>
                      </div>
                    </Grid>
                    {
                      product.id === selectedProduct.id && 
                      <Grid container alignItems='center' style={{marginTop: '8px'}}>
                        <Grid item xs={12} sm={4} md={3} lg={2}>
                          <TextField
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            fullWidth
                            id={`selectedProduct`}
                            name={`selectedProduct`}
                            label={`상품명`}
                            value={selectedProduct.name || ''}
                            onChange={(e) => {
                              setSelectedProduct({...selectedProduct, name:  e.target.value});
                            }} />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3} lg={2}>
                          <Input
                            type="file"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setSelectedProductImgThumb(e.target.files[0]);
                              } else {
                                setSelectedProductImgThumb(undefined);
                              }
                            }}
                            inputProps={{ accept: '.png, .jpg, .jpeg, .jfif' }} />
                        </Grid>
                        <Grid item xs={12} sm={4} md={3} lg={2} style={{textAlign: 'right'}}>
                          <Button onClick={(e) => handleDeleteProduct()} variant="contained">삭제</Button>
                          <Button onClick={(e) => handleSaveProduct()} variant="contained">저장</Button>
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                ))
              }
              {
                productList.length === 0 && 
                <Grid container alignItems='center' style={{marginTop: '8px'}}>
                  <Grid item xs={12}>
                    <Typography>등록된 상품이 없습니다.</Typography>
                  </Grid>
                </Grid>
              }
            </Grid>
          </Grid>
        </div>
      </Box>
    </Layout>
  )
}

export default Page;
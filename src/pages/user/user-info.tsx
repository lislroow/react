import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import { Box, Button, TextField, Typography } from '@mui/material';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import storeUser, { actUpdate } from 'redux-store/store-user';
import { Layout } from 'components/layout/Layout';
import { isLogin, asyncGET, asyncPUT } from 'utils/http';

import UserService from 'services/UserService';

type UserInfo = {
  "email"?: string,
  "nickname"?: string,
}

const Page = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  // 기본정보 저장
  const callbackModify = (res?: Response) => {
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

  const handleModify = () => {
    // asyncPUT('/story-api/v1/user/member/info', callbackModify, {});
  };
  
  // 기본정보 조회
  useEffect(() => {
    if (isLogin()) {
      //asyncGET('/auth-api/v1/user/member/info', callbackFind);
      UserService.getMemberInfo().then((response) => {
        setUserInfo(response.data);
      })
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
                    id="email"
                    name="email"
                    label="email"
                    value={userInfo.email || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    variant="standard"
                    fullWidth
                    id="nickname"
                    name="nickname"
                    label="nickname"
                    value={userInfo.nickname || ''}
                    onChange={(event) => setUserInfo({ ...userInfo, nickname: event.target.value })}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
                  <Grid item xs={12} sm={4} md={3} lg={2} style={{textAlign: 'right'}}>
                    <Button onClick={(e) => handleModify()} variant="contained">기본정보 저장</Button>
                  </Grid>
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
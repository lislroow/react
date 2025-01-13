import { useState, useEffect } from "react";

import { Grid, Box, Button, TextField, Typography } from '@mui/material';

import {
  UserInfo,
} from '../../types/UserTypes';

import UserService from '../../services/UserService';

const Page = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});

  useEffect(() => {
    if (UserService.isLogin()) {
      UserService.getUserInfo()?.then((response) => setUserInfo(response.data));
    }
  }, []);
  
  return (
    <section>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={1} alignItems='center'>
          <Grid item xs={12}>
            <Grid container alignItems='center'>
              <Grid item xs={12}>
                <Typography>- 기본정보</Typography>
              </Grid>
            </Grid>
            <Grid container alignItems='center'>
              <Grid item xs={12} sm={4}>
                <TextField margin="normal" InputProps={{ readOnly: true, }} InputLabelProps={{ shrink: true }}
                  variant="standard" fullWidth id="email" name="email" label="email" value={userInfo.email || ''} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField margin="normal" InputLabelProps={{ shrink: true }} 
                  variant="standard" fullWidth id="nickname" name="nickname" label="nickname" value={userInfo.nickname || ''}
                  onChange={(event) => setUserInfo({ ...userInfo, nickname: event.target.value })}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} justifyContent='flex-end' alignItems='center'>
                <Grid item xs={12} sm={4} md={3} lg={2} style={{textAlign: 'right'}}>
                  <Button onClick={(e) => console.log('[TODO] save userInfo')} variant="contained">save</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </section>
  )
}

export default Page;

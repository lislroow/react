import React, { useState } from 'react';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';

import { Layout } from 'components/layout/Layout';
import AlertDialog from 'components/dialog/AlertDialog';
import { Container, Typography, Box, Button, TextField } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('mgkim.net@gmail.com');
  const [password, setPassword] = useState('1');

  const handleGoogleLogin = () => {
    window.location.replace('/auth-api/oauth2/authorization/google');
  };

  const handleKakaoLogin = () => {
    window.location.replace('/auth-api/oauth2/authorization/kakao');
  };

  const handleNaverLogin = () => {
    window.location.replace('/auth-api/oauth2/authorization/naver');
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const fetchData = async() => {
      const res: Response = await fetch('/auth-api/v1/login/process', 
        {
          method: 'post',
          body: formData
        }
      );
      return res;
    }
    fetchData().then(res => {
      if (res.ok) {
        window.location.replace('/');
      } else {
        res.json().then(data => {
          if (res.status === 403) {
            const [title, message] = ['ERROR', data.result];
            storeAlert.dispatch(actAlertShow(title, message));
          } else {
            const [title, message] = ['ERROR', '로그인 처리 중 오류가 발생했습니다.'];
            storeAlert.dispatch(actAlertShow(title, message));
          }
        });
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <AlertDialog />
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          로그인
        </Typography>
        <form>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            name="username"
            autoComplete="username"
            label="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            value={password}
            autoComplete="current-password"
            label="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={(e) => handleFormSubmit()} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            로그인
          </Button>
        </form>
        <Typography variant="subtitle1" align="center" gutterBottom>
          또는 다른 방법으로 로그인
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button onClick={(e) => handleGoogleLogin()} variant="contained">Google</Button>
          <Button onClick={(e) => handleKakaoLogin()} variant="contained">Kakao</Button>
          <Button onClick={(e) => handleNaverLogin()} variant="contained">Naver</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;

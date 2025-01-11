import { useState } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';

import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import AlertDialog from 'components/dialog/AlertDialog';
import UserService from 'services/UserService';
import { refreshToken } from 'utils/http';

const Login = () => {
  if (UserService.isLogin()) {
    window.location.replace('/');
  }
  const [username, setUsername] = useState('mgkim.net@gmail.com');
  // const [username, setUsername] = useState('myeonggu.kim@kakao.com');
  const [password, setPassword] = useState('1');

  const handleLogin = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    UserService.login(formData)
      .then((response) => {
        const cookies = document.cookie
          .split('; ')
          .reduce<Record<string, string>>((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
          }, {});
          
        const rtkUuid = cookies['X-RTKID'];
        if (rtkUuid) {
          localStorage.setItem('X-RTKID', rtkUuid);
          refreshToken()
            .then(() => window.location.replace('/'));
        } else {
          console.log('X-RTKID is null');
        }
      })
      .catch(error => {
        console.error('로그인 오류 발생:', error);
        const [title, message] = [error.title, error.detail];
        storeAlert.dispatch(actAlertShow(title, message));
        return Promise.reject(error);
      });
  }

  return (
    <Container maxWidth="sm">
      <AlertDialog />
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          로그인
        </Typography>
        <form>
          <TextField margin="normal" required fullWidth id="username" name="username" autoComplete="username"
            label="email" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          <TextField margin="normal" required fullWidth id="password" name="password" autoComplete="current-password" 
            label="password" value={password} onChange={(e) => setPassword(e.target.value)}
            type="password" />
          <Button onClick={(e) => handleLogin()} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            id /pw login
          </Button>
        </form>
        <Typography variant="subtitle1" align="center" gutterBottom>
          social login
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button onClick={(e) => UserService.loginBySocial('google')} variant="contained">Google</Button>
          <Button onClick={(e) => UserService.loginBySocial('kakao')} variant="contained">Kakao</Button>
          <Button onClick={(e) => UserService.loginBySocial('naver')} variant="contained">Naver</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;

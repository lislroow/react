import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Button, TextField } from '@mui/material';

import storeAlert, { actAlertShow } from '@/components/redux-store/store-alert';
import storeUser, { actUpdate } from '@/components/redux-store/store-user';

import { refreshToken } from '@/lib/http';
import UserService from '@/services/UserService';

const Page = () => {
  const router = useRouter();
  // const [username, setUsername] = useState('mgkim.net@gmail.com');
  // const [username, setUsername] = useState('myeonggu.kim@kakao.com');
  const [username, setUsername] = useState('mgkim0818@naver.com');
  const [password, setPassword] = useState('1');

  const handleSocialLogin = (social: string) => {
    // UserService.loginBySocial(social);
    switch (social) {
    case 'google':
    case 'kakao':
    case 'naver':
      break;
    default:
      console.log(`${social} login not allowed`);
      return;
    }
    router.push(`/auth-api/v1/member/login/oauth2/authorization/${social}`);
  }

  const handleIdLogin = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    UserService.login(formData)
      .then(() => {
        const cookies = document.cookie
          .split('; ')
          .reduce<Record<string, string>>((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
          }, {});
          
        if (cookies['X-RTKID']) {
          localStorage.setItem('X-RTKID', cookies['X-RTKID']);
          refreshToken().then(() => 
            UserService.getUserInfo().then((reponse) => {
              storeUser.dispatch(actUpdate(reponse.data));
              router.push('/');
            })
          );
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
  useEffect(() => {
    if (UserService.isLogin()) {
      router.push('/');
    }
  }, [])

  return (
    <Container maxWidth="sm">
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
          <Button onClick={(e) => handleIdLogin()} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            id /pw login
          </Button>
        </form>
        <Typography variant="subtitle1" align="center" gutterBottom>
          social login
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button onClick={(e) => handleSocialLogin('google')} variant="contained">Google</Button>
          <Button onClick={(e) => handleSocialLogin('kakao')} variant="contained">Kakao</Button>
          <Button onClick={(e) => handleSocialLogin('naver')} variant="contained">Naver</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Page;

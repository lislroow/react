import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Box, Button, TextField } from '@mui/material';

import storeAlert, { actAlertShow } from '@/components/redux-store/store-alert';
import storeUser, { actUpdate } from '@/components/redux-store/store-user';

import { refreshToken } from '@/components/http';
import UserService from '@/services/UserService';
import storage from '@/components/storage';
import cookie from '@/components/cookie';

const Page = () => {
  const router = useRouter();
  // const [username, setUsername] = useState('mgkim.net@gmail.com'); // member
  // const [username, setUsername] = useState('mgkim0818@naver.com'); // member
  const [username, setUsername] = useState('myeonggu.kim@kakao.com'); // manager
  const [password, setPassword] = useState('1');
  const [userType, setUserType] = useState('manager');

  const handleSocialLogin = (social: string) => {
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

  const handleIdPwdLogin = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    UserService.loginByIdPwd(userType, formData)
      .then(() => {
        const rtk = cookie.getCookie('X-RTK');
        if (rtk) {
          storage.setX_RTK(rtk);
          router.push('/');
        }
      })
      .catch(error => {
        const [title, message] = [error.response.data.title, error.response.data.detail];
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
    <div className='contents'>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>Login</Typography>
          <form>
            <TextField margin="normal" required fullWidth id="username" name="username" autoComplete="username"
              label="email" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            <TextField margin="normal" required fullWidth id="password" name="password" autoComplete="current-password" 
              label="password" value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" />
            <div className="el_input_radioWrap">
              <div className="el_input_radioInnerWrap">
                <input
                  type="radio"
                  id={'userType1'}
                  name="userType1"
                  className="el_input_radio"
                  checked={userType === 'manager'}
                  onChange={(e) => setUserType('manager')}
                />
                <label htmlFor="userType1" className="el_label3">
                  관리자
                </label>
              </div>
              <div className="el_input_radioInnerWrap">
                <input
                  type="radio"
                  id={'userType2'}
                  name="userType2"
                  className="el_input_radio"
                  checked={userType === 'member'}
                  onChange={(e) => setUserType('member')}
                />
                <label htmlFor="userType2" className="el_label3">
                  사용자
                </label>
              </div>
            </div>
            <Button onClick={(e) => handleIdPwdLogin()} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              id /pwd login
            </Button>
          </form>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button onClick={(e) => handleSocialLogin('google')} variant="contained">Google</Button>
            <Button onClick={(e) => handleSocialLogin('kakao')} variant="contained">Kakao</Button>
            <Button onClick={(e) => handleSocialLogin('naver')} variant="contained">Naver</Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Page;

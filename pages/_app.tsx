import { useEffect, useRef, useState } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Typography } from '@mui/material';
import '@/css/globals.css';
import styles from '@/css/global.module.css';
import StylAlert from '@/styles/AlertStyled';

import { refreshToken } from '@/components/http';
import storage from '@/components/storage';
import storeUser from '@/components/redux-store/store-user';
import storeAlert from '@/components/redux-store/store-alert';

import { MenuInfo } from '@/types/CommonType';
import { UserInfo } from '@/types/UserTypes';

import MenuService from '@/services/MenuService';
import UserService from '@/services/UserService';
import CodeService from '@/services/CodeService';
import cookie from '@/components/cookie';

const AppStructer = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const noLayoutUri = [
    '/login',
    '/user/manager-register/',
  ];

  const [ menuList, setMenuList ] = useState<MenuInfo[]>();
  const [ alertDisplay, setAlertDisplay] = useState(false);
  const [ alertTitle, setAlertTitle] = useState('');
  const [ alertMessage, setAlertMessage] = useState('');

  const [ asideStatus, setAsideStatus ] = useState(true);
  const [ user, setUser ] = useState<UserInfo>({});
  const [ loginStatus, setLoginStatus ] = useState(false);
  const [ expireTime, setExpireTime ] = useState<number>();

  storeUser.subscribe(() => {
    storage.setUser(storeUser.getState().user);
    setUser(storeUser.getState().user);
    setLoginStatus(true);
  });
  
  storeAlert.subscribe(() => {
    setAlertDisplay(storeAlert.getState().alert.display);
    setAlertTitle(storeAlert.getState().alert.title || '');
    setAlertMessage(storeAlert.getState().alert.message || '');
  });

  const init = () => {
    setMenuList(MenuService.initMenu());
    CodeService.initAllCodes();
    if (UserService.isLogin()) {
      const user = storage.getUser();
      if (user) {
        setUser(user);
        setLoginStatus(true);
      } else {
        UserService.getInfo().then((response) => {
          storage.setUser(response.data);
          setUser(response.data);
          setLoginStatus(true);
        });
      }
    }
  };
  
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const rtk = cookie.getCookie('X-RTKID');
      if (rtk && !UserService.isLogin()) {
        storage.setX_RTKID(rtk);
        refreshToken().then(() => init());
      }
    }
  }, [router.query]);


  useEffect(() => {
    const remainTime = UserService.getRemainTime();
    setExpireTime(remainTime);
    const timer = setInterval(() => {
      const remainTime = UserService.getRemainTime();
      if (remainTime < 0) {
        const token = storage.getX_RTKID();
        if (token) {
          clearInterval(timer);
          UserService.logout(router);
        }
      } else {
        setExpireTime(remainTime);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [expireTime]);
  
  return (
    <div>
      <StylAlert handleClose={() => setAlertDisplay(false)}
        attr={{
          open: alertDisplay,
          message: `[${alertTitle}] ${alertMessage}`}}>
      </StylAlert>
      <div>
        <main className='flex' style={{width: '100%', minHeight: '100vh', height: 'auto'}}>
          {!noLayoutUri.some(uri => router.pathname.startsWith(uri)) && 
            <aside className={asideStatus ? 'aside-show' : 'aside-hidden'}>
              <div className="flex items-center justify-center text-center py-4">
                <Link href='/'> 
                  <span className="mx-2 text-2xl font-semibold text-black">
                    develop
                  </span>
                </Link>
              </div>
              {menuList && (
                <Navigation items={menuList.map((item) => ({
                    title: item.title,
                    itemId: item.itemId,
                    subNav: [],
                  }))}
                  onSelect={({ itemId }) => { router.query = {}; router.push(itemId); } } activeItemId={''} />
              )}
            </aside>
          }
          <section className='content' style={{padding: '14px', flex: 1}}>
            <div>
              <div>
                {!noLayoutUri.some(uri => router.pathname.startsWith(uri)) && 
                  <IconButton size="medium" color="primary" aria-label="medium-button" onClick={(e) => setAsideStatus(!asideStatus)}>
                    <MenuIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                }
                {!loginStatus ? (
                  !noLayoutUri.some(uri => router.pathname.startsWith(uri)) && (
                    <div style={{float: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '25px'}}>
                      <button className={styles.button_sm1} type={'button'} onClick={(e) => router.push('/login')}>
                        로그인
                      </button>
                    </div>
                  )
                ) : (
                  !noLayoutUri.some(uri => router.pathname.startsWith(uri)) && (
                    <div style={{float: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '25px'}}>
                      <button className={styles.button_sm1} type={'button'} onClick={() => UserService.getInfo()}>
                        {Math.floor(expireTime / 60) + ':' + (expireTime % 60)} | 연장
                      </button>
                      <Typography>{user?.username}</Typography>
                      <button className={styles.button_sm2} type={'button'} onClick={() => UserService.logout(router)}>
                        로그아웃
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className='flex-row' style={{ padding: '10px' }}>
              <Component {...pageProps} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AppStructer;

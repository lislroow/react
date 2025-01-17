import { useEffect, useRef, useState } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '@/css/globals.css';
import styles from '@/css/global.module.css';

import storeUser from '@/components/redux-store/store-user';
import storeAlert from '@/components/redux-store/store-alert';

import { MenuInfo } from '@/types/CommonType';
import { UserInfo } from '@/types/UserTypes';

import MenuService from '@/services/MenuService';
import UserService from '@/services/UserService';
import StylAlert from '@/styles/AlertStyled';

const AppStructer = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const noLayoutUri = ['/login'];

  const [ menuList, setMenuList ] = useState<MenuInfo[]>();
  const [ pathname, setPathname ] = useState<string | null>(null);

  const [ alertDisplay, setAlertDisplay] = useState(false);
  const [ alertTitle, setAlertTitle] = useState('');
  const [ alertMessage, setAlertMessage] = useState('');

  const [ asideStatus, setAsideStatus ] = useState(true);
  const [ user, setUser ] = useState<UserInfo>({});
  const [ loginStatus, setLoginStatus ] = useState(false);
  const [ expireTime, setExpireTime ] = useState<number>();
  
  const [ usrId, setUsrId ] = useState('');

  storeUser.subscribe(() => {
    setUser(storeUser.getState().user);
    localStorage.setItem('user', JSON.stringify(storeUser.getState().user));
    setUsrId(storeUser.getState().user.id);
    setLoginStatus(true);
  });
  
  storeAlert.subscribe(() => {
    setAlertDisplay(storeAlert.getState().alert.display);
    setAlertTitle(storeAlert.getState().alert.title || '');
    setAlertMessage(storeAlert.getState().alert.message || '');
  });

  useEffect(() => {
    setMenuList(MenuService.getMenuList());
    setPathname(router.pathname);
    
    if (UserService.isLogin()) {
      if (localStorage.getItem('user')) {
        setUser(JSON.parse(localStorage.getItem('user')));
        setLoginStatus(true);
      } else {
        UserService.getUserInfo().then((response) => {
          localStorage.setItem('user', JSON.stringify(response.data));
          setUser(response.data);
          setLoginStatus(true);
        });
      }
    }
  }, []);


  useEffect(() => {
    const remainTime = UserService.getRemainTime();
    setExpireTime(remainTime);
    const timer = setInterval(() => {
      const remainTime = UserService.getRemainTime();
      if (remainTime < 0) {
        const token = localStorage.getItem('X-RTKID');
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
          openState: alertDisplay,
          message: `[${alertTitle}] ${alertMessage}`}}>
      </StylAlert>
      <div>
        <main className='flex' style={{width: '100%', minHeight: '100vh', height: 'auto'}}>
          {!noLayoutUri.includes(router.pathname) && 
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
                {!noLayoutUri.includes(router.pathname) && 
                  <IconButton size="medium" color="primary" aria-label="medium-button" onClick={(e) => setAsideStatus(!asideStatus)}>
                    <MenuIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                }
                {!loginStatus ? (
                  !noLayoutUri.includes(router.pathname) && (
                    <div style={{float: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '25px'}}>
                      <button className={styles.button_sm1} type={'button'} onClick={(e) => router.push('/login')}>
                        로그인
                      </button>
                    </div>
                  )
                ) : (
                  <div style={{float: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '25px'}}>
                    <button className={styles.button_sm1} type={'button'} onClick={() => UserService.getUserInfo()}>
                      {/* {expireTime > 0 ? expireTime : ''} | 연장 */}
                      {Math.floor(expireTime / 60) + ':' + (expireTime % 60)} | 연장
                    </button>
                    <Typography>{user?.nickname}</Typography>
                    <button className={styles.button_sm2} type={'button'} onClick={() => UserService.logout(router)}>
                      로그아웃
                    </button>
                  </div>
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

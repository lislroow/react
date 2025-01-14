import { useEffect, useRef, useState } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import '@/css/globals.css';

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

  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [ asideStatus, setAsideStatus ] = useState(true);

  const [ user, setUser ] = useState<UserInfo>({});
  const [ loginIconVisible, setLoginIconVisible ] = useState(true);
  const [ userMenuVisible, setUserMenuVisible ] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  
  const [ expireTime, setExpireTime ] = useState<number>();
  
  storeUser.subscribe(() => {
    setUser(storeUser.getState().user);
    localStorage.setItem('user', JSON.stringify(storeUser.getState().user));
    setLoginIconVisible(false);
  });
  
  storeAlert.subscribe(() => {
    setAlertDisplay(storeAlert.getState().alert.display);
    setAlertTitle(storeAlert.getState().alert.title || '');
    setAlertMessage(storeAlert.getState().alert.message || '');
  });

  useEffect(() => {
    setMenuList(MenuService.getMenuList());
    setPathname(router.pathname);
    const token = localStorage.getItem('X-RTKID');
    if (token) {
      UserService.getUserInfo().then((reponse) => {
        setUser(reponse.data);
        setLoginIconVisible(false);
      });
    }
    const userMenuOutClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node) && !(avatarButtonRef.current && avatarButtonRef.current.contains(event.target as Node))
      ) {
        setUserMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', userMenuOutClick);
    return () => {
      document.removeEventListener('mousedown', userMenuOutClick);
    };
  }, []);

  useEffect(() => {
    const remainTime = UserService.getRemainTime();
    if (remainTime < 0) {
      return;
    }
    setExpireTime(remainTime);
    const timer = setInterval(() => {
      const remainTime = UserService.getRemainTime();
      if (remainTime < 0) {
        clearInterval(timer);
        UserService.logout(router);
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
          <section className='content' style={{ flex: 1 }}>
            <div style={{padding: '14px'}}>
              <div style={{width: '100%', minHeight: '5vh', zIndex: '100'}}>
                {!noLayoutUri.includes(router.pathname) && 
                  <IconButton size="medium" color="primary" aria-label="medium-button" onClick={(e) => setAsideStatus(!asideStatus)}>
                    <MenuIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                }
                {loginIconVisible && !noLayoutUri.includes(router.pathname) && 
                  <IconButton size="medium" color="primary" aria-label="medium-button" style={{float: 'right'}} 
                    onClick={(e) => router.push('/login')}>
                    <Typography>Login</Typography>
                  </IconButton>
                }
                {!loginIconVisible && 
                  <div>
                    <IconButton ref={avatarButtonRef} size="medium" color="primary" style={{float: 'right'}} 
                      onClick={(e) => setUserMenuVisible(true)}>
                      <Typography sx={{ marginLeft: '5px' }}>{user?.nickname}</Typography>
                    </IconButton>
                    <Typography style={{float: 'right', padding: '1px', marginTop: '7px', marginRight: '40px'}}>{expireTime > 0 ? expireTime : ''}</Typography>
                  </div>
                }
                {userMenuVisible &&
                  <div ref={userMenuRef}>
                    <div style={{position: 'absolute', right: '10px', top: '8vh'}}>
                      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        <nav>
                          <List>
                            <ListItem disablePadding>
                              <ListItemButton onClick={(e: React.MouseEvent) => UserService.logout(router)}>
                                <LogoutIcon sx={{ width: 32, height: 32 }}/>
                                <Typography sx={{ marginLeft: '5px' }}>Logout</Typography>
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </nav>
                      </Box>
                    </div>
                  </div>
                }
              </div>
              { MenuService.getTitleByPathname(menuList, pathname) }
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

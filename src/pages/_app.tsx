import { Suspense, useEffect, useRef, useState } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import '@/styles/globals.css';

import storeAside, { actAsideShow } from '@/redux-store/store-aside';
import storeFooter from '@/redux-store/store-footer';
import storeUser from '@/redux-store/store-user';
import storeAlert from '@/redux-store/store-alert';

import { MenuInfo } from '@/types/CommonType';
import { UserInfo } from '@/types/UserTypes';

import MenuService from '@/services/MenuService';
import UserService from '@/services/UserService';

const AppStructer = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const noLayoutUri = ['/login'];

  const [ menuList, setMenuList ] = useState<MenuInfo[]>();
  const [ pathname, setPathname ] = useState<string | null>(null);

  const [alertDisplay, setAlertDisplay] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [ isSidebarOpen, setSidebarOpen ] = useState(false);
  const [ footerMessage, setFooterMessage ] = useState(''); 

  const [ user, setUser ] = useState<UserInfo>({});
  const [ loginIconVisible, setLoginIconVisible ] = useState(true);
  const [ userMenuVisible, setUserMenuVisible ] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  
  const [ expireTime, setExpireTime ] = useState<number>();

  storeAside.subscribe(() => {
    setSidebarOpen(storeAside.getState().aside.display);
  });

  storeFooter.subscribe(() => {
    setFooterMessage(storeFooter.getState().footer.message);
  });
  
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
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
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
  }, [user]);
  
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
      <Suspense fallback={
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}>
          <div>Loading...</div>
        </div>
      }>
        <Dialog open={alertDisplay || false} onClose={() => setAlertDisplay(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{alertMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAlertDisplay(false)} autoFocus>확인</Button>
          </DialogActions>
        </Dialog>
        <div>
          <main className='flex' style={{width: '100%', minHeight: '100vh', height: 'auto'}}>
            {!noLayoutUri.includes(router.pathname) && (
              <aside style={{display: 'flex', overflowY: 'auto', maxWidth: '254px'}}>
                <div
                  onClick={() => setSidebarOpen(false)}
                  className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                />
                <div className={`fixed left-0 top-0 bottom-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
                  isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"}`}
                  >
                  <div className="flex items-center justify-center text-center py-2">
                    <Link href='/'> 
                      <span className="mx-2 text-2xl font-semibold text-black">
                        develop
                      </span>
                    </Link>
                  </div>
                  {menuList &&
                    <Navigation 
                      items={menuList.map((item) => ({
                        title: item.title,
                        itemId: item.itemId,
                        subNav: [],
                      }))}
                      onSelect={({ itemId }) => { router.push(itemId); } } activeItemId={''}>
                    </Navigation>
                  }
                </div>
              </aside>
            )}
            <section className='content' style={{ flex: 1 }}>
              <div style={{padding: '14px'}}>
                <div style={{width: '100%', minHeight: '5vh', zIndex: '100'}}>
                  <IconButton size="medium" color="primary" aria-label="medium-button" 
                    onClick={(e) => {
                      storeAside.dispatch(actAsideShow())
                    }}>
                    <MenuIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                  {loginIconVisible &&
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
            <footer style={{display: 'none'}}>
              <div style={{
                backgroundColor: '#333',
                color: 'white',
                textAlign: 'left',
                padding: '5px 10px',
                position: 'fixed',
                bottom: '0',
                width: '100%',
                zIndex: '200',
                minHeight: '4vh'
                }}>
                {footerMessage}
              </div>
            </footer>
          </main>
        </div>
      </Suspense>
    </div>
  );
};

export default AppStructer;

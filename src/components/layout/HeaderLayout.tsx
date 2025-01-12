import React, { useState, useRef, useEffect } from 'react';

import { Typography, IconButton, Box, List, ListItem, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import styled from 'styled-components';

import storeAside, { actAsideShow } from 'redux-store/store-aside';
import storeUser from 'redux-store/store-user';
import AlertDialog from 'components/dialog/AlertDialog';
import ExpireTimer from 'components/fragment/ExpireTimer';

import {
  UserInfo,
} from 'types/UserTypes';

import UserService from 'services/UserService';
import { useRouter } from 'next/router';

const UserMenu = styled.div`
  position: absolute;
  top: 6vh;
  right: 10px;
  z-index: 1;
`;

const HeaderLayout = () => {
  const router = useRouter();
  const [ user, setUser ] = useState<UserInfo>({});
  const subscribeUser = () => {
    setUser(storeUser.getState().user);
    localStorage.setItem('user', JSON.stringify(storeUser.getState().user));
  };
  storeUser.subscribe(subscribeUser);

  const [ loginIconVisible, setLoginIconVisible ] = useState(false);
  const [ userMenuVisible, setUserMenuVisible ] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (UserService.isLogin()) {
      if (Object.keys(user).length > 0) {
        let storageStr = localStorage.getItem('user');
        if (!storageStr) {
          storageStr = JSON.stringify(user);
          localStorage.setItem('user', storageStr);
          setUser(JSON.parse(storageStr));
          return;
        }
      } else if (Object.keys(user).length === 0 && localStorage.getItem('user')) {
        let storageStr = localStorage.getItem('user');
        setUser(storageStr && JSON.parse(storageStr));
        return;
      } else {
        const userType = localStorage.getItem('X-ATKID')?.split(":")[0];
        switch (userType) {
        case "member":
          UserService.getMemberInfo()
            .then((response) => setUser(response.data));
          break;
        case "manager":
          UserService.getManagerInfo()
            .then((response) => setUser(response.data));
          break;
        default:
          break;
        }
        return;
      }
    } else {
      setLoginIconVisible(true);
    }
    
    const userMenuOutClick = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node) &&
        !(avatarButtonRef.current && avatarButtonRef.current.contains(event.target as Node))
      ) {
        setUserMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', userMenuOutClick);
    return () => {
      document.removeEventListener('mousedown', userMenuOutClick);
    };
  }, [user]);
  
  return (
    <React.Fragment>
      <AlertDialog />
      <IconButton size="medium" color="primary" aria-label="medium-button" 
        onClick={(e) => {
          storeAside.dispatch(actAsideShow())
        }}>
        <MenuIcon sx={{ fontSize: '20px' }} />
      </IconButton>
      {
        loginIconVisible &&
          <IconButton size="medium" color="primary" aria-label="medium-button" style={{float: 'right'}} 
            onClick={(e) => router.push('/login')}>
            <AccountCircleOutlinedIcon />
            <Typography>Login</Typography>
          </IconButton>
      }
      {
        !loginIconVisible && 
          <React.Fragment>
            <IconButton ref={avatarButtonRef} size="medium" color="primary" style={{float: 'right'}} 
              onClick={(e) => setUserMenuVisible(true)}>
              <Typography sx={{ marginLeft: '5px' }}>{user?.nickname}</Typography>
            </IconButton>
            <ExpireTimer />
          </React.Fragment>
      }
      {
        userMenuVisible && <div ref={userMenuRef}>
          <UserMenu>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <nav>
                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={(e: React.MouseEvent) => UserService.logout()}>
                      <LogoutIcon sx={{ width: 32, height: 32 }}/>
                      <Typography sx={{ marginLeft: '5px' }}>Logout</Typography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
            </Box>
          </UserMenu>
        </div>
      }
    </React.Fragment>
  );
};

export default HeaderLayout;

import React, { useState, useRef, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { Buffer } from 'buffer';
import { TypeUser } from 'types/TypeUser';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Avatar from '@mui/material/Avatar';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

import storeAside, { actAsideShow } from 'redux-store/store-aside';
import storeAlert, { actAlertShow } from 'redux-store/store-alert';
import { asyncPOST, logout, selectUser } from 'utils/http';

import LoginDialog from 'components/dialog/LoginDialog';
import AlertDialog from 'components/dialog/AlertDialog';
import ExpireTimer from 'components/fragment/ExpireTimer';

import styled from 'styled-components';
import { Typography } from '@mui/material';
const UserMenu = styled.div`
  position: absolute;
  top: 6vh;
  right: 10px;
  z-index: 1;
`;

const HeaderLayout = () => {
  const [ user, setUser ] = useState<TypeUser>({});
  const [ loginDialogOpen, setLoginDialogOpen ] = useState(false);
  const openLoginDialog = () => {
    // setLoginDialogOpen(true);
    window.location.replace('/login');
  };
  const closeLoginDialog = () => {
    setLoginDialogOpen(false);
  };
  const [ loginIconVisible, setLoginIconVisible ] = useState(false);
  const [ avatarVisible, setAvatarVisible ] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const [ userMenuVisible, setUserMenuVisible ] = useState(false);
  const openUserMenu = () => {
    setUserMenuVisible(true);
  }

  useEffect(() => {
    // * LOGINED 상태 체크
    //   T) user 체크
    //     T) localstorage 사용자 저장
    //     F) 사용자 조회
    //   F) 사용자 조회(/auth/user)
    const logined = new Cookies().get('LOGINED');
    if (logined) {
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
        selectUser(setUser);
        return;
      }
    } else {
      setLoginIconVisible(true);
    }

    if (!logined) {
      setLoginIconVisible(true);
      setAvatarVisible(false);
      setUserMenuVisible(false);
    } else {
      setLoginIconVisible(false);
      setAvatarVisible(true);
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

  const handleLogout = (e: React.MouseEvent) => {
    logout();
  }
  
  return (
    <React.Fragment>
      <LoginDialog
        open={loginDialogOpen}
        onClose={closeLoginDialog}
      />
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
            onClick={(e) => {openLoginDialog()}}>
            <AccountCircleOutlinedIcon />
            <Typography>Login</Typography>
          </IconButton>
      }
      {
        avatarVisible && 
          <React.Fragment>
            {/* <div style={{float: 'right'}}>
              <Typography sx={{ marginLeft: '5px' }} onClick={(e) => {openUserMenu()}}>
                {user && user.nickname === null ? user.email : user && user.nickname}
              </Typography>
            </div> */}
            <IconButton ref={avatarButtonRef} size="medium" color="primary" style={{float: 'right'}} 
              onClick={(e) => {openUserMenu()}}>
              <Typography sx={{ marginLeft: '5px' }}>{user && user.name === null ? user.email : user && user.name}</Typography>
              <Avatar sx={{ width: 32, height: 32 }}></Avatar>
            </IconButton>
            <ExpireTimer />
          </React.Fragment>
      }
      {
        userMenuVisible && <div ref={userMenuRef}>
          <UserMenu>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <nav>
                <List dense={true}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                      <Typography sx={{ marginLeft: '5px' }}>사용자 정보</Typography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
              <Divider />
              <nav>
                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={(e: React.MouseEvent) => { handleLogout(e) } }>
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
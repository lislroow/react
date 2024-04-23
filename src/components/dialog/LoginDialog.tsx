import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import GoogleIcon from '@mui/icons-material/Google';

export interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog(props: LoginDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    switch (value) {
      case 'google':
        window.location.replace('/oauth2/authorization/google');
        break;
      case 'kakao':
        window.location.replace('/oauth2/authorization/kakao');
        break;
      case 'naver':
        window.location.replace('/oauth2/authorization/naver');
        break;
      default:
        break;
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Social Login</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleListItemClick('google')}>
            <ListItemAvatar>
              <GoogleIcon />
            </ListItemAvatar>
            <ListItemText primary='google' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleListItemClick('kakao')}>
            <ListItemAvatar>
              <GoogleIcon />
            </ListItemAvatar>
            <ListItemText primary='kakao' />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleListItemClick('naver')}>
            <ListItemAvatar>
              <GoogleIcon />
            </ListItemAvatar>
            <ListItemText primary='naver' />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

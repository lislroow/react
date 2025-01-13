import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import storeAlert from '@/redux-store/store-alert';

export default function AlertDialog() {
  const [display, setDisplay] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const handleClose = () => {
    setDisplay(false);
  };

  const subscribe = () => {
    setDisplay(storeAlert.getState().alert.display);
    setTitle(storeAlert.getState().alert.title || '');
    setMessage(storeAlert.getState().alert.message || '');
  }
  storeAlert.subscribe(subscribe);

  return (
    <React.Fragment>
      <Dialog
        open={display || false}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
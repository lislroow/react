import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

import { StylText } from "@/styles/GeneralStyled";
import StylModal from "@/styles/ModalStyled";

import {
  RegistrationReq,
} from '@/types/UserMngTypes';
import UserMngService from '@/services/UserMngService';

const Page = () => {
  const router = useRouter();

  const [ registrationReq, setRegistrationReq ] = useState<RegistrationReq>();
  const [ resultModalOpen, setResultModalOpen ] = useState(false);
  const [ changePasswordModalMessage, setChangePasswordModalMessage ] = useState('');
  
  const validate = ():boolean => {
    if (registrationReq.newLoginPwd !== registrationReq.confirmLoginPwd) {
      setChangePasswordModalMessage('패스워드가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    try {
      const isValid = validate();
      if (!isValid) {
        return;
      }
    } catch (e) {

    }
    
    UserMngService.postRegistration(registrationReq)
      .then((response) => {
        setResultModalOpen(true);
      });
  };
  
  useEffect(() => {
    setRegistrationReq({
      registerCode: Array.isArray(router.query.code) ? router.query.code[0] : router.query.code || '',
    });
    
  }, [router.isReady]);
  
  
  return (
    <div className="contents">
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>Regiter Member</Typography>
          <TextField label="new password" 
            margin="normal"
            required fullWidth autoFocus
            value={registrationReq?.newLoginPwd ?? ''}
            onChange={(e) => setRegistrationReq({...registrationReq, 'newLoginPwd': e.target.value})} />
          <TextField label="confirm password" 
            margin="normal"
            required fullWidth
            value={registrationReq?.confirmLoginPwd ?? ''}
            onChange={(e) => setRegistrationReq({...registrationReq, 'confirmLoginPwd': e.target.value})} />
          <Button onClick={(e) => handleSubmit()} fullWidth variant="contained">
            register
          </Button>
        </Box>
      </Container>
      <StylModal open={resultModalOpen}
        modelType='inform'
        handleOkClick={() => {
          setResultModalOpen(false);
          router.push({
            pathname: '/login',
          });
        }}
        handleCloseClick={() => {
          setResultModalOpen(false);
          router.push({
            pathname: '/login',
          });
        }}>
        <StylText>successful registeration</StylText>
      </StylModal>
    </div>
  );
}

export default Page;

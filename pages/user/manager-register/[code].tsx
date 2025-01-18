import { useState, useEffect } from "react";

import {
  Registration,
} from '@/types/UserMngTypes';

import UserMngService from '@/services/UserMngService';
import { useRouter } from "next/router";
import StylFormField, { StylFieldWrap } from "@/styles/FormFieldStyled";
import { StylText } from "@/styles/GeneralStyled";
import StylButtonGroup from "@/styles/ButtonGroupStyled";
import queryString from "query-string";
import StylModal from "@/styles/ModalStyled";
import StylFormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import CommonCodeService from "@/services/CommonCodeService";
import UserService from "@/services/UserService";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import storeAlert, { actAlertShow } from "@/components/redux-store/store-alert";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ registration, setRegistration ] = useState<Registration>();
  const [ invalid, setInvalid ] = useState(false);
  const [ resultModalState, setResultModalState ] = useState(false);
  const [ changePasswordModalMessage, setChangePasswordModalMessage ] = useState('');
  
  const handleParams = (name: string, _value: any) => {
    setRegistration({ ...registration, [name]: _value });
  };
  
  const validate = ():boolean => {
    if (registration.newLoginPwd !== registration.confirmLoginPwd) {
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
    
    UserMngService.postRegistration(registration)
      .then((response) => {
        setResultModalState(true);
      });
  };
  
  useEffect(() => {
    setRegistration({
      registerCode: Array.isArray(query.code) ? query.code[0] : query.code || '',
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
            value={registration?.newLoginPwd ?? ''}
            onChange={(e) => setRegistration({...registration, 'newLoginPwd': e.target.value})} />
          <TextField label="confirm password" 
            margin="normal"
            required fullWidth
            value={registration?.confirmLoginPwd ?? ''}
            onChange={(e) => setRegistration({...registration, 'confirmLoginPwd': e.target.value})} />
          <Button onClick={(e) => handleSubmit()} fullWidth variant="contained">
            register
          </Button>
        </Box>
      </Container>
      <StylModal openState={resultModalState}
        modelType='inform'
        handleOkClick={() => {
          setResultModalState(false);
          router.push({
            pathname: '/login',
          });
        }}
        handleCloseClick={() => {
          setResultModalState(false);
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

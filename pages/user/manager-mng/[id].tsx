import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import storeAlert, { actAlertShow } from "@/components/redux-store/store-alert";
import StylModal from "@/styles/ModalStyled";
import { StylText } from "@/styles/GeneralStyled";
import StylFormField, { StylFieldWrap } from "@/styles/FormFieldStyled";
import StylFormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import StylButtonGroup from "@/styles/ButtonGroupStyled";

import {
  ManagerModifyReq,
  ManagerSearchRes,
  ChangePasswordReq,
} from '@/types/UserMngTypes';
import CodeService from "@/services/CodeService";
import UserMngService from '@/services/UserMngService';

const Page = () => {
  const router = useRouter();

  const [ ENABLE_YN, setENABLE_YN ] = useState<SelectItem[]>();
  const [ LOCKED_YN, setLOCKED_YN ] = useState<SelectItem[]>();
  
  const [ managerSearchRes, setManagerSearchRes ] = useState<ManagerSearchRes>();
  const [ managerModifyReq, setManagerModifyReq ] = useState<ManagerModifyReq>({
    id: null,
    roles: null,
    enableYn: null,
    lockedYn: null,
  });
  const [ changePasswordReq, setChangePasswordReq ] = useState<ChangePasswordReq>({
    id: null
  });
  const [ saveModalOpen, setSaveModalOpen ] = useState(false);
  const [ deleteModalOpen, setDeleteModalOpen ] = useState(false);
  const [ deleteModalConfirm, setDeleteModalConfirm ] = useState<string>();
  const [ changePasswordModalOpen, setChangePasswordModalOpen ] = useState(false);
  const [ changePasswordModalMessage, setChangePasswordModalMessage ] = useState('');
  
  const init = async () => {
    setENABLE_YN(CodeService.getFormSelectItem('ENABLE_YN'));
    setLOCKED_YN(CodeService.getFormSelectItem('LOCKED_YN'));
  };

  const handleParams = (name: string, _value: any) => {
    setManagerSearchRes({ ...managerSearchRes, [name]: _value });
  };
  
  const handleList = () => {
    router.push({
      pathname: '/user/manager-mng',
      query: queryString.stringify(router.query),
    });
  };
  
  const handleSave = () => {
    UserMngService.putManager(managerModifyReq)
      .then((response) => {
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    UserMngService.deleteManager(managerSearchRes.id)
      .then((response) => {
        handleList();
      });
  };
  
  const handleChangePassword = () => {
    if (changePasswordReq.newLoginPwd !== changePasswordReq.confirmLoginPwd) {
      setChangePasswordModalMessage('변경할 패스워드가 일치하지 않습니다.');
      return;
    }
    UserMngService.putManagerPassword(changePasswordReq)
      .then((response) => {
        setChangePasswordModalOpen(false);
      });
  };

  
  useEffect(() => {
    init();
    
    if (!router.isReady) return;
    const id = router.query.id;
    if (!id) {
      router.replace('/user/manager-mng');
      return;
    }
    UserMngService.getManager(id)
      .then((response) => {
        if ('title' in response.data && 'detail' in response.data) {
          storeAlert.dispatch(actAlertShow(response.data.title, response.data.detail));
          return;
        }
        setManagerSearchRes(response.data);
      });
  }, [router.isReady]);
  
  useEffect(() => {
    if (managerSearchRes) {
      // managerRes > modifyManagerReq
      setManagerModifyReq(Object.keys(managerSearchRes).reduce((acc, key) => {
        let value = managerSearchRes[key];
        if (key in managerModifyReq) {
          acc[key] = value;
        }
        return acc;
      }, {} as ManagerModifyReq));
      
      // managerRes > changePasswordReq
      setChangePasswordReq(Object.keys(managerSearchRes).reduce((acc, key) => {
        let value = managerSearchRes[key];
        if (key in changePasswordReq) {
          acc[key] = value;
        }
        return acc;
      }, {} as ChangePasswordReq));
    }
  }, [managerSearchRes]);
  
  
  return (
    <div className="contents">
      <StylButtonGroup
        btn1Label="목록"
        btn1OnClick={() => handleList()}
        btn2Label="저장"
        btn2OnClick={() => setSaveModalOpen(true)}
        btn3Label="삭제"
        btn3OnClick={() => setDeleteModalOpen(true)}
        btn4Label="패스워드 변경"
        btn4OnClick={() => {
          setChangePasswordModalMessage('');
          setChangePasswordModalOpen(true);
        }}
      >
      </StylButtonGroup>
      <StylFieldWrap>
        <StylFormField title="id">
          <StylText>{managerSearchRes?.id ?? ''}</StylText>
        </StylFormField>
        <StylFormField title="login id" required>
          <StylText>{managerSearchRes?.loginId}</StylText>
        </StylFormField>
        <StylFormField title="name">
          <StylText>{managerSearchRes?.mgrName ?? ''}</StylText>
        </StylFormField>
        <StylFormField title="roles">
          <input type="text"
            className={`el_input el_input_lg`}
            value={managerModifyReq?.roles ?? ''}
            onChange={(e) => handleParams('roles', e.target.value)} />
        </StylFormField>
        <StylFormField title="enable">
          <StylFormSelect type="type1" items={ENABLE_YN}
            value={managerModifyReq?.enableYn ?? ''}
            size="medium"
            onChange={(e) => handleParams('enableYn', e.target.value)} />
        </StylFormField>
        <StylFormField title="locked">
          <StylFormSelect type="type1" items={LOCKED_YN}
            value={managerModifyReq?.lockedYn ?? ''}
            size="medium"
            onChange={(e) => handleParams('lockedYn', e.target.value)} />
        </StylFormField>
        <StylFormField title="modify id">
          <StylText>{managerSearchRes?.modifyId}</StylText>
        </StylFormField>
        <StylFormField title="modify name">
          <StylText>{managerSearchRes?.modifyName}</StylText>
        </StylFormField>
        <StylFormField title="modify time">
          <StylText>{managerSearchRes?.modifyTime}</StylText>
        </StylFormField>
        <StylFormField title="create id">
          <StylText>{managerSearchRes?.createId}</StylText>
        </StylFormField>
        <StylFormField title="create name">
          <StylText>{managerSearchRes?.createName}</StylText>
        </StylFormField>
        <StylFormField title="create time">
          <StylText>{managerSearchRes?.createTime}</StylText>
        </StylFormField>
      </StylFieldWrap>
      <StylModal open={saveModalOpen}
        handleOkClick={() => {
          setSaveModalOpen(false);
          handleSave();
        }}
        handleCloseClick={() => setSaveModalOpen(false)}>
        <StylText>저장하시겠습니까?</StylText>
      </StylModal>
      <StylModal open={deleteModalOpen}
        handleOkClick={() => {
          if (deleteModalConfirm !== managerSearchRes.mgrName) {
            return false;
          }
          setDeleteModalOpen(false);
          handleDelete();
        }}
        handleCloseClick={() => setDeleteModalOpen(false)}>
        <main>
          <StylText>{'삭제 대상 \'' + managerSearchRes?.mgrName + '\' 를 입력해주세요.'}</StylText>
          <div style={{ display: 'flex' }}>
            <div>
              <input type="text"
                className={`el_input_lg`}
                style={{ height: '40px', textAlign: 'center' }}
                placeholder={managerSearchRes?.mgrName + ''}
                onChange={(e) => setDeleteModalConfirm(e.target.value)} />
            </div>
          </div>
        </main>
      </StylModal>
      <StylModal open={changePasswordModalOpen}
        title="패스워드 변경"
        confirmBtnNm="변경"
        cancelBtnNm="취소"
        handleOkClick={() => {
          handleChangePassword();
        }}
        maxWidth="600px"
        handleCloseClick={() => setChangePasswordModalOpen(false)}>
        <main>
          <StylText>{changePasswordModalMessage}</StylText>
          <StylFormField title="current password">
            <input type="text"
              className={`el_input el_input_lg`}
              value={changePasswordReq?.currentLoginPwd ?? ''}
              onChange={(e) => setChangePasswordReq({...changePasswordReq, 'currentLoginPwd': e.target.value})} />
          </StylFormField>
          <StylFormField title="new password">
            <input type="text"
              className={`el_input el_input_lg`}
              value={changePasswordReq?.newLoginPwd ?? ''}
              onChange={(e) => setChangePasswordReq({...changePasswordReq, 'newLoginPwd': e.target.value})} />
          </StylFormField>
          <StylFormField title="confirm password">
            <input type="text"
              className={`el_input el_input_lg`}
              value={changePasswordReq?.confirmLoginPwd ?? ''}
              onChange={(e) => setChangePasswordReq({...changePasswordReq, 'confirmLoginPwd': e.target.value})} />
          </StylFormField>
        </main>
      </StylModal>
    </div>
  );
}

export default Page;

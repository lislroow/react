import { useState, useEffect } from "react";

import {
  ModifyManagerReq,
  ManagerRes,
  ChangePasswordReq,
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

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ DISABLED_YN, setDISABLED_YN ] = useState<SelectItem[]>();
  const [ LOCKED_YN, setLOCKED_YN ] = useState<SelectItem[]>();
  const [ managerRes, setManagerRes ] = useState<ManagerRes>();
  const [ modifyManagerReq, setModifyManagerReq ] = useState<ModifyManagerReq>({
    id: '',
    roles: '',
    disabledYn: '',
    lockedYn: '',
  });
  const [ changePasswordReq, setChangePasswordReq ] = useState<ChangePasswordReq>({
    id: Array.isArray(query.id) ? query.id[0] : query.id || '',
  });
  const [ invalid, setInvalid ] = useState(false);
  const [ saveModalState, setSaveModalState ] = useState(false);
  const [ deleteModalState, setDeleteModalState ] = useState(false);
  const [ confirmDeleteId, setConfirmDeleteId ] = useState<string>();
  const [ changePasswordModal, setChangePasswordModal ] = useState(false);
  const [ changePasswordModalMessage, setChangePasswordModalMessage ] = useState('');
  
  const init = async () => {
    setDISABLED_YN(await CommonCodeService.getFormSelectItem('DISABLED_YN'));
    setLOCKED_YN(await CommonCodeService.getFormSelectItem('LOCKED_YN'));
  };

  const handleParams = (name: string, _value: any) => {
    setManagerRes({ ...managerRes, [name]: _value });
  };
  
  const handleList = () => {
    router.push({
      pathname: '/user/manager-mng',
      query: queryString.stringify(router.query),
    });
  };
  
  const handleSave = () => {
    UserMngService.putManager(modifyManagerReq)
      .then((response) => {
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    UserMngService.deleteManager(managerRes.id)
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
        setChangePasswordModal(false);
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
      .then((response) => setManagerRes(response.data));
  }, [router.isReady]);
  
  useEffect(() => {
    if (managerRes) {
      const map = Object.keys(managerRes).reduce((acc, key) => {
        let value = managerRes[key];
        if (key in modifyManagerReq) {
          acc[key] = value;
        }
        return acc;
      }, {} as ModifyManagerReq);
      setModifyManagerReq(map);
    }
  }, [managerRes]);
  
  return (
    <div className="contents">
      <StylButtonGroup
        btn1Label="목록"
        btn1OnClick={() => handleList()}
        btn2Label="저장"
        btn2OnClick={() => setSaveModalState(true)}
        btn3Label="삭제"
        btn3OnClick={() => setDeleteModalState(true)}
        btn4Label="패스워드 변경"
        btn4OnClick={() => {
          setChangePasswordModalMessage('');
          setChangePasswordModal(true);
        }}
      >
      </StylButtonGroup>
      <StylFieldWrap>
        <StylFormField title="id">
          <StylText>{managerRes?.id}</StylText>
        </StylFormField>
        <StylFormField title="login id" required>
          <StylText>{managerRes?.loginId}</StylText>
        </StylFormField>
        <StylFormField title="name">
          <StylText>{managerRes?.mgrName}</StylText>
        </StylFormField>
        <StylFormField title="roles">
          <input type="text"
            className={`el_input el_input_lg`}
            value={modifyManagerReq?.roles ?? ''}
            onChange={(e) => handleParams('roles', e.target.value)} />
        </StylFormField>
        <StylFormField title="disabled">
          <StylFormSelect type="type1" items={DISABLED_YN}
            value={modifyManagerReq?.disabledYn}
            size="medium"
            onChange={(e) => handleParams('disabledYn', e.target.value)} />
        </StylFormField>
        <StylFormField title="locked">
          <StylFormSelect type="type1" items={LOCKED_YN}
            value={modifyManagerReq?.lockedYn}
            size="medium"
            onChange={(e) => handleParams('lockedYn', e.target.value)} />
        </StylFormField>
        <StylFormField title="modify id">
          <StylText>{managerRes?.modifyId}</StylText>
        </StylFormField>
        <StylFormField title="modify name">
          <StylText>{managerRes?.modifyName}</StylText>
        </StylFormField>
        <StylFormField title="modify time">
          <StylText>{managerRes?.modifyTime}</StylText>
        </StylFormField>
        <StylFormField title="create id">
          <StylText>{managerRes?.createId}</StylText>
        </StylFormField>
        <StylFormField title="create name">
          <StylText>{managerRes?.createName}</StylText>
        </StylFormField>
        <StylFormField title="create time">
          <StylText>{managerRes?.createTime}</StylText>
        </StylFormField>
      </StylFieldWrap>
      <StylModal openState={saveModalState}
        handleOkClick={() => {
          setSaveModalState(false);
          handleSave();
        }}
        handleCloseClick={() => setSaveModalState(false)}>
        <StylText>저장하시겠습니까?</StylText>
      </StylModal>
      <StylModal openState={deleteModalState}
        handleOkClick={() => {
          if (confirmDeleteId !== managerRes.mgrName) {
            return false;
          }
          setDeleteModalState(false);
          handleDelete();
        }}
        handleCloseClick={() => setDeleteModalState(false)}>
        <main>
          <StylText>{'삭제 대상 \'' + managerRes?.mgrName + '\' 를 입력해주세요.'}</StylText>
          <div style={{ display: 'flex' }}>
            <div>
              <input type="text"
                className={`el_input_lg`}
                style={{ height: '40px', textAlign: 'center' }}
                placeholder={managerRes?.mgrName + ''}
                onChange={(e) => setConfirmDeleteId(e.target.value)} />
            </div>
          </div>
        </main>
      </StylModal>
      <StylModal openState={changePasswordModal}
        title="패스워드 변경"
        confirmBtnNm="변경"
        cancelBtnNm="취소"
        handleOkClick={() => {
          handleChangePassword();
        }}
        maxWidth="600px"
        handleCloseClick={() => setChangePasswordModal(false)}>
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

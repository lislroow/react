import { useState, useEffect } from "react";

import {
  ResManager,
  Manager,
  ChangePassword,
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
  const [ manager, setManager ] = useState<Manager>();
  const [ changePassword, setChangePassword ] = useState<ChangePassword>({
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
  }

  const handleParams = (name: string, _value: any) => {
    setManager({ ...manager, [name]: _value });
  };
  
  const handleList = () => {
    router.push({
      pathname: '/user/user-mng',
      query: queryString.stringify(router.query),
    });
  };
  
  const handleSave = () => {
    UserMngService.putManager(manager)
      .then((response) => {
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    UserMngService.deleteManager(manager.id)
      .then((response) => {
        handleList();
      });
  };
  
  const handleChangePassword = () => {
    if (changePassword.newLoginPwd !== changePassword.confirmLoginPwd) {
      setChangePasswordModalMessage('변경할 패스워드가 일치하지 않습니다.');
      return;
    }
    UserMngService.putManagerPassword(changePassword)
      .then((response) => {
        setChangePasswordModal(false);
      });
  };

  
  useEffect(() => {
    init();

    if (!router.isReady) return;
    const id = router.query.id;
    if (!id) {
      router.replace('/user/user-mng');
      return;
    }
    UserMngService.getManager(id)
      .then((response) => setManager(response.data));
  }, [router.isReady]);
  
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
          <StylText>{manager?.id}</StylText>
        </StylFormField>
        <StylFormField title="login id" required>
          <input type="text"
            className={`el_input el_input_lg`}
            value={manager?.loginId ?? ''}
            onChange={(e) => handleParams('loginId', e.target.value)} />
          {invalid && !manager?.loginId && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
        <StylFormField title="name">
          <input type="text"
            className={`el_input el_input_lg`}
            value={manager?.mgrName ?? ''}
            onChange={(e) => handleParams('mgrName', e.target.value)} />
        </StylFormField>
        <StylFormField title="disabled">
          <StylFormSelect type="type1" items={DISABLED_YN}
            value={manager?.disabledYn}
            size="medium"
            onChange={(e) => handleParams('disabledYn', e.target.value)} />
        </StylFormField>
        <StylFormField title="locked">
          <StylFormSelect type="type1" items={LOCKED_YN}
            value={manager?.lockedYn}
            size="medium"
            onChange={(e) => handleParams('lockedYn', e.target.value)} />
        </StylFormField>
        <StylFormField title="modify id">
          <StylText>{manager?.modifyId}</StylText>
        </StylFormField>
        <StylFormField title="modify name">
          <StylText>{manager?.modifyName}</StylText>
        </StylFormField>
        <StylFormField title="modify time">
          <StylText>{manager?.modifyTime}</StylText>
        </StylFormField>
        <StylFormField title="create id">
          <StylText>{manager?.createId}</StylText>
        </StylFormField>
        <StylFormField title="create name">
          <StylText>{manager?.createName}</StylText>
        </StylFormField>
        <StylFormField title="create time">
          <StylText>{manager?.createTime}</StylText>
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
          if (confirmDeleteId !== manager.mgrName) {
            return false;
          }
          setDeleteModalState(false);
          handleDelete();
        }}
        handleCloseClick={() => setDeleteModalState(false)}>
        <main>
          <StylText>{'삭제 대상 \'' + manager?.mgrName + '\' 를 입력해주세요.'}</StylText>
          <div style={{ display: 'flex' }}>
            <div>
              <input type="text"
                className={`el_input_lg`}
                style={{ height: '40px', textAlign: 'center' }}
                placeholder={manager?.mgrName + ''}
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
              value={changePassword?.currentLoginPwd ?? ''}
              onChange={(e) => setChangePassword({...changePassword, 'currentLoginPwd': e.target.value})} />
          </StylFormField>
          <StylFormField title="new password">
            <input type="text"
              className={`el_input el_input_lg`}
              value={changePassword?.newLoginPwd ?? ''}
              onChange={(e) => setChangePassword({...changePassword, 'newLoginPwd': e.target.value})} />
          </StylFormField>
          <StylFormField title="confirm password">
            <input type="text"
              className={`el_input el_input_lg`}
              value={changePassword?.confirmLoginPwd ?? ''}
              onChange={(e) => setChangePassword({...changePassword, 'confirmLoginPwd': e.target.value})} />
          </StylFormField>
        </main>
      </StylModal>
    </div>
  );
}

export default Page;

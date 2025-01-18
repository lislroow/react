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
  ScientistRes,
  ModifyScientistReq,
} from '@/types/MybatisSampleType';
import CommonCodeService from "@/services/CommonCodeService";
import SampleService from '@/services/MybatisSampleService';

const Page = () => {
  const router = useRouter();
  const { query } = router;
  
  const [ FOS, setFOS ] = useState<SelectItem[]>();

  const [ scientistRes, setScientistRes ] = useState<ScientistRes>();
  const [ modifyScientistReq, setModifyScientistReq ] = useState<ModifyScientistReq>({
    id: null,
    name: null,
    birthYear: null,
    deathYear: null,
    fosCd: null,
  });
  const [ invalid, setInvalid ] = useState(false);
  const [ saveModalState, setSaveModalState ] = useState(false);
  const [ deleteModalState, setDeleteModalState ] = useState(false);
  const [ confirmDeleteId, setConfirmDeleteId ] = useState<number>();
  
  const init = async () => {
    setFOS(await CommonCodeService.getFormSelectItem('FOS'));
  }

  const handleParams = (name: string, _value: any) => {
    setScientistRes({ ...scientistRes, [name]: _value });
  };
  
  const handleList = () => {
    router.push({
      pathname: '/mybatis-sample/scientist',
      query: queryString.stringify(router.query),
    });
  };
  
  const handleSave = () => {
    SampleService.putScientist(modifyScientistReq)
      .then((response) => {
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    SampleService.deleteScientist(scientistRes.id)
      .then((response) => {
        handleList();
      });
  };
  
  useEffect(() => {
    init();

    if (!router.isReady) return;
    const id = router.query.id;
    if (!id) {
      router.replace('/mybatis-sample/scientist');
      return;
    }
    SampleService.getScientist(id)
      .then((response) => {
        if ('title' in response.data && 'detail' in response.data) {
          storeAlert.dispatch(actAlertShow(response.data.title, response.data.detail));
          return;
        }
        setScientistRes(response.data);
      });
  }, [router.isReady]);

  useEffect(() => {
    if (scientistRes) {
      // scientistRes > modifyScientistReq
      setModifyScientistReq(Object.keys(scientistRes).reduce((acc, key) => {
        let value = scientistRes[key];
        if (key in modifyScientistReq) {
          acc[key] = value;
        }
        return acc;
      }, {} as ModifyScientistReq));
    }
  }, [scientistRes]);
  
  
  return (
    <div className="contents">
      <StylButtonGroup
        btn1Label="목록"
        btn1OnClick={() => handleList()}
        btn2Label="저장"
        btn2OnClick={() => setSaveModalState(true)}
        btn3Label="삭제"
        btn3OnClick={() => setDeleteModalState(true)}
      >
      </StylButtonGroup>
      <StylFieldWrap>
        <StylFormField title="id">
          <StylText>{scientistRes?.id}</StylText>
        </StylFormField>
        <StylFormField title="name" required>
          <input type="text"
            className={`el_input el_input_lg`}
            placeholder="input name"
            value={scientistRes?.name ?? ''}
            tabIndex={1003}
            onChange={(e) => handleParams('name', e.target.value)} />
          {invalid && !scientistRes?.name && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
        <StylFormField title="year of birth" required>
          <input type="text"
            className={`el_input el_input_lg`}
            value={modifyScientistReq?.birthYear ?? ''}
            tabIndex={1001}
            onChange={(e) => handleParams('birthYear', e.target.value)} />
          {invalid && !modifyScientistReq?.birthYear && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
        <StylFormField title="year of death">
          <input type="text"
            className={`el_input el_input_lg`}
            value={modifyScientistReq?.deathYear ?? ''}
            tabIndex={1002}
            onChange={(e) => handleParams('deathYear', e.target.value)} />
        </StylFormField>
        <StylFormField title="field of study">
          <StylFormSelect type="type1" items={FOS}
            value={modifyScientistReq?.fosCd}
            size="medium"
            onChange={(e) => handleParams('fosCd', e.target.value)} />
        </StylFormField>
        <StylFormField title="modify id">
          <StylText>{scientistRes?.modifyId}</StylText>
        </StylFormField>
        <StylFormField title="modify name">
          <StylText>{scientistRes?.modifyName}</StylText>
        </StylFormField>
        <StylFormField title="modify time">
          <StylText>{scientistRes?.modifyTime}</StylText>
        </StylFormField>
        <StylFormField title="create id">
          <StylText>{scientistRes?.createId}</StylText>
        </StylFormField>
        <StylFormField title="create name">
          <StylText>{scientistRes?.createName}</StylText>
        </StylFormField>
        <StylFormField title="create time">
          <StylText>{scientistRes?.createTime}</StylText>
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
          if (confirmDeleteId !== scientistRes.id) {
            return false;
          }
          setDeleteModalState(false);
          handleDelete();
        }}
        handleCloseClick={() => setDeleteModalState(false)}>
        <main>
          <StylText>{'삭제 대상 id \'' + scientistRes?.id + '\' 를 입력해주세요.'}</StylText>
          <div style={{ display: 'flex' }}>
            <div>
              <input type="text"
                className={`el_input_lg`}
                style={{ height: '40px', textAlign: 'center' }}
                placeholder={scientistRes?.id + ''}
                onChange={(e) => setConfirmDeleteId(Number(e.target.value))} />
            </div>
          </div>
        </main>
      </StylModal>
    </div>
  );
}

export default Page;

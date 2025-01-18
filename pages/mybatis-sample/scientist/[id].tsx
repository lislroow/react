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
  ScientistSearchRes,
  ScientistModifyReq,
} from '@/types/MybatisSampleType';
import CommonCodeService from "@/services/CommonCodeService";
import SampleService from '@/services/MybatisSampleService';

const Page = () => {
  const router = useRouter();
  const { query } = router;
  
  const [ FOS, setFOS ] = useState<SelectItem[]>();

  const [ scientistSearchRes, setScientistSearchRes ] = useState<ScientistSearchRes>();
  const [ scientistModifyReq, setScientistModifyReq ] = useState<ScientistModifyReq>({
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
    setScientistSearchRes({ ...scientistSearchRes, [name]: _value });
  };
  
  const handleList = () => {
    router.push({
      pathname: '/mybatis-sample/scientist',
      query: queryString.stringify(router.query),
    });
  };
  
  const handleSave = () => {
    SampleService.putScientist(scientistModifyReq)
      .then((response) => {
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    SampleService.deleteScientist(scientistSearchRes.id)
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
        setScientistSearchRes(response.data);
      });
  }, [router.isReady]);

  useEffect(() => {
    if (scientistSearchRes) {
      // scientistRes > modifyScientistReq
      setScientistModifyReq(Object.keys(scientistSearchRes).reduce((acc, key) => {
        let value = scientistSearchRes[key];
        if (key in scientistModifyReq) {
          acc[key] = value;
        }
        return acc;
      }, {} as ScientistModifyReq));
    }
  }, [scientistSearchRes]);
  
  
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
          <StylText>{scientistSearchRes?.id}</StylText>
        </StylFormField>
        <StylFormField title="name" required>
          <input type="text"
            className={`el_input el_input_lg`}
            placeholder="input name"
            value={scientistSearchRes?.name ?? ''}
            tabIndex={1003}
            onChange={(e) => handleParams('name', e.target.value)} />
          {invalid && !scientistSearchRes?.name && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
        <StylFormField title="year of birth" required>
          <input type="text"
            className={`el_input el_input_lg`}
            value={scientistModifyReq?.birthYear ?? ''}
            tabIndex={1001}
            onChange={(e) => handleParams('birthYear', e.target.value)} />
          {invalid && !scientistModifyReq?.birthYear && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
        <StylFormField title="year of death">
          <input type="text"
            className={`el_input el_input_lg`}
            value={scientistModifyReq?.deathYear ?? ''}
            tabIndex={1002}
            onChange={(e) => handleParams('deathYear', e.target.value)} />
        </StylFormField>
        <StylFormField title="field of study">
          <StylFormSelect type="type1" items={FOS}
            value={scientistModifyReq?.fosCd}
            size="medium"
            onChange={(e) => handleParams('fosCd', e.target.value)} />
        </StylFormField>
        <StylFormField title="modify id">
          <StylText>{scientistSearchRes?.modifyId}</StylText>
        </StylFormField>
        <StylFormField title="modify name">
          <StylText>{scientistSearchRes?.modifyName}</StylText>
        </StylFormField>
        <StylFormField title="modify time">
          <StylText>{scientistSearchRes?.modifyTime}</StylText>
        </StylFormField>
        <StylFormField title="create id">
          <StylText>{scientistSearchRes?.createId}</StylText>
        </StylFormField>
        <StylFormField title="create name">
          <StylText>{scientistSearchRes?.createName}</StylText>
        </StylFormField>
        <StylFormField title="create time">
          <StylText>{scientistSearchRes?.createTime}</StylText>
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
          if (confirmDeleteId !== scientistSearchRes.id) {
            return false;
          }
          setDeleteModalState(false);
          handleDelete();
        }}
        handleCloseClick={() => setDeleteModalState(false)}>
        <main>
          <StylText>{'삭제 대상 id \'' + scientistSearchRes?.id + '\' 를 입력해주세요.'}</StylText>
          <div style={{ display: 'flex' }}>
            <div>
              <input type="text"
                className={`el_input_lg`}
                style={{ height: '40px', textAlign: 'center' }}
                placeholder={scientistSearchRes?.id + ''}
                onChange={(e) => setConfirmDeleteId(Number(e.target.value))} />
            </div>
          </div>
        </main>
      </StylModal>
    </div>
  );
}

export default Page;

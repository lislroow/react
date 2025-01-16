import { useState, useEffect } from "react";

import {
  ResScientists,
  Scientist,
} from '@/types/SampleType';

import SampleService from '@/services/SampleService';
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
  const [ FOS, setFOS ] = useState<SelectItem[]>();
  const [ scientist, setScientist ] = useState<Scientist>();
  const [ invalid, setInvalid ] = useState(false);
  const [ saveModalState, setSaveModalState ] = useState(false);
  const [ deleteModalState, setDeleteModalState ] = useState(false);
  const [ confirmDeleteId, setConfirmDeleteId ] = useState<number>();
  
  const init = async () => {
    setFOS(await CommonCodeService.getFormSelectItem('FOS'));
  }

  const handleParams = (name: string, _value: any) => {
    setScientist({ ...scientist, [name]: _value });
  };
  
  const handleList = () => {
    router.push({
      pathname: '/mybatis-sample/scientist',
      query: queryString.stringify(router.query),
    });
  };
  
  const handleSave = () => {
    SampleService.putScientistsSearch(scientist)
      .then((response) => {
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    SampleService.deleteScientistsSearch(scientist.id)
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
      .then((response) => setScientist(response.data));
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
      >
      </StylButtonGroup>
      <StylFieldWrap>
        <StylFormField title="id">
          <StylText>{scientist?.id}</StylText>
        </StylFormField>
        <StylFormField title="year of birth" required>
          <input type="text"
            className={`el_input el_input_lg`}
            value={scientist?.birthYear ?? ''}
            tabIndex={1001}
            onChange={(e) => handleParams('birthYear', e.target.value)} />
          {invalid && !scientist?.birthYear && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
        <StylFormField title="year of death">
          <input type="text"
            className={`el_input el_input_lg`}
            value={scientist?.deathYear ?? ''}
            tabIndex={1002}
            onChange={(e) => handleParams('deathYear', e.target.value)} />
        </StylFormField>
        <StylFormField title="field of study">
          <StylFormSelect type="type1" items={FOS}
            value={scientist?.fosCd}
            size="medium"
            onChange={(e) => handleParams('fosCd', e.target.value)} />
        </StylFormField>
        <StylFormField title="name" required>
          <input type="text"
            className={`el_input el_input_lg`}
            placeholder="input name"
            value={scientist?.name ?? ''}
            tabIndex={1003}
            onChange={(e) => handleParams('name', e.target.value)} />
          {invalid && !scientist?.name && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
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
          if (confirmDeleteId !== scientist.id) {
            return false;
          }
          setDeleteModalState(false);
          handleDelete();
        }}
        handleCloseClick={() => setDeleteModalState(false)}>
        <main>
          <StylText>{'삭제 대상 id \'' + scientist?.id + '\' 를 입력해주세요.'}</StylText>
          <div style={{ display: 'flex' }}>
            <div>
              <input type="text"
                className={`el_input_lg`}
                style={{ height: '40px', textAlign: 'center' }}
                placeholder={scientist?.id + ''}
                onChange={(e) => setConfirmDeleteId(Number(e.target.value))} />
            </div>
          </div>
        </main>
      </StylModal>
    </div>
  );
}

export default Page;

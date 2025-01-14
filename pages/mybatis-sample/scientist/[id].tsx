import { useState, useEffect } from "react";

import {
  ResScientists,
  Scientists,
} from '@/types/SampleType';

import SampleService from '@/services/SampleService';
import { useRouter } from "next/router";
import StylFormField, { FieldWrap } from "@/styles/FormFieldStyled";
import { StylText } from "@/styles/GeneralStyled";
import StylButtonGroup from "@/styles/ButtonGroupStyled";
import queryString from "query-string";
import storeAlert, { actAlertShow } from "@/components/redux-store/store-alert";


const Page = () => {
  const router = useRouter();
  const [scientist, setScientist] = useState<Scientists>();
  const [invalid, setInvalid] = useState(false);

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
        storeAlert.dispatch(actAlertShow('', '저장 되었습니다.'));
        router.push({
          pathname: `${router.query.id}`,
          query: queryString.stringify(router.query),
        });
      });
  };
  
  const handleDelete = () => {
    SampleService.deleteScientistsSearch(scientist.id)
      .then((response) => {
        storeAlert.dispatch(actAlertShow('', '삭제 되었습니다.'));
        handleList();
      });
  };

  useEffect(() => {
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
        btn1Label="list"
        btn1OnClick={() => handleList()}
        btn2Label="save"
        btn2OnClick={() => handleSave()}
        btn3Label="delete"
        btn3OnClick={() => handleDelete()}
      >
      </StylButtonGroup>
      <FieldWrap>
        <StylFormField title="id">
          <StylText>{scientist?.id}</StylText>
        </StylFormField>
        <StylFormField title="year of birth" required>
          <div className={`el_input_wrap`}>
            <input type="text"
              className={`el_input el_input__md`}
              style={{ height: '40px' }}
              value={scientist?.birthYear ?? ''}
              tabIndex={1001}
              onChange={(e) => handleParams('birthYear', e.target.value)} />
          </div>
          {invalid && !scientist?.birthYear && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
        <StylFormField title="year of death">
          <div className={`el_input_wrap`}>
            <input type="text"
              className={`el_input el_input__md`}
              style={{ height: '40px' }}
              value={scientist?.deathYear ?? ''}
              tabIndex={1002}
              onChange={(e) => handleParams('deathYear', e.target.value)} />
          </div>
        </StylFormField>
        <StylFormField title="name" required>
          <div className={`el_input_wrap`}>
            <input type="text"
              className={`el_input el_input__md`}
              style={{ height: '40px' }}
              placeholder="input name"
              value={scientist?.name ?? ''}
              tabIndex={1003}
              onChange={(e) => handleParams('name', e.target.value)} />
          </div>
          {invalid && !scientist?.name && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>not allow empty string</span>)}
        </StylFormField>
      </FieldWrap>
    </div>
  );
}

export default Page;

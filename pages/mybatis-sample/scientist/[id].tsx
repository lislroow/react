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


const Page = () => {
  const router = useRouter();
  const [scientist, setScientist] = useState<Scientists>();
  const [invalid, setInvalid] = useState(false);

  const handleParams = (name: string, _value: any) => {
    setScientist({ ...scientist, [name]: _value });
  };
  
  const handleSave = () => {
    SampleService.postScientistsSearch(scientist)
      .then((response) => console.log('saved'));
  };
  
  const handleDelete = () => {
    SampleService.deleteScientistsSearch(scientist.id)
      .then((response) => console.log('deleted'));
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
        btn1OnClick={() => router.back()}
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
        <StylFormField title="name" required>
          <div className={`el_input_wrap`}>
            <input type="text"
              className={`el_input el_input__md`}
              style={{ height: '40px' }}
              placeholder="input name"
              value={scientist?.name ?? ''}
              tabIndex={1000}
              onChange={(e) => handleParams('name', e.target.value)} />
          </div>
          {invalid && !scientist?.name && (
            <span style={{ color: '#FF8080', fontSize: '15px' }}>name is empty</span>)}
        </StylFormField>
      </FieldWrap>
    </div>
  );
}

export default Page;

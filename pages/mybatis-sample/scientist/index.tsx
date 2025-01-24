import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from 'query-string';

import styles from '@/css/global.module.css';
import StylPagination from '@/styles/PaginationStyled';
import StylFormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';
import { StylLink } from "@/styles/GeneralStyled";

import {
  PageSizeOptions,
  PageInfoRes,
} from '@/types/CommonType';

import {
  ScientistSearchReq,
  ScientistSearchRes,
} from '@/types/MybatisSampleType';

import SampleService from '@/services/MybatisSampleService';
import CodeService from "@/services/CodeService";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ FOS, setFOS ] = useState<SelectItem[]>();
  const [ century, setCentury ] = useState<SelectItem[]>();
  const searchScientistReqDef: ScientistSearchReq = {
    name: '',
    fosCd: '',
    century: undefined,
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ScientistSearchReq>(searchScientistReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ scientistSearchResList, setScientistSearchResList ] = useState<ScientistSearchRes[]>([]);
  const init = async () => {
    setFOS(CodeService.getFormSelectItem('scientist:fos'));
    let codes: SelectItem[] = [{
      label: '전체',
      value: undefined,
    }];
    for (let i=20; i>14; i--) {
      codes.push({
        label: `${i}세기`,
        value: (i) + '',
      });
    }
    setCentury(codes);
  };

  const handleRouteAndSearch = (name: string = null, _value: any = null) => {
    let queryParam = Object.keys(searchParams).reduce((obj, key) => {
      if (searchParams[key] !== '' && searchParams[key] !== null) {
        obj[key] = searchParams[key];
      }
      return obj;
    }, {});
    
    if (name === 'page' || name === 'size') {
      queryParam = { ...queryParam, [name]: _value };
    } else if (name ===  null) {
      queryParam = { ...queryParam, page: 0, size: PageSizeOptions[0]};
    } else {
      return;
    }
    router.push({
      pathname: `/mybatis-sample/scientist`,
      query: queryString.stringify(queryParam),
    });
  };

  useEffect(() => {
    init();

    const parsedParams = Object.keys(searchParams).reduce((acc, key) => {
      if (key in query) {
        let value = query[key];
        if (key === 'page' || key === 'size') {
          acc[key] = Array.isArray(value) ? Number(value[0]) : Number(value) || 0;
        } else {
          acc[key] = Array.isArray(value) ? value[0] : value || '';
        }
      }
      return acc;
    }, {} as ScientistSearchReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = searchScientistReqDef;
    }
    setSearchParams(params);
    
    SampleService.getScientistsSearch(params)
      .then((response) => {
        setPageInfoRes(response.data.pageInfo);
        setScientistSearchResList(response.data.pageData);
      });
  }, [query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">name</div>
            <input type="text" className="el_input_select2" placeholder="name"
              value={searchParams?.name ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                name: e.target.value,
              })} />
            <div className="param-title">field of study</div>
            <StylFormSelect type="type1" items={FOS}
              value={searchParams?.fosCd ?? ''}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                fosCd: e.target.value,
              })} />
            <div className="param-title">century</div>
            <StylFormSelect type="type1" items={century}
              value={searchParams?.century ?? ''}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                century: e.target.value,
              })} />
          </StylSearchItem>
          <StylSearchBtnArea>
            <button className={styles.button_sm1} type={'button'} onClick={() => handleRouteAndSearch()}>조회</button>
          </StylSearchBtnArea>
        </StylSearchGroup>
      </StylSearchArea>
      <StyTable>
        <colgroup>
          <col width={80} />
          <col width={150}/>
          <col width={120} />
          <col width={120} />
          <col width={120} />
          <col width={80} />
          <col width={120} />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>name</Th>
            <Th>year of birth</Th>
            <Th>year of death</Th>
            <Th>field of study</Th>
            <Th>modify</Th>
            <Th>modify</Th>
          </StyThRow>
        </thead>
        <tbody>
          {scientistSearchResList?.length > 0 ? (
            scientistSearchResList.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {item.id}
                  </Td>
                  <Td>
                    <StylLink onClick={() => 
                      router.push({
                        pathname: `scientist/${item.id}`,
                        query: queryString.stringify(searchParams),
                      })}>{item.name}</StylLink>
                  </Td>
                  <Td textAlign="center">
                    {item.birthYear}
                  </Td>
                  <Td textAlign="center">
                    {item.deathYear}
                  </Td>
                  <Td>
                    {item.fosNm}
                  </Td>
                  <Td textAlign="center">
                    {item.modifyName}
                  </Td>
                  <Td textAlign="center">
                    {item.modifyTime}
                  </Td>
                </StyTdRow>
              );
            })
          ) : (
            <StyTdRow>
              <Td colSpan={7} className={'empty'}>
                no data
              </Td>
            </StyTdRow>
          )}
        </tbody>
      </StyTable>
      <StylPagination
        total={pageInfoRes?.total ?? 0}
        page={searchParams.page ??  0}
        size={searchParams?.size ?? PageSizeOptions[0]}
        onClick={(value: number) => handleRouteAndSearch('page', value)}
      />
    </div>
  )
}

export default Page;

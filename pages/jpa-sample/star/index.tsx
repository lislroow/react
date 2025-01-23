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
  StarSearchReq,
  StarSearchRes,
} from '@/types/JpaSampleType';

import SampleService from '@/services/JpaSampleService';
import CodeService from "@/services/CodeService";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ CSM, setCSM ] = useState<SelectItem[]>();
  const searchStarReqDef: StarSearchReq = {
    name: '',
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<StarSearchReq>(searchStarReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ starSearchResList, setStarSearchResList ] = useState<StarSearchRes[]>([]);
  const [ searchMode, setSearchMode ] = useState({
    name: 'eq',
  });

  const init = async () => {
    setCSM(CodeService.getFormSelectItem('CHAR_SRCH_MODE'));
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
      queryParam = { ...queryParam, page: 1, size: PageSizeOptions[0]};
    } else {
      return;
    }
    router.push({
      pathname: `/jpa-sample/star`,
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
    }, {} as StarSearchReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = searchStarReqDef;
    }
    setSearchParams(params);
    
    SampleService.getStarsSearch(params)
      .then((response) => {
        setPageInfoRes({
          page: response.data.pagable?.pageNumber-1,
          size: response.data.pagable?.offest,
          start: -1,
          end: -1,
          total: response.data.totalElements,
        });
        setStarSearchResList(response.data.content);
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
            <StylFormSelect type="type1" items={CSM}
              value={searchMode?.name ?? ''}
              size="large"
              onChange={(e) => setSearchMode({
                ...searchMode,
                name: e.target.value,
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
          <col width={120} />
          <col width={80} />
          <col width={120} />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>name</Th>
            <Th>distance</Th>
            <Th>brightness</Th>
            <Th>mass</Th>
            <Th>temperature</Th>
            <Th>modify</Th>
            <Th>modify</Th>
          </StyThRow>
        </thead>
        <tbody>
          {starSearchResList?.length > 0 ? (
            starSearchResList.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {item.id}
                  </Td>
                  <Td>
                    <StylLink onClick={() => 
                      router.push({
                        pathname: `star/${item.id}`,
                        query: queryString.stringify(searchParams),
                      })}>{item.name}</StylLink>
                  </Td>
                  <Td textAlign="center">
                    {item.distance}
                  </Td>
                  <Td textAlign="center">
                    {item.brightness}
                  </Td>
                  <Td>
                    {item.mass}
                  </Td>
                  <Td>
                    {item.temperature}
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
              <Td colSpan={8} className={'empty'}>
                no data
              </Td>
            </StyTdRow>
          )}
        </tbody>
      </StyTable>
      <StylPagination
        total={pageInfoRes?.total ?? 0}
        page={searchParams.page ??  1}
        size={searchParams?.size ?? PageSizeOptions[0]}
        onClick={(value: number) => handleRouteAndSearch('page', value)}
      />
    </div>
  )
}

export default Page;

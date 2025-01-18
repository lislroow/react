import { useState, useEffect } from "react";
import queryString from 'query-string';

import styles from '@/css/global.module.css';
import StylPagination from '@/styles/PaginationStyled';
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';

import {
  PageSizeOptions,
  PageInfoRes,
} from '@/types/CommonType';

import {
  SearchScientistReq,
  ScientistRes,
} from '@/types/MybatisSampleType';

import SampleService from '@/services/MybatisSampleService';
import { useRouter } from "next/router";
import { StylLink } from "@/styles/GeneralStyled";
import StylFormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import CommonCodeService from "@/services/CommonCodeService";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ FOS, setFOS ] = useState<SelectItem[]>();
  const searchScientistReqDef: SearchScientistReq = {
    name: '',
    fosCd: '',
    page: 1,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<SearchScientistReq>({
    name: Array.isArray(query.name) ? query.name[0] : query.name || '',
    fosCd: Array.isArray(query.fosCd) ? query.fosCd[0] : query.fosCd || '',
    page: Array.isArray(query.page) ? Number(query.page[0]) : Number(query.page) || 1,
    size: Array.isArray(query.size) ? Number(query.size[0]) : Number(query.size) || PageSizeOptions[0],
  });
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ scientistRes, setScientistRes ] = useState<ScientistRes[]>([]);

  const init = async () => {
    setFOS(await CommonCodeService.getFormSelectItem('FOS'));
  };

  const handleRouteAndSearch = (name: string = null, _value: any = null) => {
    let param = null;
    if (name === 'page' || name === 'size') {
      param = { ...searchParams, [name]: _value };
    } else if (name ===  null) {
      param = { ...searchParams, page: 1, size: PageSizeOptions[0]};
    } else {
      return;
    }
    router.push({
      pathname: `/mybatis-sample/scientist`,
      query: queryString.stringify(param),
    });
  };

  useEffect(() => {
    init();

    const parsedParams = Object.keys(searchParams).reduce((acc, key) => {
      if (key in query) {
        let value = query[key];
        if (key === 'page' || key === 'size') {
          acc[key] = Array.isArray(value) ? Number(value[0]) : Number(value) || 1;
        } else {
          acc[key] = Array.isArray(value) ? value[0] : value || '';
        }
      }
      return acc;
    }, {} as SearchScientistReq);

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
        setScientistRes(response.data.pageData);
      });
  }, [query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">name</div>
            <input type="text" className="el_input_select2" placeholder="name"
              value={searchParams?.name}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                name: e.target.value,
              })} />
            <div className="param-title">field of study</div>
            <StylFormSelect type="type1" items={FOS}
              value={searchParams?.fosCd}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                fosCd: e.target.value,
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
            <Th>create</Th>
            <Th>create</Th>
          </StyThRow>
        </thead>
        <tbody>
          {scientistRes.length > 0 ? (
            scientistRes.map((item, index) => {
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
                  <Td textAlign="center">
                    {item.createName}
                  </Td>
                  <Td textAlign="center">
                    {item.createTime}
                  </Td>
                </StyTdRow>
              );
            })
          ) : (
            <StyTdRow>
              <Td colSpan={9} className={'empty'}>
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

import { useState, useEffect } from "react";
import queryString from 'query-string';

import styles from '@/css/global.module.css';
import StylPagination from '@/styles/PaginationStyled';
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';

import {
  ResPageInfo,
} from '@/types/CommonType';

import {
  ReqScientists,
  ResScientists,
} from '@/types/SampleType';

import SampleService from '@/services/SampleService';
import { useRouter } from "next/router";
import { StylLink } from "@/styles/GeneralStyled";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const pageSizeOptions = [3, 50, 100];
  const reqScientistDef: ReqScientists = {
    name: '',
    page: 1,
    size: pageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ReqScientists>({
    name: Array.isArray(query.name) ? query.name[0] : query.name || '',
    page: Array.isArray(query.page) ? Number(query.page[0]) : Number(query.page) || 1,
    size: Array.isArray(query.size) ? Number(query.size[0]) : Number(query.size) || pageSizeOptions[0],
  });
  const [ resPageInfo, setResPageInfo ] = useState<ResPageInfo>();
  const [ resScientists, setResScientists ] = useState<ResScientists[]>([]);

  const handleClear = () => {
    setSearchParams(reqScientistDef);
  };

  const handleRouteAndSearch = (name: string = null, _value: any = null) => {
    let param = null;
    if (name === 'page' || name === 'size') {
      param = { ...searchParams, [name]: _value };
    } else if (name ===  null) {
      param = { ...searchParams, page: 1, size: pageSizeOptions[0]};
    } else {
      return;
    }
    router.push({
      pathname: `/mybatis-sample/scientist`,
      query: queryString.stringify(param),
    });
  }

  useEffect(() => {
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
    }, {} as ReqScientists);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = reqScientistDef;
    }
    setSearchParams(params);
    SampleService.getScientistsSearch(params)
      .then((response) => {
        setResPageInfo(response.data.pageInfo);
        setResScientists(response.data.pageData);
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
              })}
            />
          </StylSearchItem>
          <StylSearchBtnArea>
            <button className={styles.button_sm1} type={'button'} onClick={() => handleRouteAndSearch()}>조회</button>
          </StylSearchBtnArea>
        </StylSearchGroup>
      </StylSearchArea>
      <StyTable>
        <colgroup>
          <col width={80} />
          <col width={120} />
          <col width={120} />
          <col />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>year of birth</Th>
            <Th>year of death</Th>
            <Th>name</Th>
          </StyThRow>
        </thead>
        <tbody>
          {resScientists.length > 0 ? (
            resScientists.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {resPageInfo.total - (resPageInfo.size * (resPageInfo.page -1)) - index}
                  </Td>
                  <Td textAlign="center">
                    {item.birthYear}
                  </Td>
                  <Td textAlign="center">
                    {item.deathYear}
                  </Td>
                  <Td>
                    <StylLink onClick={() => 
                      router.push({
                        pathname: `scientist/${item.id}`,
                        query: queryString.stringify(searchParams),
                      })}>{item.name}</StylLink>
                  </Td>
                </StyTdRow>
              );
            })
          ) : (
            <StyTdRow>
              <Td colSpan={4} className={'empty'}>
                no data
              </Td>
            </StyTdRow>
          )}
        </tbody>
      </StyTable>
      <StylPagination
        total={resPageInfo?.total ?? 0}
        page={searchParams.page ??  1}
        size={searchParams?.size ?? pageSizeOptions[0]}
        onClick={(value: number) => handleRouteAndSearch('page', value)}
      />
    </div>
  )
}

export default Page;

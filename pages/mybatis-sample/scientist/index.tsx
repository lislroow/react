import { useState, useEffect } from "react";
import queryString from 'query-string';

import { Button } from "@mui/material";
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
  const pageSizeOptions = [5, 10, 50, 100];
  const reqScientistDef: ReqScientists = {
    name: Array.isArray(query.name) ? query.name[0] : query.name || '',
    page: Array.isArray(query.page) ? Number(query.page[0]) : Number(query.page) || 1,
    size: Array.isArray(query.size) ? Number(query.size[0]) : Number(query.size) || pageSizeOptions[0],
  };
  
  const [ searchParams, setSearchParams ] = useState<ReqScientists>(reqScientistDef);
  const [ resPageInfo, setResPageInfo ] = useState<ResPageInfo>();
  const [ resScientists, setResScientists ] = useState<ResScientists[]>([]);

  const search = (name: string = null, _value: any = null) => {
    let param = null;
    if (name === 'page' || name === 'size') {
      param = { ...searchParams, [name]: _value };
    } else if (name ===  null) {
      param = { ...searchParams, page: 1, size: pageSizeOptions[0]};
    } else {
      return;
    }
    router.push({
      pathname: `scientist`,
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
    <section>
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">name</div>
            <input type="text" className="el_input_select2" placeholder="name"
              value={searchParams?.name}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                name: e.target.value,
              })}
            />
          </StylSearchItem>
        </StylSearchGroup>
        <StylSearchBtnArea>
          <Button style={{ width: '80px' }} onClick={() => search()} id="searchBtn" variant="contained">조회</Button>
        </StylSearchBtnArea>
      </StylSearchArea>
      <StyTable>
        <colgroup>
          <col width={80} />
          <col />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>name</Th>
          </StyThRow>
        </thead>
        <tbody>
          {resScientists.length > 0 ? (
            resScientists.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td>
                    {resPageInfo.total - searchParams.size * (searchParams.page -1) - index}
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
              <Td colSpan={2} className={'empty'}>
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
        onClick={(value: number) => search('page', value)}
      />
    </section>
  )
}

export default Page;
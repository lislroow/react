import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from 'query-string';

import styles from '@/css/global.module.css';
import StylPagination from '@/styles/PaginationStyled';
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';
import { SelectItem } from '@/styles/FormSelectStyled';

import {
  PageSizeOptions,
  PageInfoRes,
} from '@/types/CommonType';
import {
  CodeSearchReq,
  CodeSearchRes,
} from '@/types/CodeMngType';
import CodeMngService from '@/services/CodeMngService';
import CodeService from '@/services/CodeService';
import StylFormSelect from "@/styles/FormSelectStyled";

const Page = () => {
  const router = useRouter();
  
  const [ USE_YN, setUSE_YN ] = useState<SelectItem[]>();

  const codeSearchReqDef: CodeSearchReq = {
    cdGrp: '',
    cdGrpNm: '',
    cd: '',
    cdNm: '',
    useYn: '',
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<CodeSearchReq>(codeSearchReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ codeSearchResList, setCodeSearchResList ] = useState<CodeSearchRes[]>([]);

  const init = async () => {
    setUSE_YN(CodeService.getYN('사용', '미사용'));
  }

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
      pathname: `/common/code-mng`,
      query: queryString.stringify(queryParam),
    });
  }
  
  useEffect(() => {
    init();

    const parsedParams = Object.keys(searchParams).reduce((acc, key) => {
      if (key in router.query) {
        let value = router.query[key];
        if (key === 'page' || key === 'size') {
          acc[key] = Array.isArray(value) ? Number(value[0]) : Number(value) || 0;
        } else {
          acc[key] = Array.isArray(value) ? value[0] : value || '';
        }
      }
      return acc;
    }, {} as CodeSearchReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = codeSearchReqDef;
    }
    setSearchParams(params);
    
    CodeMngService.getCodesSearch(params)
      .then((response) => {
        setPageInfoRes(response.data.pageInfo);
        setCodeSearchResList(response.data.pageData);
      });
  }, [router.query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">code group</div>
            <input type="text" className="el_input_select2" placeholder="code group"
              value={searchParams?.cdGrp ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cdGrp: e.target.value,
              })} />
            <div className="param-title">code group name</div>
            <input type="text" className="el_input_select2" placeholder="code group name"
              value={searchParams?.cdGrpNm ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cdGrpNm: e.target.value,
              })} />
          </StylSearchItem>
          <StylSearchItem>
            <div className="param-title">code</div>
            <input type="text" className="el_input_select2" placeholder="code"
              value={searchParams?.cd ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cd: e.target.value,
              })} />
            <div className="param-title">code name</div>
            <input type="text" className="el_input_select2" placeholder="code name"
              value={searchParams?.cdNm ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cdNm: e.target.value,
              })} />
            <div className="param-title">use yn</div>
            <StylFormSelect type="type1" items={USE_YN}
              value={searchParams?.useYn ?? ''}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                useYn: e.target.value,
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
          <col width={180} />
          <col width={200} />
          <col width={60} />
          <col width={100} />
          <col />
          <col width={80} />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>code group</Th>
            <Th>code group name</Th>
            <Th>seq</Th>
            <Th>code</Th>
            <Th>code name</Th>
            <Th>use</Th>
          </StyThRow>
        </thead>
        <tbody>
          {codeSearchResList?.length > 0 ? (
            codeSearchResList.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {codeSearchResList.length - index}
                  </Td>
                  <Td>
                    {item.cdGrp}
                  </Td>
                  <Td>
                    {item.cdGrpNm}
                  </Td>
                  <Td textAlign="center">
                    {item.seq}
                  </Td>
                  <Td>
                    {item.cd}
                  </Td>
                  <Td>
                    {item.cdNm}
                  </Td>
                  <Td textAlign="center">
                    {item.useYn}
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

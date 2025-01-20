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
  TokenSearchReq,
  TokenSearchRes,
} from '@/types/TokenMngTypes';

import TokenMngService from '@/services/TokenMngService';
import { useRouter } from "next/router";
import { StylLink, StylText } from "@/styles/GeneralStyled";
import StylFormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import CodeService from "@/services/CodeService";
import StylButtonGroup from "@/styles/ButtonGroupStyled";
import StylModal from "@/styles/ModalStyled";
import StylFormField from "@/styles/FormFieldStyled";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ ENABLE_YN, setENABLE_YN ] = useState<SelectItem[]>();
  const [ LOCKED_YN, setLOCKED_YN ] = useState<SelectItem[]>();
  const tokenSearchReqDef: TokenSearchReq = {
    tokenId: '',
    clientId: '',
    enableYn: '',
    lockedYn: '',
    page: 1,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<TokenSearchReq>(tokenSearchReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ tokenSearchResList, setTokenSearchResList ] = useState<TokenSearchRes[]>([]);

  const init = async () => {
    setENABLE_YN(CodeService.getFormSelectItem('ENABLE_YN'));
    setLOCKED_YN(CodeService.getFormSelectItem('LOCKED_YN'));
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
      pathname: `/token-mng`,
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
    }, {} as TokenSearchReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = tokenSearchReqDef;
    }
    setSearchParams(params);
    
    TokenMngService.getTokensSearch(params)
      .then((response) => {
        setPageInfoRes(response.data.pageInfo);
        setTokenSearchResList(response.data.pageData);
      });
  }, [query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">token id</div>
            <input type="text" className="el_input_select2" placeholder="token id"
              value={searchParams?.tokenId ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                tokenId: e.target.value,
              })} />
            <div className="param-title">client id</div>
            <input type="text" className="el_input_select2" placeholder="client id"
              value={searchParams?.clientId ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                clientId: e.target.value,
              })} />
            <div className="param-title">enable</div>
            <StylFormSelect type="type1" items={ENABLE_YN}
              value={searchParams?.enableYn ?? ''}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                enableYn: e.target.value,
              })} />
            <div className="param-title">locked</div>
            <StylFormSelect type="type1" items={LOCKED_YN}
              value={searchParams?.lockedYn ?? ''}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                lockedYn: e.target.value,
              })} />
          </StylSearchItem>
          <StylSearchBtnArea>
            <button className={styles.button_sm1} type={'button'} onClick={() => handleRouteAndSearch()}>조회</button>
          </StylSearchBtnArea>
        </StylSearchGroup>
      </StylSearchArea>
      <StyTable>
        <colgroup>
          <col width={50} />
          <col width={120} />
          <col width={80} />
          <col width={80} />
          <col width={80} />
          <col width={120} />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>client id</Th>
            <Th>enable</Th>
            <Th>locked</Th>
            <Th>modify</Th>
            <Th>modify</Th>
          </StyThRow>
        </thead>
        <tbody>
          {tokenSearchResList.length > 0 ? (
            tokenSearchResList.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {pageInfoRes.total - (pageInfoRes.size * (pageInfoRes.page -1)) - index}
                  </Td>
                  <Td textAlign="center">
                    {item.clientId}
                  </Td>
                  <Td textAlign="center">
                    {item.enableYn}
                  </Td>
                  <Td textAlign="center">
                    {item.lockedYn}
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
              <Td colSpan={6} className={'empty'}>
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

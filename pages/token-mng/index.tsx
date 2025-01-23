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
  AddTokenClientReq,
  SearchClientTokenReq,
  SearchClientTokenRes,
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
  const searchClientTokenReqDef: SearchClientTokenReq = {
    clientId: '',
    tokenKey: '',
    contactName: '',
    enableYn: '',
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<SearchClientTokenReq>(searchClientTokenReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ searchClientTokenResList, setSearchClientTokenResList ] = useState<SearchClientTokenRes[]>([]);
  const [ registerModal, setRegisterModal ] = useState<boolean>(false);
    const [ registerModalMessage, setRegisterModalMessage ] = useState<string>('');
    const [ addTokenClientReq, setAddTokenClientReq ] = useState<AddTokenClientReq>({
      clientId: '3202501000000002',
      clientName: 'OO 기관 OO 시스템',
      clientIp: '172.28.200.111',
      roles: 'CLIENT',
      enableYn: 'Y',
      expDate: '2025-02-14',
    });

  const init = async () => {
    setENABLE_YN(CodeService.getFormSelectItem('ENABLE_YN'));
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
      pathname: `/token-mng`,
      query: queryString.stringify(queryParam),
    });
  };

  const handleRegistration = () => {
    TokenMngService.postAddClientToken(addTokenClientReq)
      .then((response) => {
        // setAddTokenClientReq({});
        setRegisterModal(false);
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
    }, {} as SearchClientTokenReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = searchClientTokenReqDef;
    }
    setSearchParams(params);
    
    TokenMngService.getSearchClientTokens(params)
      .then((response) => {
        setPageInfoRes(response.data.pageInfo);
        setSearchClientTokenResList(response.data.pageData);
      });
  }, [query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">client id</div>
            <input type="text" className="el_input_select2" placeholder="token id"
              value={searchParams?.clientId ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                clientId: e.target.value,
              })} />
            <div className="param-title">token key</div>
            <input type="text" className="el_input_select2" placeholder="client id"
              value={searchParams?.tokenKey ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                tokenKey: e.target.value,
              })} />
            <div className="param-title">contact name</div>
            <StylFormSelect type="type1" items={ENABLE_YN}
              value={searchParams?.contactName ?? ''}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                contactName: e.target.value,
              })} />
            <div className="param-title">enable</div>
            <StylFormSelect type="type1" items={ENABLE_YN}
              value={searchParams?.enableYn ?? ''}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                enableYn: e.target.value,
              })} />
          </StylSearchItem>
          <StylSearchBtnArea>
            <button className={styles.button_sm1} type={'button'} onClick={() => handleRouteAndSearch()}>조회</button>
          </StylSearchBtnArea>
        </StylSearchGroup>
      </StylSearchArea>
      <StylButtonGroup
        btn1Label="등록"
        btn1OnClick={() => setRegisterModal(true)}
      >
      </StylButtonGroup>
      <StyTable>
        <colgroup>
          <col width={50} />
          <col width={90} />
          <col width={120} />
          <col width={130} />

          <col width={80} />
          <col width={80} />
          <col width={80} />
          <col width={80} />
          <col width={80} />
          <col width={80} />

          <col width={80} />
          <col width={120} />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>contact name</Th>
            <Th>contact email</Th>
            <Th>token key</Th>

            <Th>client id</Th>
            <Th>client ip</Th>
            <Th>client name</Th>
            <Th>roles</Th>
            <Th>enable</Th>
            <Th>exp date</Th>

            <Th>modify</Th>
            <Th>modify</Th>
          </StyThRow>
        </thead>
        <tbody>
          {searchClientTokenResList?.length > 0 ? (
            searchClientTokenResList.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {pageInfoRes.total - (pageInfoRes.size * (pageInfoRes.page -1)) - index}
                  </Td>
                  <Td textAlign="center">
                    {item.contactName}
                  </Td>
                  <Td textAlign="center">
                    {item.contactEmail}
                  </Td>
                  <Td textAlign="center">
                    {item.tokenKey}
                  </Td>
                  <Td textAlign="center">
                    {item.clientId}
                  </Td>
                  <Td textAlign="center">
                    {item.clientIp}
                  </Td>
                  <Td textAlign="center">
                    {item.clientName}
                  </Td>
                  <Td textAlign="center">
                    {item.roles}
                  </Td>
                  <Td textAlign="center">
                    {item.enableYn}
                  </Td>
                  <Td textAlign="center">
                    {item.expDate}
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
              <Td colSpan={12} className={'empty'}>
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
      <StylModal open={registerModal}
        title="ClientToken 등록"
        confirmBtnNm="등록"
        cancelBtnNm="취소"
        handleOkClick={() => {
          handleRegistration();
        }}
        maxWidth="600px"
        handleCloseClick={() => {
          //setAddTokenClientReq({});
          setRegisterModalMessage('');
          setRegisterModal(false);
        }}>
        <main>
          {registerModalMessage ??
            <StylText>{registerModalMessage}</StylText>
          }
          <StylFormField title="client id">
            <input type="text"
              className={`el_input el_input_lg`}
              value={addTokenClientReq?.clientId ?? ''}
              onChange={(e) => setAddTokenClientReq({...addTokenClientReq, 'clientId': e.target.value})} />
          </StylFormField>
          <StylFormField title="client name">
            <input type="text"
              className={`el_input el_input_lg`}
              value={addTokenClientReq?.clientName ?? ''}
              onChange={(e) => setAddTokenClientReq({...addTokenClientReq, 'clientName': e.target.value})} />
          </StylFormField>
          <StylFormField title="client ip">
            <input type="text"
              className={`el_input el_input_lg`}
              value={addTokenClientReq?.clientIp ?? ''}
              onChange={(e) => setAddTokenClientReq({...addTokenClientReq, 'clientIp': e.target.value})} />
          </StylFormField>
          <StylFormField title="roles">
            <input type="text"
              className={`el_input el_input_lg`}
              value={addTokenClientReq?.roles ?? ''}
              onChange={(e) => setAddTokenClientReq({...addTokenClientReq, 'roles': e.target.value})} />
          </StylFormField>
          <StylFormField title="enable">
            <input type="text"
              className={`el_input el_input_lg`}
              value={addTokenClientReq?.enableYn ?? ''}
              onChange={(e) => setAddTokenClientReq({...addTokenClientReq, 'enableYn': e.target.value})} />
          </StylFormField>
          <StylFormField title="exp date">
            <input type="text"
              className={`el_input el_input_lg`}
              value={addTokenClientReq?.expDate ?? ''}
              onChange={(e) => setAddTokenClientReq({...addTokenClientReq, 'expDate': e.target.value})} />
          </StylFormField>
        </main>
      </StylModal>
    </div>
  )
}

export default Page;

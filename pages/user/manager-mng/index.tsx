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
  ManagerSearchReq,
  ManagerSearchRes,
  SendRegistrationReq,
} from '@/types/UserMngTypes';

import UserMngService from '@/services/UserMngService';
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
  const [ LOCKED_YN, setLOCKED_YN ] = useState<SelectItem[]>();
  const [ ENABLE_YN, setENABLE_YN ] = useState<SelectItem[]>();
  const managerSearchReqDef: ManagerSearchReq = {
    loginId: '',
    mgrName: '',
    roles: '',
    enableYn: '',
    lockedYn: '',
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ManagerSearchReq>(managerSearchReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ managerSearchResList, setManagerSearchResList ] = useState<ManagerSearchRes[]>([]);
  const [ registerModal, setRegisterModal ] = useState<boolean>(false);
  const [ registerModalMessage, setRegisterModalMessage ] = useState<string>('');
  const [ sendRegistrationReq, setSendRegistrationReq ] = useState<SendRegistrationReq>({
    toEmail: 'hi@mgkim.net',
    toName: '홍길동',
    grantRoles: 'MANAGER',
  });

  const init = async () => {
    setLOCKED_YN(CodeService.getYN('활성', '비활성'));
    setENABLE_YN(CodeService.getYN('잠김', '정상'));
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
      pathname: `/user/manager-mng`,
      query: queryString.stringify(queryParam),
    });
  };

  const handleRegistration = () => {
    UserMngService.postRegistrationSend(sendRegistrationReq)
      .then((response) => {
        setSendRegistrationReq({});
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
    }, {} as ManagerSearchReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = managerSearchReqDef;
    }
    setSearchParams(params);
    
    UserMngService.getManagersSearch(params)
      .then((response) => {
        setPageInfoRes(response.data.pageInfo);
        setManagerSearchResList(response.data.pageData);
      });
  }, [query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">login id</div>
            <input type="text" className="el_input_select2" placeholder="login id"
              value={searchParams?.loginId ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                loginId: e.target.value,
              })} />
            <div className="param-title">name</div>
            <input type="text" className="el_input_select2" placeholder="name"
              value={searchParams?.mgrName ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                mgrName: e.target.value,
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
      <StylButtonGroup
        btn1Label="등록"
        btn1OnClick={() => setRegisterModal(true)}
      >
      </StylButtonGroup>
      <StyTable>
        <colgroup>
          <col width={50} />
          <col width={120} />
          <col width={200} />
          <col width={120} />
          <col width={80} />
          <col width={80} />
          <col width={120} />
          <col width={80} />
          <col width={120} />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>id</Th>
            <Th>login id</Th>
            <Th>name</Th>
            <Th>disabled</Th>
            <Th>locked</Th>
            <Th>pwd-exp date</Th>
            <Th>modify</Th>
            <Th>modify</Th>
          </StyThRow>
        </thead>
        <tbody>
          {managerSearchResList?.length > 0 ? (
            managerSearchResList.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {pageInfoRes.total - (pageInfoRes.size * (pageInfoRes.page -1)) - index}
                  </Td>
                  <Td textAlign="center">
                    <StylLink onClick={() => 
                      router.push({
                        pathname: `/user/manager-mng/${item.id}`,
                        query: queryString.stringify(searchParams),
                      })}>{item.id}</StylLink>
                  </Td>
                  <Td>
                    {item.loginId}
                  </Td>
                  <Td textAlign="center">
                    {item.mgrName}
                  </Td>
                  <Td textAlign="center">
                    {item.enableYn}
                  </Td>
                  <Td textAlign="center">
                    {item.lockedYn}
                  </Td>
                  <Td textAlign="center">
                    {item.pwdExpDate}
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
              <Td colSpan={9} className={'empty'}>
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
        title="사용자 등록 코드 발송"
        confirmBtnNm="발송"
        cancelBtnNm="취소"
        handleOkClick={() => {
          handleRegistration();
        }}
        maxWidth="600px"
        handleCloseClick={() => {
          setSendRegistrationReq({});
          setRegisterModalMessage('');
          setRegisterModal(false);
        }}>
        <main>
          {registerModalMessage ??
            <StylText>{registerModalMessage}</StylText>
          }
          <StylFormField title="email">
            <input type="text"
              className={`el_input el_input_lg`}
              value={sendRegistrationReq?.toEmail ?? ''}
              onChange={(e) => setSendRegistrationReq({...sendRegistrationReq, 'toEmail': e.target.value})} />
          </StylFormField>
          <StylFormField title="name">
            <input type="text"
              className={`el_input el_input_lg`}
              value={sendRegistrationReq?.toName ?? ''}
              onChange={(e) => setSendRegistrationReq({...sendRegistrationReq, 'toName': e.target.value})} />
          </StylFormField>
          <StylFormField title="grant role">
            <input type="text"
              className={`el_input el_input_lg`}
              value={sendRegistrationReq?.grantRoles ?? ''}
              onChange={(e) => setSendRegistrationReq({...sendRegistrationReq, 'grantRoles': e.target.value})} />
          </StylFormField>
        </main>
      </StylModal>
    </div>
  )
}

export default Page;

import { useState, useEffect } from "react";
import queryString from 'query-string';

import styles from '@/css/global.module.css';
import StylPagination from '@/styles/PaginationStyled';
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';

import {
  PageSizeOptions,
  ResPageInfo,
} from '@/types/CommonType';

import {
  ReqManagers,
  ResManagers,
} from '@/types/UserMngTypes';

import UserMngService from '@/services/UserMngService';
import { useRouter } from "next/router";
import { StylLink } from "@/styles/GeneralStyled";
import StylFormSelect, { SelectItem } from "@/styles/FormSelectStyled";
import CommonCodeService from "@/services/CommonCodeService";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ LOCKED_YN, setLOCKED_YN ] = useState<SelectItem[]>();
  const [ DISABLED_YN, setDISABLED_YN ] = useState<SelectItem[]>();
  const reqManagersDef: ReqManagers = {
    loginId: '',
    mgrName: '',
    role: '',
    disabledYn: '',
    lockedYn: '',
    page: 1,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ReqManagers>({
    loginId: Array.isArray(query.loginId) ? query.loginId[0] : query.loginId || '',
    mgrName: Array.isArray(query.mgrName) ? query.mgrName[0] : query.mgrName || '',
    role: Array.isArray(query.role) ? query.role[0] : query.role || '',
    disabledYn: Array.isArray(query.disabledYn) ? query.disabledYn[0] : query.disabledYn || '',
    lockedYn: Array.isArray(query.lockedYn) ? query.lockedYn[0] : query.lockedYn || '',
    page: Array.isArray(query.page) ? Number(query.page[0]) : Number(query.page) || 1,
    size: Array.isArray(query.size) ? Number(query.size[0]) : Number(query.size) || PageSizeOptions[0],
  });
  const [ resPageInfo, setResPageInfo ] = useState<ResPageInfo>();
  const [ resManagers, setResManagers ] = useState<ResManagers[]>([]);

  const init = async () => {
    setLOCKED_YN(await CommonCodeService.getFormSelectItem('LOCKED_YN'));
    setDISABLED_YN(await CommonCodeService.getFormSelectItem('DISABLED_YN'));
  }

  const handleClear = () => {
    setSearchParams(reqManagersDef);
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
      pathname: `/user/user-mng`,
      query: queryString.stringify(param),
    });
  }

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
    }, {} as ReqManagers);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = reqManagersDef;
    }
    setSearchParams(params);
    UserMngService.getManagersSearch(params)
      .then((response) => {
        setResPageInfo(response.data.pageInfo);
        setResManagers(response.data.pageData);
      });
  }, [query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">login id</div>
            <input type="text" className="el_input_select2" placeholder="login id"
              value={searchParams?.loginId}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                loginId: e.target.value,
              })} />
            <div className="param-title">name</div>
            <input type="text" className="el_input_select2" placeholder="name"
              value={searchParams?.mgrName}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                mgrName: e.target.value,
              })} />
            <div className="param-title">disabled</div>
            <StylFormSelect type="type1" items={DISABLED_YN}
              value={searchParams?.disabledYn}
              size="large"
              onChange={(e) => setSearchParams({
                ...searchParams,
                disabledYn: e.target.value,
              })} />
            <div className="param-title">locked</div>
            <StylFormSelect type="type1" items={LOCKED_YN}
              value={searchParams?.lockedYn}
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
          <col width={120} />
          <col width={120} />
          <col width={80} />
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
          </StyThRow>
        </thead>
        <tbody>
          {resManagers.length > 0 ? (
            resManagers.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {resPageInfo.total - (resPageInfo.size * (resPageInfo.page -1)) - index}
                  </Td>
                  <Td textAlign="center">
                    <StylLink onClick={() => 
                      router.push({
                        pathname: `scientist/${item.id}`,
                        query: queryString.stringify(searchParams),
                      })}>{item.id}</StylLink>
                  </Td>
                  <Td>
                    {item.loginId}
                  </Td>
                  <Td>
                    {item.mgrName}
                  </Td>
                  <Td>
                    {item.disabledYn}
                  </Td>
                  <Td>
                    {item.lockedYn}
                  </Td>
                  <Td>
                    {item.pwdExpDate}
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
        total={resPageInfo?.total ?? 0}
        page={searchParams.page ??  1}
        size={searchParams?.size ?? PageSizeOptions[0]}
        onClick={(value: number) => handleRouteAndSearch('page', value)}
      />
    </div>
  )
}

export default Page;

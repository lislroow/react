import { useState, useEffect } from "react";
import queryString from 'query-string';

import styles from '@/css/global.module.css';
import StylPagination from '@/styles/PaginationStyled';
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';
import { SelectItem } from '@/styles/FormSelectStyled';

import {
  PageSizeOptions,
  ResPageInfo,
} from '@/types/CommonType';

import {
  ReqCodes,
  ResCodes,
} from '@/types/CommonCodeType';

import CommonCodeMngService from '@/services/CommonCodeMngService';
import CommonCodeService from '@/services/CommonCodeService';
import { useRouter } from "next/router";
import StylFormSelect from "@/styles/FormSelectStyled";

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const [ USE_YN, setUSE_YN ] = useState<SelectItem[]>();
  const reqCodesDef: ReqCodes = {
    cdGrp: '',
    cdGrpNm: '',
    cd: '',
    cdNm: '',
    useYn: '',
    page: 1,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<ReqCodes>({
    cdGrp: Array.isArray(query.cdGrp) ? query.cdGrp[0] : query.cdGrp || '',
    cdGrpNm: Array.isArray(query.cdGrpNm) ? query.cdGrpNm[0] : query.cdGrpNm || '',
    cd: Array.isArray(query.cd) ? query.cd[0] : query.cd || '',
    cdNm: Array.isArray(query.cdNm) ? query.cdNm[0] : query.cdNm || '',
    useYn: Array.isArray(query.useYn) ? query.useYn[0] : query.useYn || '',
    page: Array.isArray(query.page) ? Number(query.page[0]) : Number(query.page) || 1,
    size: Array.isArray(query.size) ? Number(query.size[0]) : Number(query.size) || PageSizeOptions[0],
  });
  const [ resPageInfo, setResPageInfo ] = useState<ResPageInfo>();
  const [ resCodes, setResCodes ] = useState<ResCodes[]>([]);

  const init = async () => {
    setUSE_YN(await CommonCodeService.getFormSelectItem('USE_YN'));
  }

  const handleClear = () => {
    setSearchParams(reqCodesDef);
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
      pathname: `/common-code`,
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
    }, {} as ReqCodes);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = reqCodesDef;
    }
    setSearchParams(params);
    CommonCodeMngService.getCodesSearch(params)
      .then((response) => {
        setResPageInfo(response.data.pageInfo);
        setResCodes(response.data.pageData);
      });
  }, [query]);
  
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">code group</div>
            <input type="text" className="el_input_select2" placeholder="code group"
              value={searchParams?.cdGrp}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cdGrp: e.target.value,
              })} />
            <div className="param-title">code group name</div>
            <input type="text" className="el_input_select2" placeholder="code group name"
              value={searchParams?.cdGrpNm}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cdGrpNm: e.target.value,
              })} />
          </StylSearchItem>
          <StylSearchItem>
            <div className="param-title">code</div>
            <input type="text" className="el_input_select2" placeholder="code"
              value={searchParams?.cd}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cd: e.target.value,
              })} />
            <div className="param-title">code name</div>
            <input type="text" className="el_input_select2" placeholder="code name"
              value={searchParams?.cdNm}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                cdNm: e.target.value,
              })} />
            <div className="param-title">use yn</div>
            <StylFormSelect type="type1" items={USE_YN}
              value={searchParams?.useYn}
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
          <col width={100} />
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
          {resCodes.length > 0 ? (
            resCodes.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td textAlign="right">
                    {resCodes.length - index}
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
        total={resPageInfo?.total ?? 0}
        page={searchParams.page ??  1}
        size={searchParams?.size ?? PageSizeOptions[0]}
        onClick={(value: number) => handleRouteAndSearch('page', value)}
      />
    </div>
  )
}

export default Page;
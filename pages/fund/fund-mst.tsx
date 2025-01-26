import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from 'query-string';

import { ResponsiveLine } from '@nivo/line';

import styles from '@/css/global.module.css';
import StylPagination from '@/styles/PaginationStyled';
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';
import StylButtonGroup from "@/styles/ButtonGroupStyled";

import {
  PageSizeOptions,
  PageInfoRes,
} from '@/types/CommonType';

import {
  FundMstSearchReq,
  FundMstSearchRes,
} from '@/types/FundType';

import FundService from '@/services/FundService';

const Page = () => {
  const router = useRouter();
  const { query } = router;
  const searchPlanetReqDef: FundMstSearchReq = {
    fundCd: '',
    fundFnm: '',
    page: 0,
    size: PageSizeOptions[0],
  };
  const [ searchParams, setSearchParams ] = useState<FundMstSearchReq>(searchPlanetReqDef);
  const [ pageInfoRes, setPageInfoRes ] = useState<PageInfoRes>();
  const [ fundMstSearchResList, setFundMstSearchResList ] = useState<FundMstSearchRes[]>([]);
  const [ fundIrRes, setFundIrRes ] = useState<any>([]);

  const init = async () => {
  };

  const handleFindFundIrs = (fundCd: string) => {
    FundService.getIrLineChart(fundCd)
      .then((response) => {
        const formattedData = [
          {
            id: fundCd,
            data: response.data.map((item: { basYmd: string; basPrice: number }) => ({
              x: item.basYmd,
              y: item.basPrice
            }))
          }
        ];
        setFundIrRes(formattedData);
      });
  };

  const handleAllExcelDown = () => {
    FundService.getFundMstsAllExcelDown();
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
      pathname: `/fund/fund-mst`,
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
    }, {} as FundMstSearchReq);

    let params = null;
    if (Object.keys(parsedParams).length > 0) {
      params = {...searchParams, ...parsedParams};
    } else {
      params = searchPlanetReqDef;
    }
    setSearchParams(params);
    
    FundService.getFundMstsSearch(params)
      .then((response) => {
        setPageInfoRes({
          page: response.data.pagable?.pageNumber,
          size: response.data.pagable?.pageSize,
          start: -1,
          end: -1,
          total: response.data.totalElements,
        });
        setFundMstSearchResList(response.data.content);
      });
  }, [query]);
  

  useEffect(() => {
  }, [pageInfoRes, fundMstSearchResList]);
  
  return (
    <div className="contents">
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">fund cd</div>
            <input type="text" className="el_input_select2" placeholder="name"
              value={searchParams?.fundCd ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                fundCd: e.target.value,
              })} />
            <div className="param-title">fund name</div>
            <input type="text" className="el_input_select2" placeholder="name"
              value={searchParams?.fundFnm ?? ''}
              onKeyDown={(e) => e.key === 'Enter' && handleRouteAndSearch()}
              onChange={(e) => setSearchParams({
                ...searchParams,
                fundFnm: e.target.value,
              })} />
          </StylSearchItem>
          <StylSearchBtnArea>
            <button className={styles.button_sm1} type={'button'} onClick={() => handleRouteAndSearch()}>조회</button>
          </StylSearchBtnArea>
        </StylSearchGroup>
      </StylSearchArea>
      <StylButtonGroup
        btn1Label="EXCEL(ALL)"
        btn1OnClick={() => handleAllExcelDown()}
      />
      <StyTable>
        <colgroup>
          <col width={80} />
          <col width={100}/>
          <col width={250} />
          <col width={120} />
          <col width={80} />
          <col width={140} />
          <col width={140} />
          <col width={100} />
        </colgroup>
        <thead>
          <StyThRow>
            <Th>no.</Th>
            <Th>펀드코드</Th>
            <Th>펀드명</Th>
            <Th>단위가</Th>
            <Th>설정일</Th>
            <Th>최초설정액</Th>
            <Th>최초설정좌수</Th>
            <Th>최초기준가</Th>
          </StyThRow>
        </thead>
        <tbody>
          {fundMstSearchResList?.length > 0 ? (
            fundMstSearchResList.map((item, index) => {
              const handleRowDoubleClick = () => {
                handleFindFundIrs(item.fundCd);
              };
              return (
                <StyTdRow key={index} onDoubleClick={handleRowDoubleClick}>
                  <Td textAlign="right">
                    {pageInfoRes.total - (searchParams?.page * searchParams?.size) - index}
                  </Td>
                  <Td textAlign="center">
                    {item.fundCd}
                  </Td>
                  <Td>
                    {item.fundFnm}
                  </Td>
                  <Td>
                    {item.unitPrice}
                  </Td>
                  <Td>
                    {item.seoljYmd}
                  </Td>
                  <Td>
                    {item.fstSeoljAek}
                  </Td>
                  <Td>
                    {item.fstSeoljJwa}
                  </Td>
                  <Td>
                    {item.fstGijunGa}
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
        page={searchParams?.page ??  0}
        size={searchParams?.size ?? PageSizeOptions[0]}
        onClick={(value: number) => handleRouteAndSearch('page', value)}
      />
      <div style={{ height: 350 }}>
        <ResponsiveLine
          data={fundIrRes}
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }} // x값이 범주형(문자열)임을 명시
          yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
          axisLeft={{ tickSize: 5, tickPadding: 5 }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickValues: fundIrRes[0]?.data.length > 10
              ? fundIrRes[0]?.data.filter((_, index) => index % Math.ceil(fundIrRes[0]?.data.length / 10) === 0).map(item => item.x)
              : fundIrRes[0]?.data.map(item => item.x),
          }}
          colors={{ scheme: 'nivo' }}
        />
      </div>
    </div>
  )
}

export default Page;

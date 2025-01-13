import { useState, useEffect } from "react";

import { Button, Link } from "@mui/material";
import StylPagination from '@/styles/PaginationStyled';
import { StylSearchArea, StylSearchGroup, StylSearchItem, StylSearchBtnArea } from "@/styles/SearchStyled";
import { StyTable, StyTdRow, StyThRow, Td, Th } from '@/styles/TableStyled';

import {
  ReqPageInfo,
  ResPageInfo,
} from '@/types/CommonType';

import {
  ReqScientists,
  ResScientists,
} from '@/types/SampleType';

import SampleService from '@/services/SampleService';
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();
  const pageSizeOptions = [10, 20, 100];
  const [ reqPageInfo, setReqPageInfo ] = useState<ReqPageInfo>({ page: 1, size: pageSizeOptions[0]});
  const [ resPageInfo, setResPageInfo ] = useState<ResPageInfo>();
  const [ data, setData ] = useState<ResScientists[]>([]);
  const [ searchParams, setSearchParams ] = useState<ReqScientists>({
    name: ''
  });

  const defaultParams = {
    name: ''
  };

  const handleSearchParams = (name: string, _value: any) => {
    setSearchParams({ ...searchParams, [name]: _value });
    (name === 'page' || name === 'size') && search(name, _value);
  };

  const search = (_name: string = '', _value: any = null) => {
    const params: ReqScientists = {
      ...searchParams,
      [_name]: _value,
      page: _name === 'page' ? _value : reqPageInfo.page,
      size: _name === 'size' ? _value : reqPageInfo.size,
    };
    SampleService.getScientistsSearch(params)
      .then((response) => {
        setResPageInfo(response.data.pageInfo);
        setData(response.data.pageData);
      });
  };

  useEffect(() => {
    setSearchParams({ ...defaultParams });
    search();
  }, [reqPageInfo.page, reqPageInfo.size]);
  
  return (
    <section>
      <StylSearchArea>
        <StylSearchGroup>
          <StylSearchItem>
            <div className="param-title">name</div>
            <input
              type="text"
              className="el_input_select2"
              placeholder="name"
              value={searchParams?.name}
              onKeyDown={(e) => { if (e.key === 'Enter') search(); } }
              onChange={(e) => handleSearchParams('name', e.target.value)}
            />
          </StylSearchItem>
        </StylSearchGroup>
        <StylSearchBtnArea>
          <Button style={{ width: '80px' }} onClick={() => search()} id="searchFocus_0" variant="contained">조회</Button>
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
          {data.length > 0 ? (
            data.map((item, index) => {
              return (
                <StyTdRow key={index}>
                  <Td>
                    {resPageInfo.total - reqPageInfo.size * (reqPageInfo.page -1) - index}
                  </Td>
                  <Td>
                    <Link onClick={() => router.push(`scientist/`+item.id)}>{item.name}</Link>
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
        page={reqPageInfo?.page ?? 1}
        size={reqPageInfo?.size ?? pageSizeOptions[0]}
        onClick={(value: number) => {
          setReqPageInfo((prev) => ({
            ...prev,
            page: value,
          }));
        }}
      />
    </section>
  )
}

export default Page;

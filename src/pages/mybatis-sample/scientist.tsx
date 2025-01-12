import { useState, useEffect } from "react";

import { Layout } from 'components/layout/Layout';
import { StyTable, StyTdRow, StyThRow, Td, Th } from 'styles/TableStyled';
import Pagination from 'components/page/Pagination';

import {
  ReqPageInfo,
  ResPageInfo,
} from 'types/CommonType';

import {
  ReqScientists,
  ResScientists,
} from 'types/SampleType';

import SampleService from 'services/SampleService';

const Page = () => {
  const pageSizeOptions = [3, 10, 20, 100];
  const [ reqPageInfo, setReqPageInfo ] = useState<ReqPageInfo>({ page: 1, size: pageSizeOptions[0]});
  const [ resPageInfo, setResPageInfo ] = useState<ResPageInfo>();
  const [ data, setData ] = useState<ResScientists[]>([]);
  const [ name, setName ] = useState<string>('');
  const [searchParams, setSearchParams] = useState<ReqScientists>({
    name: ''
  });

  const defaultParams = {
    name: ''
  };

  const handleSearchParams = (name: string, _value: any) => {
    setSearchParams({ ...searchParams, [name]: _value });
    (name === 'page' || name === 'size') && srch(name, _value);
  };

  const srch = (_name: string = '', _value: any = null) => {
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
    srch();
  }, [reqPageInfo.page, reqPageInfo.size]);
  
  return (
    <Layout>
      <>
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
                  <StyTdRow>
                    <Td sort={'center'}>
                      {resPageInfo.total - reqPageInfo.size * (reqPageInfo.page -1) - index}
                    </Td>
                    <Td>
                      {item.name}
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
        <Pagination
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
      </>
    </Layout>
  )
}

export default Page;

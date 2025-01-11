import { useState, useEffect } from "react";

import { Layout } from 'components/layout/Layout';
import { Grid, TextField, Button } from '@mui/material';
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

import {
  ReqPageInfo,
  ResPageInfo,
} from 'types/CommonType';

import {
  reqScientists,
  resScientists,
} from 'types/SampleType';

import SampleService from 'services/SampleService';

const Page = () => {
  const pageSizeOptions = [5, 10, 20, 100];
  const [ reqPageInfo, setReqPageInfo ] = useState<ReqPageInfo>({ page: 0, size: pageSizeOptions[0]});
  const [ resPageInfo, setResPageInfo ] = useState<ResPageInfo>();
  const [ data, setData ] = useState<resScientists[]>([]);
  const [ name, setName ] = useState<string>('');
  const [searchParams, setSearchParams] = useState<reqScientists>({
    name: ''
  });

  const defaultParams = {
    name: ''
  };

  const srch = () => {
    const params: reqScientists = {
      ...searchParams,
      name: name,
      page: reqPageInfo.page,
      size: reqPageInfo.size
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
      <></>
    </Layout>
  )
}

export default Page;

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
  const [ reqPageInfo, setReqPageInfo ] = useState<ReqPageInfo>({ page: 1, size: pageSizeOptions[0]});
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
      <div>
        <Grid container spacing={1} justifyContent='flex-end'>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth 
              value={name}
              onKeyDown={(e) => { if (e.key === 'Enter') srch(); } }
              onChange={(e) => setName(e.target.value) }
              label="scientist" helperText="Scientist Name" type="search" size='small' />
          </Grid>
          <Grid item xs={12} sm={1.5} style={{textAlign: 'right'}}>
            <Button onClick={(e) => srch()} variant="contained">search</Button>
          </Grid>
        </Grid>
        <Grid container marginTop={2}>
          <Grid item xs={12}>
            <DataGrid
              columns={[
                {field: 'id', headerName: 'id', headerAlign: 'left'},
                {field: 'name', headerName: 'name', headerAlign: 'center', align: 'left', width: 300}
              ]}
              rows={data}
              rowCount={resPageInfo?.total || 0}
              paginationMode='server'
              onPaginationModelChange={(paginationModel) => {
                setReqPageInfo((prev) => ({
                  ...prev,
                  page: paginationModel.page,
                  size: paginationModel.pageSize,
                }));
              }}
              paginationModel={{
                page: reqPageInfo.page,
                pageSize: reqPageInfo.size,
              }}
              disableRowSelectionOnClick
              pageSizeOptions={pageSizeOptions}
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default Page;

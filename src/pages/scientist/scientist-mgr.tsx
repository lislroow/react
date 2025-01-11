import { useState, useEffect } from "react";

import { Layout } from 'components/layout/Layout';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import {
  PageInfo,
} from 'types/CommonType';

import {
  reqScientists,
  resScientists,
} from 'types/SampleType';

import SampleService from 'services/SampleService';

const Page = () => {
  const [ pageInfo, setPageInfo ] = useState<PageInfo>();
  const [ data, setData ] = useState<resScientists[]>([]);
  const [ name, setName ] = useState<string>('');
  const [searchParams, setSearchParams] = useState<reqScientists>({
    name: '',
    page: 1,
    size: 10
  });

  const defaultParams = {
    name: '',
    page: 1,
    size: 10
  };

  const srch = () => {
    const params: reqScientists = {
      ...searchParams,
      name: name
    };
    SampleService.getScientistsSearch(params)
      .then((response) => {
        setPageInfo(response.data.pageInfo);
        setData(response.data.pageData);
      });
  };

  useEffect(() => {
    setSearchParams({ ...defaultParams });
    srch();
  }, []);
  
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
              rowCount={pageInfo?.total}
              paginationMode='client'
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20, 100]}
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default Page;

import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout } from 'components/layout/Layout';

import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import { asyncGET, asyncPOST } from 'utils/http';
import { Container } from "@mui/material";

import {
  reqPagedScientists,
  resPagedScientists,
} from 'types/SampleType';
import SampleService from 'services/SampleService';

type TypeScientist = {
  "id": number,
  "name": string,
}

const Page = () => {
  const [ rows, setRows ] = useState<TypeScientist[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  const [ srchName, setName ] = useState<string>('');
  const [searchParams, setSearchParams] = useState<reqPagedScientists>({
    name: '',
    page: 1,
    size: 10
  });

  const defaultParams = {
    name: '',
    page: 1,
    size: 10
  };
  
  const handleSearchParams = (name: string, _value: any) => {
    setSearchParams({ ...searchParams, [name]: _value });
  };

  const srch = () => {
    const params: reqPagedScientists = {
      ...searchParams,
      name: srchName
    };
    SampleService.getScientistsSearch(params)
      .then((response) => {
        setRows(response.data.pageData);
      });
  };
  useEffect(() => {
    setSearchParams({ ...defaultParams });
  }, []);
  
  return (
    <Layout>
      <div>
        <Grid container spacing={1} justifyContent='flex-end'>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth 
              value={srchName}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') srch();
                }
              }
              onChange={(e) => {
                  setName(e.target.value);
                }
              }
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
              rows={rows}
              rowCount={rows.length}
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

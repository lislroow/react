import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout } from 'components/layout/Layout';

import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import { asyncGET, asyncPOST } from 'utils/http';
import { TypeCustomer, ColCustomer } from "types/TypeCustomer";

const P01_5 = () => {
  const [ rows, setRows ] = useState<TypeCustomer[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  const [ srchName, setSrchName ] = useState<string>('');

  const srch = () => {
    if (srchName !== null) {
      searchParam.set('email', srchName || '');
    }
    asyncGET('/api/admin/sample/customer/all', callback, searchParam);
  };

  const srchPOST = () => {
    const data: TypeCustomer = {
      email: srchName
    };
    asyncPOST('/api/admin/sample/customer/all', callback, data);
  };
  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => 
        json.map((row: TypeCustomer, idx: number) => ({
          ...row, id: idx
        }))
      )
      .then(json => setRows(json));
  };
  useEffect(() => {
    // asyncGET('/api/admin/sample/customer/all', searchParam, callback);
  }, []);

  return (
    <Layout>
      <div>
        <Grid container alignItems='center' justifyContent='flex-end'>
          <Grid item marginRight={2}>
            <TextField value={srchName} onKeyDown={(e) => { if (e.key === 'Enter') {srchPOST();}}} onChange={(e) => { setSrchName(e.target.value); } } label="email" type="search" variant="outlined" size='small' />
          </Grid>
          <Grid item>
            <Button onClick={(e) => srchPOST()} variant="contained">search</Button>
          </Grid>
        </Grid>
        <Grid container marginTop={2}>
          <Grid item xs={12}>
            <DataGrid
              columns={ColCustomer}
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
              rowHeight={40}
              columnHeaderHeight={50}
              pageSizeOptions={[5, 10, 20, 100]}
              autoHeight={true}
              density='compact'
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default P01_5;
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout } from 'components/layout/Layout';

import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import { asyncGET } from 'utils/http';
import { TypeUserMng, ColUserMng } from "types/TypeUserMng";

const A01 = () => {
  const [ rows, setRows ] = useState<TypeUserMng[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  const [ srchUid, setSrchUid ] = useState<string>('');
  const [ srchEmail, setSrchEmail ] = useState<string>('');
  const [ srchNickname, setSrchNickname ] = useState<string>('');

  const srch = () => {
    if (srchUid !== null) {
      searchParam.set('uid', srchUid || '');
    }
    if (srchEmail !== null) {
      searchParam.set('email', srchEmail || '');
    }
    if (srchNickname !== null) {
      searchParam.set('nickname', srchNickname || '');
    }
    asyncGET('/api/admin/user/usermng/all', callback, searchParam);
  };
  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => 
        json.map((row: TypeUserMng, idx: number) => ({
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
            <TextField value={srchUid} onKeyDown={(e) => { if (e.key === 'Enter') {srch();}}} onChange={(e) => { setSrchUid(e.target.value); } } label="uid" type="search" variant="outlined" size='small' />
          </Grid>
          <Grid item marginRight={2}>
            <TextField value={srchEmail} onKeyDown={(e) => { if (e.key === 'Enter') {srch();}}} onChange={(e) => { setSrchEmail(e.target.value); } } label="email" type="search" variant="outlined" size='small' />
          </Grid>
          <Grid item marginRight={2}>
            <TextField value={srchNickname} onKeyDown={(e) => { if (e.key === 'Enter') {srch();}}} onChange={(e) => { setSrchNickname(e.target.value); } } label="nickname" type="search" variant="outlined" size='small' />
          </Grid>
          <Grid item>
            <Button onClick={(e) => srch()} variant="contained">search</Button>
          </Grid>
        </Grid>
        <Grid container marginTop={2}>
          <Grid item xs={12}>
            <DataGrid
              columns={ColUserMng}
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

export default A01;
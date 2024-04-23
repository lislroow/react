import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout } from 'components/layout/Layout';

import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import { asyncGET, asyncPOST } from 'utils/http';
import { TypeUserSessionState, ColUserSessionState } from "types/api-admin/TypeUserSessionState";

const P01_6 = () => {
  const [ rows, setRows ] = useState<TypeUserSessionState[]>([]);

  const srch = () => {
    asyncGET('/api/admin/user/session/all', callback, undefined);
  };

  const callback = (res?: Response) => {
    if (!res?.ok) {
      return;
    }
    res?.json()
      .then(json => 
        json?.map && json?.map((row: TypeUserSessionState, idx: number) => ({
          ...row, id: idx
        }))
      )
      .then(json => json && setRows(json));
  };
  useEffect(() => {
    // asyncGET('/api/admin/user/session/all', callback, undefined);
  }, []);

  return (
    <Layout>
      <div>
        <Grid container alignItems='center' justifyContent='flex-end'>
          <Grid item>
            <Button onClick={(e) => srch()} variant="contained">search</Button>
          </Grid>
        </Grid>
        <Grid container marginTop={2}>
          <Grid item xs={12}>
            <DataGrid
              columns={ColUserSessionState}
              rows={rows}
              rowCount={rows.length}
              paginationMode='client'
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 100,
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

export default P01_6;
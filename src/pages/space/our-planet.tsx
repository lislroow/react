import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout } from 'components/layout/Layout';

import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import { asyncGET } from 'utils/http';
import { TypePlanet, ColPlanet } from "types/TypePlanet";
import { Container } from "@mui/material";

const Page = () => {
  const [ rows, setRows ] = useState<TypePlanet[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  const [ srchPlanetName, setPlanetName ] = useState<string>('');

  const srch = () => {
    srchPlanetName && searchParam.set('planetName', srchPlanetName);
    asyncGET('/api/admin/sample/planet/list', callback, searchParam);
  };
  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => 
        json.map((row: TypePlanet, idx: number) => ({
          ...row, id: idx
        }))
      )
      .then(json => setRows(json));
  };
  useEffect(() => {
    asyncGET('/api/admin/sample/planet/list', callback);
  }, []);
  
  return (
    <Layout>
      <div>
        <Grid container spacing={1} justifyContent='flex-end'>
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField fullWidth value={srchPlanetName}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') srch();
                }
              }
              onChange={(e) => {
                  setPlanetName(e.target.value);
                }
              }
              label="planet" helperText="Planet Name" type="search" size='small' />
          </Grid>
          <Grid item xs={12} style={{textAlign: 'right'}}>
            <Button onClick={(e) => srch()} variant="contained">search</Button>
          </Grid>
        </Grid>
        <Grid container marginTop={2}>
          <Grid item xs={12}>
            <DataGrid
              columns={ColPlanet}
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
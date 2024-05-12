import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout } from 'components/layout/Layout';

import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import { asyncGET, asyncPOST } from 'utils/http';
//import { TypePlanet, ColPlanet } from "types/TypePlanet";
import { Container } from "@mui/material";

type TypePlanet = {
  "id": number,
  "name": string,
  "seq": number,
  "radius": string,
  "distance": string,
  "density": string,
  "gravity": string,
  "satelliteYn": string,
}

const Page = () => {
  const [ rows, setRows ] = useState<TypePlanet[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  const [ srchPlanetName, setPlanetName ] = useState<string>('');

  const srch = () => {
    srchPlanetName && searchParam.set('planetName', srchPlanetName);
    asyncGET('/api/admin/sample/planet/all', callback, searchParam);
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
    asyncGET('/api/admin/sample/planet/all', callback);
  }, []);
  
  return (
    <Layout>
      <div>
        <Grid container spacing={1} justifyContent='flex-end'>
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={1.5} style={{textAlign: 'right'}}>
            <Button onClick={(e) => srch()} variant="contained">search</Button>
          </Grid>
        </Grid>
        <Grid container marginTop={2}>
          <Grid item xs={12}>
            <DataGrid
              //columns={ColPlanet}
              columns={[
                {field: 'name', headerName: 'Planet Name', headerAlign: 'left'},
                {field: 'radius', headerName: 'radius', headerAlign: 'right', align: 'right'},
                {field: 'distance', headerName: 'distance', headerAlign: 'right', align: 'right', description: 'Distance From Sun(AU)'},
                {field: 'density', headerName: 'density', headerAlign: 'right', align: 'right'},
                {field: 'gravity', headerName: 'gravity', headerAlign: 'right', align: 'right'},
                {field: 'satelliteYn', headerName: 'satellite', headerAlign: 'center', align: 'center'},
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
              // sx={{
              //   '.MuiDataGrid-columnSeparator': {
              //     display: 'none',
              //   },
              //   '&.MuiDataGrid-root': {
              //     border: 'none',
              //   },
              //   "& .MuiDataGrid-sortIcon": {
              //     opacity: 'inherit !important',
              //   },
              //   "& .MuiDataGrid-cell:focus-within": {
              //     outline: 'none !important'
              //   },
              // }}
              pageSizeOptions={[5, 10, 20, 100]}
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  )
}

export default Page;
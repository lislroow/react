import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Layout } from 'components/layout/Layout';

import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Grid from '@mui/material/Grid';

import { asyncGET } from 'utils/http';
import { TypeProgram, TypeProgramFlat, ColProgram } from "types/TypeProgram";
import { Container } from "@mui/material";

const A01 = () => {
  const [ rows, setRows ] = useState<TypeProgramFlat[]>([]);
  const [ searchParam, setSearchParam ] = useSearchParams();
  const [ srchProgramName, setProgramName ] = useState<string>('');
  const [ srchPlanetName, setPlanetName ] = useState<string>('');

  const srch = () => {
    if (srchProgramName !== null) {
      searchParam.set('programName', srchProgramName || '');
    }
    if (srchPlanetName !== null) {
      searchParam.set('planetName', srchPlanetName || '');
    }
    asyncGET('/api/admin/sample/planet/program/all', callback);
  };
const flattenData = (data: TypeProgram[]) => {
    let flattenedData: TypeProgramFlat[] = [];
    data.forEach((program) => {
      program.planets.forEach((planet) => {
        flattenedData.push({
          id: program.id,
          name: program.name,
          startDt: program.startDt,
          endDt: program.endDt,
          probeName: program.probeName,
          planetName: planet.name,
          planetId: planet.id,
          seq: planet.seq,
          radius: planet.radius,
          distance: planet.distance,
          density: planet.density,
          gravity: planet.gravity,
          satelliteYn: planet.satelliteYn,
        });
      });
    });
    return flattenedData;
  };
  const callback = (res?: Response) => {
    if (res === undefined || !res.ok) {
      return;
    }
    res.json()
      .then(json => 
        json.map((row: TypeProgram, idx: number) => ({
          ...row, id: idx
        }))
      )
      .then(json => flattenData(json))
      .then(json => setRows(json));
  };
  useEffect(() => {
    asyncGET('/api/admin/sample/planet/program/all', callback);
  }, []);
  
  return (
    <Layout>
      <div>
        <Grid container spacing={1} justifyContent='flex-end'>
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField fullWidth value={srchProgramName} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {srch();}
                }
              }
              onChange={(e) => {
                setProgramName(e.target.value);
                }
              }
              label="program" helperText="NASA Program Name" type="search" size='small' />
          </Grid>
          <Grid item xs={12} sm={4} md={3} lg={2}>
            <TextField fullWidth value={srchPlanetName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {srch();}
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
              columns={ColProgram}
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

export default A01;
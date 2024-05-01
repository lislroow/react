import { GridColDef } from '@mui/x-data-grid';

export type TypePlanet = {
  "id": number,
  "name": string,
  "seq": number,
  "radius": string,
  "distance": string,
  "density": string,
  "gravity": string,
  "satelliteYn": string,
}

export const ColPlanet: GridColDef[] = [
  {field: 'name', headerName: 'Planet Name', width: 200, headerAlign: 'left'},
  {field: 'radius', headerName: 'radius', width: 100, headerAlign: 'right', align: 'right'},
  {field: 'distance', headerName: 'distance', width: 80, headerAlign: 'right', align: 'right', description: 'Distance From Sun(AU)'},
  {field: 'density', headerName: 'density', width: 80, headerAlign: 'right', align: 'right'},
  {field: 'gravity', headerName: 'gravity', width: 80, headerAlign: 'right', align: 'right'},
  {field: 'satelliteYn', headerName: 'satellite', width: 80, headerAlign: 'center', align: 'center'},
]
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
  {field: 'name', headerName: 'Planet Name', headerAlign: 'left'},
  {field: 'radius', headerName: 'radius', headerAlign: 'right', align: 'right'},
  {field: 'distance', headerName: 'distance', headerAlign: 'right', align: 'right', description: 'Distance From Sun(AU)'},
  {field: 'density', headerName: 'density', headerAlign: 'right', align: 'right'},
  {field: 'gravity', headerName: 'gravity', headerAlign: 'right', align: 'right'},
  {field: 'satelliteYn', headerName: 'satellite', headerAlign: 'center', align: 'center'},
]
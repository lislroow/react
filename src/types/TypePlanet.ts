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
  {field: 'name', headerName: 'Planet Name', flex: 0.5, headerAlign: 'left'},
  {field: 'radius', headerName: 'radius', flex: 0.4, headerAlign: 'right', align: 'right'},
  {field: 'distance', headerName: 'distance', flex: 0.4, headerAlign: 'right', align: 'right', description: 'Distance From Sun(AU)'},
  {field: 'density', headerName: 'density', flex: 0.4, headerAlign: 'right', align: 'right'},
  {field: 'gravity', headerName: 'gravity', flex: 0.4, headerAlign: 'right', align: 'right'},
  {field: 'satelliteYn', headerName: 'satellite', flex: 0.4, headerAlign: 'center', align: 'center'},
]
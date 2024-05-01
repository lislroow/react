import { GridColDef } from '@mui/x-data-grid';

export type TypeProgram = {
  "id": number,
  "name": string,
  "startDt": string,
  "endDt": string,
  "probeName": string,
  "planet": {
    "id": number,
    "name": string,
    "seq": number,
    "radius": number,
    "distance": number,
    "density": number,
    "gravity": number,
    "satelliteYn": string
  }
}

export type TypeProgramFlat = {
  "id": number,
  "name": string,
  "startDt": string,
  "endDt": string,
  "probeName": string,
  "planetId": number,
  "planetName": string,
  "seq": number,
  "radius": number,
  "distance": number,
  "density": number,
  "gravity": number,
  "satelliteYn": string
}

export const ColProgram: GridColDef[] = [
  {field: 'name', headerName: 'Program Name', width: 200, headerAlign: 'center', description: 'NASA Program Name'},
  {field: 'probeName', headerName: 'Probe Name', width: 200, headerAlign: 'center', description: 'NASA Program Name'},
  {field: 'startDt', headerName: 'Start Date', width: 100, headerAlign: 'center', align: 'center', description: 'Exploration Start Date'},
  {field: 'endDt', headerName: 'End Date', width: 100, headerAlign: 'center', align: 'center', description: 'Exploration End Date'},
  {field: 'planetName', headerName: 'Planet', width: 120, headerAlign: 'center', align: 'center', description: 'Planet Name'},
  {field: 'distance', headerName: 'Distance From', width: 120, headerAlign: 'center', align: 'right', description: 'Distance From Sun(AU)'},
]
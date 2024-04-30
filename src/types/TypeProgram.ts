import { GridColDef } from '@mui/x-data-grid';

export type TypeProgram = {
  "id": number,
  "name": string,
  "startDt": string,
  "endDt": string,
  "planets": [
    {
      "id": number,
      "name": string,
      "seq": number,
      "radius": number,
      "distance": number,
      "density": number,
      "gravity": number,
      "satelliteYn": string
    }
  ]
}

export type TypeProgramFlat = {
  "id": number,
  "name": string,
  "startDt": string,
  "endDt": string,
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
  {field: 'id'},
  {field: 'name'},
  {field: 'startDt'},
  {field: 'endDt'},
  {field: 'planetId'},
  {field: 'planetName'},
  {field: 'seq'},
  {field: 'radius'},
  {field: 'distance'},
  {field: 'density'},
  {field: 'gravity'},
  {field: 'satelliteYn'},
]
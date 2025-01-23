// satellite
export interface PlanetSearchReq {
  name?: string;
  page?: number;
  size?: number;
}
export interface PlanetSearchRes {
  id: number;
  name: string;
  radius: number;
  mass: number;
  distanceFromSun: string;
  orbitalEccentricity: number;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}
export interface PlanetAddReq {
  name: string;
  radius: number;
  mass: number;
  distanceFromSun: string;
  orbitalEccentricity: number;
}
export interface PlanetModifyReq extends PlanetAddReq {
  id: number;
}



// satellite
export interface SatelliteSearchReq {
  name?: string;
  page?: number;
  size?: number;
}
export interface SatelliteSearchRes {
  id: number;
  name: string;
  radius: number;
  mass: number;
  planetName: string;
  distanceFromPlanet: number;
  orbitalEccentricity: number;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}
export interface SatelliteAddReq {
  name: string;
  radius: number;
  mass: number;
  planetName: string;
  distanceFromPlanet: number;
  orbitalEccentricity: number;
}
export interface SatelliteModifyReq extends SatelliteAddReq {
  id: number;
}



// star
export interface StarSearchReq {
  name?: string;
  page?: number;
  size?: number;
}
export interface StarSearchRes {
  id: number;
  name: string;
  distance: number;
  brightness: number;
  mass: number;
  temperature: number;
  createId: string;
  createTime: string;
  createName: string;
  modifyId: string;
  modifyTime: string;
  modifyName: string;
}
export interface StarAddReq {
  name: string;
  distance: number;
  brightness: number;
  mass: number;
  temperature: number;
}
export interface StarModifyReq extends StarAddReq {
  id: number;
}

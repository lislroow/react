import { http } from '@/components/http';
import {
  SatelliteSearchReq,
  SatelliteAddReq,
  SatelliteModifyReq,
  StarSearchReq,
  StarAddReq,
  StarModifyReq,
} from '@/types/JpaSampleType';

// satellite
const getSatellitesSearch = (data: SatelliteSearchReq) => {
  return http.get('/story-api/v1/jpa-sample/satellites/search', {params: data});
}

const getSatellite = (id: any) => {
  return http.get(`/story-api/v1/jpa-sample/satellite/${id}`);
}

const postSatellite = (data: SatelliteAddReq) => {
  return http.post('/story-api/v1/jpa-sample/satellite', data);
}

const deleteSatellite = (id: any) => {
  return http.delete(`/story-api/v1/jpa-sample/satellite/${id}`);
}

const putSatellite = (data: SatelliteModifyReq) => {
  return http.put('/story-api/v1/jpa-sample/satellite', data);
}


// star
const getStarsSearch = (data: StarSearchReq) => {
  return http.get('/story-api/v1/jpa-sample/stars/search', {params: data});
}

const getStar = (id: any) => {
  return http.get(`/story-api/v1/jpa-sample/star/${id}`);
}

const postStar = (data: StarAddReq) => {
  return http.post('/story-api/v1/jpa-sample/star', data);
}

const deleteStar = (id: any) => {
  return http.delete(`/story-api/v1/jpa-sample/star/${id}`);
}

const putStar = (data: StarModifyReq) => {
  return http.put('/story-api/v1/jpa-sample/star', data);
}


const SampleService = {
  getSatellitesSearch,
  getSatellite,
  postSatellite,
  deleteSatellite,
  putSatellite,

  getStarsSearch,
  getStar,
  postStar,
  deleteStar,
  putStar,
};

export default SampleService;

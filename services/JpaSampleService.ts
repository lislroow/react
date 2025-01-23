import { http } from '@/components/http';
import {
  StarSearchReq,
  StarAddReq,
  StarModifyReq,
} from '@/types/JpaSampleType';

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
  getStarsSearch,
  getStar,
  postStar,
  deleteStar,
  putStar,
};

export default SampleService;

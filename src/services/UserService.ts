import { http } from 'utils/http';

import {
  resMemberInfo,
} from 'types/UserTypes';

const getMemberInfo = () => {
  return http.get('/auth-api/v1/user/member/info', {});
}

const UserService = {
  getMemberInfo,
};

export default UserService;

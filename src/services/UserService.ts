import { http } from 'utils/http';

const getMemberInfo = () => {
  return http.get('/auth-api/v1/user/member/info', {});
}

const UserService = {
  getMemberInfo,
};

export default UserService;

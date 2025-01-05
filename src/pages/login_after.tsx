import { useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { asyncPOST } from 'utils/http';

const LoginAfter = () => {
  const [searchParams] = useSearchParams();
  // const rtkUuid = searchParams.get('rtkUuid');
  const [cookies] = useCookies();
  const rtkUuid = cookies['X-RTKID'];
  
  const refreshToken = (reqDto: { rtkUuid: string }) => {
    const callback = (res?: Response) => {
      if (res === undefined || !res.ok) {
        return;
      }
      res.json()
        .then(json => {
          localStorage.setItem('rtkUuid', json.body.rtkUuid);
          localStorage.setItem('atkUuid', json.body.atkUuid);
          window.location.replace('/');
        });
    };
    asyncPOST('/auth-api/v1/token/refresh', callback, reqDto);
  };
  
  if (rtkUuid) {
    refreshToken({
      "rtkUuid" : rtkUuid
    });
  }

  return (
    <div>
    </div>
  );
};

export default LoginAfter;

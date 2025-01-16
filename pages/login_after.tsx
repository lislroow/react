import { useEffect } from 'react';
import { useRouter } from 'next/router';

import storeUser, { actUpdate } from '@/components/redux-store/store-user';

import { refreshToken } from '@/components/http';
import UserService from '@/services/UserService';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split('; ')
      .reduce<Record<string, string>>((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      }, {});
    
    if (cookies['X-RTKID']) {
      localStorage.setItem('X-RTKID', cookies['X-RTKID']);
      const usrid = cookies['X-USRID'];
      refreshToken().then(() => 
        UserService.getUserInfo(usrid).then((reponse) => {
          storeUser.dispatch(actUpdate(reponse.data));
          router.push('/');
        })
      );
    } else {
      console.log('X-RTKID is null');
    }
  }, []);

  return (
    <>
    </>
  );
};

export default Page;

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import storeUser, { actUpdate } from '@/components/redux-store/store-user';

import { refreshToken } from '@/components/http';
import UserService from '@/services/UserService';
import storage from '@/components/storage';

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
      storage.setX_RTKID(cookies['X-RTKID']);
      refreshToken().then(() => 
        UserService.getInfo().then((reponse) => {
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

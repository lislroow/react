import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { refreshToken } from '@/lib/http';
import UserService from '../services/UserService';
import storeUser, { actUpdate } from '@/components/redux-store/store-user';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie
    .split('; ')
    .reduce<Record<string, string>>((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});
    
    if (cookies['X-RTKID']) {
      localStorage.setItem('X-RTKID', cookies['X-RTKID']);
      refreshToken().then(() => 
        UserService.getUserInfo().then((reponse) => {
          storeUser.dispatch(actUpdate(reponse.data));
          router.push('/');
        })
      );
    } else {
      console.log('X-RTKID is null');
    }
  });

  return (
    <div>
    </div>
  );
};

export default Page;
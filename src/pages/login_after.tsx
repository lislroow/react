import { refreshToken } from 'lib/http';
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();

  const cookies = document.cookie
    .split('; ')
    .reduce<Record<string, string>>((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});

  const rtkUuid = cookies['X-RTKID'];

  if (rtkUuid) {
    localStorage.setItem('X-RTKID', rtkUuid);
    refreshToken()
      .then(() => router.push('/'));
  } else {
    console.log('X-RTKID is null');
  }

  return (
    <div>
    </div>
  );
};

export default Page;

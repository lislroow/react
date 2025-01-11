import { refreshAccessToken } from 'utils/http';

const LoginAfter = () => {
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
    refreshAccessToken()
      .then(() => window.location.replace('/'));
  } else {
    console.log('X-RTKID is null');
  }

  return (
    <div>
    </div>
  );
};

export default LoginAfter;

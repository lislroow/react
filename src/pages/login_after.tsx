const LoginAfter = () => {
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
    const fetchData = async() => {
      const api = '/auth-api/v1/token/refresh';
      const body = JSON.stringify(reqDto);
      const res = await fetch(api, {
        method: 'post',
        headers: {
          "Content-Type":"application/json; charset=utf-8"
        },
        body: body
      });
      return res;
    };
    fetchData()
      .then(res => {
        const contentType = res.headers.get('Content-Type');
        if (res.ok) {
        } else {
          if (res.status === 403) {
          }
        }
        return res;
      })
      .then(res => callback(res))
      ;
  };
  const cookies = document.cookie
    .split('; ')
    .reduce<Record<string, string>>((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});
  const rtkUuid = cookies['X-RTKID'];
  console.log(rtkUuid);
  if (rtkUuid) {
    refreshToken({"rtkUuid":rtkUuid});
  } else {
    console.log('X-RTKID is null');
  }

  return (
    <div>
    </div>
  );
};

export default LoginAfter;

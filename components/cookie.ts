const getCookie = (name: string): string => {
  const cookies = document.cookie
    .split('; ')
    .reduce<Record<string, string>>((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});
  return cookies[name];
};

const cookie = {
  getCookie
};

export default cookie;


export const setLastAccess = () => {
  localStorage.setItem('lastAccess', Date.now()+'');
};

export const getLastAccess = (): number => {
  const lastAccessStr = localStorage.getItem('lastAccess');
  const lastAccess = lastAccessStr === null ? -1 : parseInt(lastAccessStr);
  return lastAccess;
}
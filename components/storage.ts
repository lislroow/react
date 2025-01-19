import {
  AllCodeRes
} from "@/types/CodeType";

const hasCodes = (): boolean => {
  return localStorage.getItem('code') ? true : false;
}
const setCodes = (data?: AllCodeRes[]) => {
  localStorage.setItem('code', JSON.stringify(data));
}
const getCodes = (): AllCodeRes[] => {
  return JSON.parse(localStorage.getItem('code'));
}

const storage = {
  hasCodes,
  setCodes,
  getCodes,
};

export default storage;

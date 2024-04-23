import { TypeMenu } from '../types/TypeMenu';

export const menuList: TypeMenu[] = JSON.parse(localStorage.getItem('menu') || '{}');

export const getPathnameByMenuId = function(mlist: TypeMenu[], itemId: string): string {
  for (let menu of mlist) {
    if (menu.itemId === itemId) {
      return menu.pathname || '';
    } else if (Object.keys(menu).includes('subNav') && Array.isArray(menu.subNav) ) {
      let result = getPathnameByMenuId(menu.subNav, itemId);
      if (result !== '') {
        return result;
      }
    }
  }
  return '';
}

export const getTitleByPathname = function(mlist: TypeMenu[], pathname: string): string {
  for (let menu of mlist) {
    if (menu.pathname === pathname) {
      return `[ ${menu.itemId} ] ${menu.title}`;
    } else if (Object.keys(menu).includes('subNav') && Array.isArray(menu.subNav) ) {
      let result = getTitleByPathname(menu.subNav, pathname);
      if (result !== '') {
        return `${menu.title} > ${result}`;
      }
    }
  }
  return '';
}

export const getMenuIdByPathname = function(mlist: TypeMenu[], pathname: string): string {
  for (let menu of mlist) {
    if (menu.pathname === pathname) {
      return menu.itemId;
    } else if (Object.keys(menu).includes('subNav') && Array.isArray(menu.subNav) ) {
      let result = getMenuIdByPathname(menu.subNav, pathname);
      if (result !== '') {
        return result;
      }
    }
  }
  return '';
} 
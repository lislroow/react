import { MenuInfo } from 'types/CommonType';
import menu from 'json/menu.json';

const getMenuList = (): MenuInfo[] => {
  let menuList = null;
  menuList = localStorage.getItem('menu');
  if (!menuList) {
    menuList = JSON.stringify(menu);
    localStorage.setItem('menu', JSON.stringify(menu));
  }
  return JSON.parse(menuList);
}

const getPathnameByMenuId = function(mlist1: MenuInfo[], itemId: string): string {
  for (let menu of mlist1) {
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

const getTitleByPathname = function(mlist2: MenuInfo[], pathname: string): string {
  if (!Array.isArray(mlist2)) {
    return '';
  }
  for (let menu of mlist2) {
    if (menu.pathname === pathname) {
      return `${menu.title}`;
    } else if (Object.keys(menu).includes('subNav') && Array.isArray(menu.subNav) ) {
      let result = getTitleByPathname(menu.subNav, pathname);
      if (result !== '') {
        return `${menu.title} > ${result}`;
      }
    }
  }
  return '';
}

const getMenuIdByPathname = function(mlist3: MenuInfo[], pathname: string): string {
  for (let menu of mlist3) {
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

const MenuService = {
  getMenuList,
  getPathnameByMenuId,
  getTitleByPathname,
  getMenuIdByPathname,
};

export default MenuService;

import { MenuInfo } from 'types/CommonType';

const getMenuList = (): MenuInfo[] => {
  return JSON.parse(localStorage.getItem('menu') || '{}');
}

const getPathnameByMenuId = function(mlist: MenuInfo[], itemId: string): string {
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

const getTitleByPathname = function(mlist: MenuInfo[], pathname: string): string {
  for (let menu of mlist) {
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

const getMenuIdByPathname = function(mlist: MenuInfo[], pathname: string): string {
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

const MenuService = {
  getMenuList,
  getPathnameByMenuId,
  getTitleByPathname,
  getMenuIdByPathname,
};

export default MenuService;

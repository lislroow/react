import storage from '@/components/storage';
import menu from '@/json/menu.json';
import { MenuInfo } from '@/types/CommonType';

const initMenu = (): MenuInfo[] => {
  if (!storage.getMenu()) {
    storage.setMenu(menu);
    console.log('menu: ' + JSON.stringify(menu));
  }
  return storage.getMenu();
};

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
};

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
};

const MenuService = {
  initMenu,
  getPathnameByMenuId,
  getTitleByPathname,
  getMenuIdByPathname,
};

export default MenuService;

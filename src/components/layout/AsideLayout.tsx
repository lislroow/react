import { useState } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

import storeAside from 'redux-store/store-aside';

import { MenuInfo } from 'types/CommonType';
import MenuService from 'services/MenuService';

const AsideLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ isSidebarOpen, setSidebarOpen ] = useState(false);
  
  const subscribe = () => {
    setSidebarOpen(storeAside.getState().aside.display);
  }
  storeAside.subscribe(subscribe);

  const menuList: MenuInfo[] = MenuService.getMenuList();
  
  return (
    <aside style={{display: 'flex', overflowY: 'auto'}}>
      {/* Sidebar Overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
      />
      <div className={`fixed left-0 top-0 bottom-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
        isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"}`}
        >
        <div className="flex items-center justify-center text-center py-2">
          <Link to='/'> 
            <span className="mx-2 text-2xl font-semibold text-black">
              develop
            </span>
          </Link>
        </div>
        <Navigation
          activeItemId={MenuService.getMenuIdByPathname(menuList, location.pathname)}
          onSelect={( {itemId} ) => {
            let pathname = MenuService.getPathnameByMenuId(menuList, itemId);
            if (pathname !== '') {
              navigate(pathname, {replace: false});
            }
          }}
          items={menuList}
        />
      </div>
    </aside>
  )
};

export default AsideLayout;
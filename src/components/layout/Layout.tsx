import React from 'react';

import HeaderLayout from 'components/layout/HeaderLayout';
import AsideLayout from 'components/layout/AsideLayout';
import ContentLayout from 'components/layout/ContentLayout';
import MenuService from 'services/MenuService';
import { MenuInfo } from 'types/CommonType';

type LayoutProps = {
  children: JSX.Element,
  emptyLayout?: boolean
}

export const Layout: React.FC<LayoutProps> = (props) => {

  const menuList: MenuInfo[] = MenuService.getMenuList();

  return (
    <div>
      <main className='flex' style={{width: '100%', minHeight: '100vh', height: 'auto'}}>
        {
          props && props.emptyLayout 
            ? ''
            : <AsideLayout />
        }
        <section className='content' style={{ flex: 1 }}>
          {
            props && props.emptyLayout ? 
              '' : 
              <div style={{padding: '14px'}}>
                <header>
                  <div style={{width: '100%', minHeight: '5vh', zIndex: '100'}}>
                  {
                    props && props.emptyLayout 
                        ? ''
                        : <HeaderLayout />
                  }
                  </div>
                </header>
                {MenuService.getTitleByPathname(menuList, window.location.pathname)}
              </div>
          }
          <ContentLayout children={props.children} />
        </section>
        {/* <footer style={{display: 'none'}}>
          <FooterLayout />
        </footer> */}
      </main>
    </div>
  )
};
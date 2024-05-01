import React from 'react';

import { menuList, getTitleByPathname } from '../../utils/menu';

import HeaderLayout from './HeaderLayout';
import AsideLayout from './AsideLayout';
import ContentLayout from './ContentLayout';
import FooterLayout from './FooterLayout';

import storeAside, { actAsideShow } from 'redux-store/store-aside';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

type LayoutProps = {
  children: JSX.Element,
  emptyLayout?: boolean
}

export const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <div>
      <main className='flex' style={{width: '100%', height: '100vh'}}>
        {
          props && props.emptyLayout 
            ? ''
            : <AsideLayout />
        }
        <section className='content' style={{ flex: 1, overflowY: 'auto' }}>
          {
            window.location.pathname === '/' || props && props.emptyLayout ? 
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
                {getTitleByPathname(menuList, window.location.pathname)}
              </div>
          }
          <ContentLayout children={props.children} />
        </section>
        <footer style={{display: 'none'}}>
          <FooterLayout />
        </footer>
      </main>
    </div>
  )
};
import React from 'react';

import { menuList, getTitleByPathname } from '../../utils/menu';

import HeaderLayout from './HeaderLayout';
import AsideLayout from './AsideLayout';
import ContentLayout from './ContentLayout';
import FooterLayout from './FooterLayout';


type LayoutProps = {
  children: JSX.Element,
  emptyLayout?: boolean
}

export const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <div>
      <header>
        <div style={{background: 'lightgray', width: '100%', minHeight: '5vh', zIndex: '100', padding: '2px'}}>
        {
          props && props.emptyLayout 
              ? ''
              : <HeaderLayout />
        }
        </div>
      </header>
      <main className='flex' style={{width: '100%', height: '87vh'}}>
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
                ◻ {getTitleByPathname(menuList, window.location.pathname)}
              </div>
          }
          <ContentLayout children={props.children} />
        </section>
      </main>
      <footer>
        <FooterLayout />
      </footer>
    </div>
  )
};
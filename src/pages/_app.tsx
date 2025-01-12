import { Suspense, useEffect, useState } from 'react';
import { Navigation } from 'react-minimal-side-navigation';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Link from 'next/link';

import HeaderLayout from 'components/layout/HeaderLayout';
import storeAside from 'redux-store/store-aside';
import storeFooter from 'redux-store/store-footer';

import '@/styles/globals.css';
import menu from '@/json/menu.json';
import { MenuInfo } from '@/types/CommonType';
import MenuService from '@/services/MenuService';

const AppStructer = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const noLayoutUri = ['/login', '/register'];

  const [ menuList, setMenuList ] = useState<MenuInfo[]>();
  const [ pathname, setPathname ] = useState<string | null>(null);

  const [ isSidebarOpen, setSidebarOpen ] = useState(false);
  const [ footerMessage, setFooterMessage ] = useState(''); 

  const subscribe = () => {
    setSidebarOpen(storeAside.getState().aside.display);
  }
  storeAside.subscribe(subscribe);

  const subscribeFooter = () => {
    setFooterMessage(storeFooter.getState().footer.message);
  };
  storeFooter.subscribe(subscribeFooter);

  useEffect(() => {
    setMenuList(MenuService.getMenuList());
    setPathname(window.location.pathname);
  }, []);
  
  return (
    <div>
      <Suspense fallback={
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}>
          <div>Loading...</div>
        </div>
      }>
        <div>
          <main className='flex' style={{width: '100%', minHeight: '100vh', height: 'auto'}}>
            {!noLayoutUri.includes(router.pathname) && (
              <aside style={{display: 'flex', overflowY: 'auto'}}>
                <div
                  onClick={() => setSidebarOpen(false)}
                  className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                />
                <div className={`fixed left-0 top-0 bottom-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
                  isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"}`}
                  >
                  <div className="flex items-center justify-center text-center py-2">
                    <Link href='/'> 
                      <span className="mx-2 text-2xl font-semibold text-black">
                        develop
                      </span>
                    </Link>
                  </div>
                  {menuList ? (
                    <Navigation 
                      items={menuList.map((item) => ({
                        title: item.title,
                        itemId: item.itemId,
                        subNav: [],
                      }))}
                      onSelect={({ itemId }) => { router.push(itemId); } } activeItemId={''}>
                    </Navigation>
                  ) : (<div/>)}
                </div>
              </aside>
            )}
            <section className='content' style={{ flex: 1 }}>
              <div style={{padding: '14px'}}>
                <header>
                  <div style={{width: '100%', minHeight: '5vh', zIndex: '100'}}>
                    <HeaderLayout />
                  </div>
                </header>
                { MenuService.getTitleByPathname(menuList, pathname) }
              </div>
              <div className='flex-row' style={{ padding: '10px' }}>
                <Component {...pageProps} />
              </div>
            </section>
            <footer style={{display: 'none'}}>
              <div style={{
                backgroundColor: '#333',
                color: 'white',
                textAlign: 'left',
                padding: '5px 10px',
                position: 'fixed',
                bottom: '0',
                width: '100%',
                zIndex: '200',
                minHeight: '4vh'
                }}>
                {footerMessage}
              </div>
            </footer>
          </main>
        </div>
      </Suspense>
    </div>
  );
};

export default AppStructer;

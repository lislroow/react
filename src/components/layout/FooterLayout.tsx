import { useState } from 'react';

import storeFooter from 'redux-store/store-footer';

const FooterLayout = () => {
  const [ footerMessage, setFooterMessage ] = useState(''); 
  const subscribeFooter = () => {
    setFooterMessage(storeFooter.getState().footer.message);
  };
  storeFooter.subscribe(subscribeFooter);

  return (
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
  );
};

export default FooterLayout;
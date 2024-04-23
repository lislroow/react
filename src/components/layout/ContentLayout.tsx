import React from 'react';

type LayoutProps = {
  children: JSX.Element
}

const ContentLayout: React.FC<LayoutProps> = (props) => {

  return (
    <React.Fragment>
      <div className='flex-row' style={{ padding: '10px' }}>
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default ContentLayout;
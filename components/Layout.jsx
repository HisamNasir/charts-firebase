import React from 'react';
import Header from '../components/Header';

const Layout = (props) => {
  return (
    <div className=''>
      <Header />
      <div className='h-[calc(100vh-62px)]'>
      {props.children}

      </div>
    </div>
  );
};

export default Layout;
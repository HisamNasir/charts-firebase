import React from 'react';
import NavBar from './Navbar';

const Layout = (props) => {
  return (
    <div className=''>
      <NavBar/>
      <div className='mx-auto container'>
      <div className='h-[calc(100vh-62px)]  pt-[62px]'>
      {props.children}

      </div>

      </div>
    </div>
  );
};

export default Layout;
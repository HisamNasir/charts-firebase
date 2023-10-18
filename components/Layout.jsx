import React from 'react';
import NavBar from './Navbar';

const Layout = (props) => {
  return (
    <div className=''>
      <NavBar/>
      <div className='flex justify-center'>
      <div className='h-[calc(100vh-62px)]  max-w-7xl'>
      {props.children}

      </div>

      </div>
    </div>
  );
};

export default Layout;
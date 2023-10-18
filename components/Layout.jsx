import React from 'react';
import NavBar from './Navbar';

const Layout = (props) => {
  return (
    <div className=''>
      <NavBar/>
      <div className='h-[calc(100vh-62px)] mx-auto container'>
      {props.children}
      </div>
    </div>
  );
};

export default Layout;
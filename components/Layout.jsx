import React from 'react';
import NavBar from './Navbar';

const Layout = (props) => {
  return (
    <div className=''>
      {/* <Header /> */}
      <NavBar/>
      <div className='h-[calc(100vh-62px)]'>
      {props.children}

      </div>
    </div>
  );
};

export default Layout;
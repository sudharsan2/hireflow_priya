// Navbar.js
import React from 'react';
import './navbar.css';

const Navbar = () => {
    const imgurl1= process.env.PUBLIC_URL + './img/icon1.png';
  return (
    <div className="Navbar">
      <img src={imgurl1} alt="Logo" className="logo" />
      
    </div>
  );
};

export default Navbar;

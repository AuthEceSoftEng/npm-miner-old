import React from 'react';

import logo from './logo.svg';
import { Link } from 'react-router-dom';

import styles from './header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div>
        <Link to="/">
          <img src={logo} alt="" width="48" height="48" />
        </Link>
      </div>
      <div>
        <Link to="/">NPM-MINER</Link>
      </div>

      <div>
        <Link to="/playground">PLAYGROUND</Link>
      </div>
      <div>
        <Link to="/about">ABOUT</Link>
      </div>
    </header>
  );
};
export default Header;

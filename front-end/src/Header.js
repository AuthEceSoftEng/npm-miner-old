import React from 'react'
import { Link } from 'react-router-dom';
import './Header.css'

const Header = ({ siteTitle }) => (
    <header>
        <nav className="navbar is-black" aria-label="main navigation">
          <div className='container'>
            <div className="navbar-brand">
              <Link className="navbar-item" to="/">
                <img src='/logo_white_colour.png' height='110%' alt='npm-miner'/>
              </Link>
              <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
            </div>
            <div id="navbarExampleTransparentExample" className="navbar-menu">
              <div className="navbar-end">
                <Link className="navbar-item" to="/about">
                  About
                </Link>
                <a className="navbar-item" href="https://github.com/AuthEceSoftEng/npm-miner">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>
    </header>
)

export default Header

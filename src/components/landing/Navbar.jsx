import React from 'react';
import { Home, LayoutGrid } from 'lucide-react';
import customLogo from '../../assets/new_logo.png';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onEnterApp }) => {
  return (
    <nav className="nav-ditto responsive-navbar">
      
      {/* ── DESKTOP-ONLY LAYOUT ── */}
      <div className="nav-desktop-only nav-desktop-left">
        <Link to="/" className="nav-link-with-icon" style={{ color: '#fff' }}>
          <Home size={18} color="var(--seafoam)" />
          <span>HOME</span>
          <div className="nav-active-line"></div>
        </Link>
        <a href="#features" className="nav-link-with-icon">FEATURES</a>
      </div>

      <div className="nav-desktop-only nav-logo-container">
        <div className="nav-logo-bubble">
           <img src={customLogo} alt="Aqua Sync Logo" />
        </div>
      </div>

      <div className="nav-desktop-only nav-desktop-right">
        <a href="#contact" className="nav-link-with-icon">CONTACT US</a>
        <button 
          className="btn-premium" 
          onClick={onEnterApp}
        >
          <LayoutGrid size={18} /> {user ? 'DASHBOARD' : 'OPERATOR LOGIN'}
        </button>
      </div>

      {/* ── MOBILE-ONLY LAYOUT (No Hamburger Menu, links visible directly) ── */}
      <div className="nav-mobile-only nav-mobile-header-row">
        <div className="nav-logo-bubble-mobile">
           <img src={customLogo} alt="Aqua Sync Logo" />
        </div>
        <button 
          className="btn-premium" 
          onClick={onEnterApp}
          style={{ padding: '8px 16px', fontSize: '0.75rem', letterSpacing: '1px' }}
        >
          <LayoutGrid size={14} /> {user ? 'DASHBOARD' : 'OPERATOR LOGIN'}
        </button>
      </div>

      <div className="nav-mobile-only nav-mobile-links-row">
        <Link to="/" className="nav-link-with-icon" style={{ color: '#fff', fontSize: '0.8rem' }}>
          <Home size={14} color="var(--seafoam)" />
          <span>HOME</span>
        </Link>
        <a href="#features" className="nav-link-with-icon" style={{ fontSize: '0.8rem' }}>FEATURES</a>
        <a href="#contact" className="nav-link-with-icon" style={{ fontSize: '0.8rem' }}>CONTACT US</a>
      </div>

    </nav>
  );
};

export default Navbar;

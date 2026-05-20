import React from 'react';
import { Home, LayoutGrid } from 'lucide-react';
import customLogo from '../../assets/new_logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onEnterApp }) => {
  const navigate = useNavigate();

  return (
    <nav className="nav-ditto" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '120px' }}>
      
      {/* Left Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '60px', position: 'absolute', right: 'calc(50% + 120px)' }}>
        <Link to="/" className="nav-link-with-icon" style={{ color: '#fff' }}>
          <Home size={18} color="var(--seafoam)" />
          <span>HOME</span>
          <div className="nav-active-line"></div>
        </Link>
        
        <a href="#features" className="nav-link-with-icon">FEATURES</a>
      </div>

      {/* Center Logo */}
      <div className="nav-logo-bubble" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginTop: '30px' }}>
         <img src={customLogo} alt="Aqua Sync Logo" />
      </div>

      {/* Right Links & Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '60px', position: 'absolute', left: 'calc(50% + 120px)' }}>
        <a href="#contact" className="nav-link-with-icon">CONTACT US</a>
        
        <button 
          className="btn-premium" 
          onClick={onEnterApp}
        >
          <LayoutGrid size={18} /> {user ? 'DASHBOARD' : 'OPERATOR LOGIN'}
        </button>
      </div>

    </nav>
  );
};

export default Navbar;

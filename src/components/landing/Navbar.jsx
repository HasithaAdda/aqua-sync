import React from 'react';
import { Home, LayoutGrid } from 'lucide-react';
import customLogo from '../../assets/new_logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  return (
    <nav className="nav-ditto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <Link to="/" className="nav-link-with-icon" style={{ color: '#fff' }}>
        <Home size={18} color="var(--seafoam)" />
        <span>HOME</span>
        <div className="nav-active-line"></div>
      </Link>
      
      <a href="#features" className="nav-link-with-icon">FEATURES</a>
      
      <a href="#" className="nav-link-with-icon">SERVICES</a>

      <div className="nav-logo-bubble">
         <img src={customLogo} alt="Aqua Elite Logo" />
      </div>

      <a href="#" className="nav-link-with-icon">ALERTS</a>
      
      <a href="#" className="nav-link-with-icon">CONTACT US</a>
      
      <button 
        className="btn-premium" 
        onClick={() => navigate('/dashboard')}
      >
        <LayoutGrid size={18} /> {user ? 'DASHBOARD' : 'DASHBOARD'}
      </button>
    </nav>
  );
};

export default Navbar;

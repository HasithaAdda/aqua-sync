import React from 'react';
import { Globe, MessageCircle } from 'lucide-react';
import customLogo from '../../assets/new_logo.png';

const Footer = () => {
  return (
    <footer className="compact-footer" style={{ 
      backgroundColor: '#000c11', 
      padding: '60px 8% 40px', /* Reduced padding */
      borderTop: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(45,212,191,0.03), transparent 70%)',
        zIndex: 0
      }}></div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '40px', /* Reduced gap */
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Menu Side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '20px' }}>MENU</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Home</a>
              <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Services</a>
            </div>
          </div>
          <div style={{ marginTop: '42px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Projects</a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>News</a>
            </div>
          </div>
          <div style={{ marginTop: '0px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Reviews</a>
              <a href="#contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>Contact</a>
            </div>
          </div>
        </div>

        {/* Socials Side */}
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>FOLLOW US</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <div className="feature-card-icon-blob" style={{ width: '40px', height: '40px', cursor: 'pointer' }}>
               <Globe size={18} />
            </div>
            <div className="feature-card-icon-blob" style={{ width: '40px', height: '40px', cursor: 'pointer' }}>
               <MessageCircle size={18} />
            </div>
          </div>
        </div>

        {/* Logo Side */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
           <img 
             src={customLogo} 
             alt="Aqua Sync Logo" 
             className="footer-logo-small"
             style={{ 
               width: '180px', /* Reduced size */
               opacity: 0.8, 
               filter: 'drop-shadow(0 0 30px rgba(45,212,191,0.15))' 
             }} 
           />
        </div>

      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '40px auto 0', 
        paddingTop: '20px', 
        borderTop: '1px solid rgba(255,255,255,0.03)',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.15)',
        fontSize: '0.7rem',
        fontWeight: '700'
      }}>
        © 2026 AQUA SYNC. ALL RIGHTS RESERVED.
      </div>

    </footer>
  );
};

export default Footer;

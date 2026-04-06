import React from 'react';
import { Fish } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ padding: '80px 5% 40px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--ocean-dark)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '100px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ maxWidth: '400px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px' }}>
              <Fish color="var(--seafoam)" size={40} />
              <h2 style={{ fontSize: '1.8rem' }}>AQUA <span style={{ color: 'var(--seafoam)' }}>ELITE</span></h2>
           </div>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
             Providing state-of-the-art maritime intelligence and sustainable fishery management solutions worldwide.
           </p>
        </div>
        <div style={{ display: 'flex', gap: '120px' }}>
          <div>
            <h4 style={{ marginBottom: '35px', color: 'var(--seafoam)', fontSize: '0.9rem', letterSpacing: '1px' }}>SYSTEM</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
              <li>Dashboard</li>
              <li>GIS Map</li>
              <li>AI Insights</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '35px', color: 'var(--seafoam)', fontSize: '0.9rem', letterSpacing: '1px' }}>CONNECT</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.9rem' }}>
              <li>Linkedin</li>
              <li>Documentation</li>
              <li>API Portal</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         © 2026 AQUA ELITE. SMART MARITIME SYSTEMS.
      </div>
    </footer>
  );
};

export default Footer;

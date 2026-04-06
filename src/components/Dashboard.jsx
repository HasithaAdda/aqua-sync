import React from 'react';
import { 
  Activity, 
  Map as MapIcon, 
  ShieldAlert, 
  CloudSun, 
  ArrowLeft,
  BrainCircuit,
  Droplet,
  Globe,
  Waves,
  Zap,
  Settings,
  ListChecks,
  MessageSquare,
  Fish,
  Thermometer,
  TestTube
} from 'lucide-react';
import customLogo from '../assets/new_logo.png';
import MapDashboard from './MapDashboard';
import IncidentReporting from './IncidentReporting';
import WeatherDashboard from './WeatherDashboard';
import { useNavigate, NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';

const Dashboard = ({ user, stats }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard/map') return (
      <span style={{ letterSpacing: '2px' }}>GEOSPATIAL <span style={{ color: 'var(--seafoam)' }}>INTELLIGENCE</span></span>
    );
    if (path === '/dashboard/incidents') return (
      <span style={{ letterSpacing: '2px' }}>AI INCIDENT <span style={{ color: 'var(--seafoam)' }}>REPORTING</span></span>
    );
    if (path === '/dashboard/weather') return (
      <span style={{ letterSpacing: '2px' }}>MARITIME <span style={{ color: 'var(--seafoam)' }}>SYNCHRONIZATION</span></span>
    );
    return (
      <span style={{ letterSpacing: '2px' }}>SMART PISCICULTURE <span style={{ color: 'var(--seafoam)' }}>DASHBOARD</span></span>
    );
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000c11' }}>
      
      {/* Sidebar - Pro React Navigation with Unified Labels */}
      <aside className="glass-panel" style={{ width: '300px', margin: '20px', display: 'flex', flexDirection: 'column', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,12,17,0.8)' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            className="btn btn-ghost" 
            onClick={() => navigate('/')}
            style={{ padding: '8px 12px', marginBottom: '20px', color: 'var(--seafoam)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '700' }}
          >
            <ArrowLeft size={18} /> BACK TO HOME
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
             <img src={customLogo} alt="Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
             <div>
                <h2 style={{ fontSize: '1.25rem', color: '#fff', letterSpacing: '1px', marginBottom: '2px' }}>AQUA <span style={{ color: 'var(--seafoam)' }}>ELITE</span></h2>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '2px', fontWeight: '800' }}>PRECISION OPS</div>
             </div>
          </div>
        </div>

        <nav style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          {[
            { id: '', label: 'Dashboard', icon: <Activity size={20} /> },
            { id: 'insights', label: 'Fish Insights', icon: <Fish size={20} /> },
            { id: 'map', label: 'Water Analysis', icon: <MapIcon size={20} /> },
            { id: 'incidents', label: 'Alerts Feed', icon: <ShieldAlert size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
          ].map((item) => (
            <NavLink
              key={item.id}
              to={`/dashboard/${item.id}`}
              end={item.id === ''}
              className={({ isActive }) => `btn ${isActive ? 'btn-premium' : 'btn-premium-outline'}`}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '14px 24px', textDecoration: 'none', border: 'none' }}
              onClick={(e) => {
                if (item.id === 'settings' || item.id === 'insights') e.preventDefault();
              }}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--seafoam)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '800', fontSize: '0.75rem' }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fff' }}>
                <div style={{ opacity: 0.6 }}>Operator: <span style={{ color: 'var(--seafoam)' }}>Active</span></div>
                <div style={{ fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{user.email}</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Terminal Auth Required</div>
          )}
        </div>
      </aside>

      {/* Main Dashboard UI with Expanded Personalization */}
      <main className="dashboard-premium-shell" style={{ flex: 1, padding: '20px 20px 20px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <header className="glass-panel" style={{ padding: '25px 40px', marginBottom: '20px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: '2.2rem', color: '#fff', margin: 0, fontWeight: '900' }}>
            {getHeaderTitle()}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '5px', letterSpacing: '1px' }}>
             Welcome back, Operator 👋
          </p>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route index element={
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '15px' }}>
                
                {/* 3 Metrics Cards (Integrated with Rohu/Temp/pH data) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                   <div className="feature-card-premium reveal-anim" style={{ padding: '30px', animationDelay: '0.1s' }}>
                      <div className="feature-card-icon-blob" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--seafoam)' }}><Thermometer size={30} /></div>
                      <div>
                         <div className="feature-card-title">TEMPERATURE</div>
                         <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>28.4<span style={{ fontSize: '1.2rem', verticalAlign: 'top', marginLeft: '5px' }}>°C</span></div>
                      </div>
                   </div>

                   <div className="feature-card-premium reveal-anim" style={{ padding: '30px', animationDelay: '0.2s' }}>
                      <div className="feature-card-icon-blob" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--seafoam)' }}><Droplet size={30} /></div>
                      <div>
                         <div className="feature-card-title">PH LEVEL</div>
                         <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>7.5 <span style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: '400' }}>Stable</span></div>
                      </div>
                   </div>

                   <div className="feature-card-premium reveal-anim" style={{ padding: '30px', animationDelay: '0.3s' }}>
                      <div className="feature-card-icon-blob" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}><Fish size={30} /></div>
                      <div>
                         <div className="feature-card-title">RECOMMENDED</div>
                         <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--seafoam)', letterSpacing: '-1px' }}>ROHU</div>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                   
                   {/* 🚨 Alerts Feed - Integrated from user snippet */}
                   <div className="reveal-anim" style={{ animationDelay: '0.4s' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--seafoam)', letterSpacing: '4px', marginBottom: '25px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <ShieldAlert size={20} /> SYSTEM ALERTS
                      </h3>
                      
                      <div className="alert-card alert-card-danger">
                         <div style={{ width: '12px', height: '12px', background: '#ff4d4d', borderRadius: '50%', boxShadow: '0 0 10px #ff4d4d' }}></div>
                         <div>
                            <div style={{ fontWeight: '800', color: '#fff', marginBottom: '4px' }}>HIGH TEMPERATURE DETECTED!</div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Thermal sensors triggering critical threshold at Sector 7.</div>
                         </div>
                      </div>

                      <div className="alert-card alert-card-normal">
                         <div style={{ width: '12px', height: '12px', background: 'var(--seafoam)', borderRadius: '50%', boxShadow: '0 0 10px var(--seafoam)' }}></div>
                         <div>
                            <div style={{ fontWeight: '800', color: '#fff', marginBottom: '4px' }}>WATER QUALITY IS STABLE</div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>All precision monitoring units reporting optimal pH results.</div>
                         </div>
                      </div>
                   </div>

                   {/* 🐠 Fish Suggestions - Integrated from user snippet */}
                   <div className="reveal-anim" style={{ animationDelay: '0.5s' }}>
                      <h3 style={{ fontSize: '1rem', color: 'var(--seafoam)', letterSpacing: '4px', marginBottom: '25px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <Fish size={20} /> SPECIES INSIGHTS
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                         {['Rohu', 'Tilapia', 'Catla'].map((fish) => (
                            <div key={fish} className="fish-suggestion-card">
                               <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Fish size={20} color="var(--seafoam)" />
                               </div>
                               <span>{fish}</span>
                               <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--seafoam)', background: 'rgba(45, 212, 191, 0.1)', padding: '4px 10px', borderRadius: '20px' }}>98% MATCH</div>
                            </div>
                         ))}
                      </div>
                   </div>

                </div>

                {/* Sub-Header style like mockup */}
                <div style={{ display: 'flex', gap: '30px', marginTop: '60px', alignItems: 'center' }} className="reveal-anim">
                   <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '3px', fontWeight: '800' }}>MARITIME INTELLIGENCE COMMAND CENTER</div>
                   <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                </div>
              </div>
            } />
            
            <Route path="map" element={<div className="glass-panel" style={{ flex: 1, padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}><MapDashboard /></div>} />
            <Route path="incidents" element={<div className="glass-panel" style={{ flex: 1, padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}><IncidentReporting /></div>} />
            <Route path="weather" element={<div className="glass-panel" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}><WeatherDashboard /></div>} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

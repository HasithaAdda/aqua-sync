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
  TestTube,
  Menu
} from 'lucide-react';
import customLogo from '../assets/new_logo.png';
import MapDashboard from './MapDashboard';
import IncidentReporting from './IncidentReporting';
import WeatherDashboard from './WeatherDashboard';
import { useNavigate, NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000c11', overflow: 'hidden' }}>
      
      {/* ── Premium Cinematic Sidebar ── */}
      <aside className="glass-deep" style={{ 
        width: '300px', 
        margin: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: '32px', 
        border: '1px solid rgba(255,255,255,0.08)', 
        backgroundColor: 'rgba(0,12,17,0.85)',
        position: 'relative',
        zIndex: 100
      }}>
        <div style={{ padding: '40px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button 
            className="btn-premium-outline" 
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', marginBottom: '30px', width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}
          >
            <ArrowLeft size={16} /> BACK TO HOME
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
             <div className="feature-card-icon-blob biolume-pulse" style={{ width: '50px', height: '50px', border: '2px solid var(--seafoam)' }}>
                <img src={customLogo} alt="Logo" style={{ width: '120%', height: '120%', objectFit: 'contain', filter: 'brightness(1.5)' }} />
             </div>
             <div>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', letterSpacing: '1.5px', marginBottom: '0px', fontWeight: '900' }}>AQUA <span style={{ color: 'var(--seafoam)' }}>ELITE</span></h2>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '3px', fontWeight: '900', opacity: 0.8 }}>PRECISION OPS</div>
             </div>
          </div>
        </div>

        <nav style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
          {[
            { id: 'insights', label: 'FISH INSIGHTS', icon: <Fish size={20} /> },
            { id: 'map', label: 'GIS MAP VIEW', icon: <MapIcon size={20} /> },
            { id: 'incidents', label: 'ALERTS FEED', icon: <ShieldAlert size={20} /> },
            { id: 'settings', label: 'SETTINGS', icon: <Settings size={20} /> }
          ].map((item) => (
            <NavLink
              key={item.id}
              to={`/dashboard/${item.id}`}
              end={item.id === ''}
              className={({ isActive }) => `btn ${isActive ? 'btn-premium' : 'btn-premium-outline'}`}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '16px 24px', textDecoration: 'none', border: 'none', boxShadow: 'none' }}
              onClick={(e) => {
                if (item.id === 'settings' || item.id === 'insights') e.preventDefault();
              }}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}>
          {user ? (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div className="biolume-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--seafoam), #00f2c3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900', fontSize: '0.85rem', boxShadow: '0 0 15px var(--seafoam-glow)' }}>
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fff' }}>
                <div style={{ opacity: 0.6, fontSize: '0.65rem', letterSpacing: '1px' }}>SYSTEM OPERATOR</div>
                <div style={{ fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px', color: 'var(--seafoam)' }}>{user.email.split('@')[0].toUpperCase()}</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Zap size={14} color="#ffaa00" /> SECURE AUTH REQUIRED
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Command Center ── */}
      <main className="dashboard-premium-shell" style={{ flex: 1, padding: '20px 20px 20px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-deep" 
          style={{ padding: '20px 40px', marginBottom: '20px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 10, background: 'rgba(0,12,17,0.7)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '-1px' }}>
                {getHeaderTitle()}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '8px' }}>
                <div style={{ height: '2px', width: '40px', background: 'var(--seafoam)' }}></div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '700', textTransform: 'uppercase' }}>
                  COMMAND CENTER <span style={{ opacity: 0.4 }}>|</span> SECURE ACCESS
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
               <div className="btn-premium-outline" style={{ width: '45px', height: '45px', padding: 0, borderRadius: '12px' }}><Activity size={20} /></div>
               <div className="btn-premium-outline" style={{ width: '45px', height: '45px', padding: 0, borderRadius: '12px' }}><Globe size={20} /></div>
            </div>
          </div>
        </motion.header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route index element={
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ flex: 1, overflowY: 'auto', paddingRight: '15px' }}
              >
                
                {/* 3 Metrics Cards - Overhauled to High-Fidelity */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '50px' }}>
                   
                   <div className="dashboard-metric-card biolume-pulse">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                        <div className="feature-card-icon-blob" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--seafoam)', width: '60px', height: '60px' }}>
                           <Thermometer size={28} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--seafoam)', fontWeight: '900', letterSpacing: '2px' }}>SYSTEM CORE</span>
                          <div style={{ height: '2px', width: '30px', background: 'var(--seafoam)', marginLeft: 'auto', marginTop: '5px' }}></div>
                        </div>
                      </div>
                      <div className="feature-card-title" style={{ opacity: 0.6, fontSize: '0.85rem' }}>TEMPERATURE</div>
                      <div className="metric-value-premium">28.4<span style={{ fontSize: '1.5rem', color: 'var(--seafoam)', marginLeft: '8px' }}>°C</span></div>
                      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        <Activity size={12} /> Live telemetry active
                      </div>
                   </div>

                   <div className="dashboard-metric-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                        <div className="feature-card-icon-blob" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--seafoam)', width: '60px', height: '60px' }}>
                           <Droplet size={28} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--seafoam)', fontWeight: '900', letterSpacing: '2px' }}>FLUID DYNAMICS</span>
                          <div style={{ height: '2px', width: '30px', background: 'var(--seafoam)', marginLeft: 'auto', marginTop: '5px' }}></div>
                        </div>
                      </div>
                      <div className="feature-card-title" style={{ opacity: 0.6, fontSize: '0.85rem' }}>PH LEVEL</div>
                      <div className="metric-value-premium">7.5 <span style={{ fontSize: '0.9rem', color: 'var(--seafoam)', opacity: 0.8, letterSpacing: '2px' }}>STABLE</span></div>
                      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        <ListChecks size={12} /> Multi-sensor sync
                      </div>
                   </div>

                   <div className="dashboard-metric-card" style={{ border: '1px solid var(--seafoam-glow)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                        <div className="feature-card-icon-blob biolume-pulse" style={{ background: 'var(--seafoam)', color: '#002224', width: '60px', height: '60px' }}>
                           <BrainCircuit size={28} />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--seafoam)', fontWeight: '900', letterSpacing: '2px' }}>AI RECOMMENDER</span>
                          <div style={{ height: '2px', width: '30px', background: 'var(--seafoam)', marginLeft: 'auto', marginTop: '5px' }}></div>
                        </div>
                      </div>
                      <div className="feature-card-title" style={{ opacity: 0.6, fontSize: '0.85rem' }}>OPTIMAL SPECIES</div>
                      <div className="metric-value-premium" style={{ background: 'linear-gradient(to right, var(--seafoam), #00f2c3)' }}>ROHU</div>
                      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--seafoam)' }}>
                        <Zap size={12} /> High-yield match found
                      </div>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px' }}>
                   
                   {/* 🚨 Alerts Feed - Premium Command Center Style */}
                   <div style={{ background: 'rgba(0,0,0,0.2)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '5px', marginBottom: '35px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px' }}>
                         <ShieldAlert size={24} color="#ff4d4d" /> SYSTEM THREADS
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="alert-card glass-deep" style={{ borderLeft: '4px solid #ff4d4d', padding: '25px 30px' }}>
                           <div className="biolume-pulse" style={{ width: '12px', height: '12px', background: '#ff4d4d', borderRadius: '50%', boxShadow: '0 0 15px #ff4d4d' }}></div>
                           <div>
                              <div style={{ fontWeight: '900', color: '#fff', fontSize: '1rem', letterSpacing: '1px', marginBottom: '6px' }}>HIGH TEMPERATURE ANOMALY</div>
                              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>Differential sensors in <span style={{ color: '#ff4d4d' }}>SECTOR 7</span> reporting 30.5°C peak. Automated cooling sequence initiated.</div>
                           </div>
                        </div>

                        <div className="alert-card glass-deep" style={{ borderLeft: '4px solid var(--seafoam)', padding: '25px 30px' }}>
                           <div style={{ width: '12px', height: '12px', background: 'var(--seafoam)', borderRadius: '50%', boxShadow: '0 0 15px var(--seafoam)' }}></div>
                           <div>
                              <div style={{ fontWeight: '900', color: '#fff', fontSize: '1rem', letterSpacing: '1px', marginBottom: '6px' }}>WATER QUALITY VERIFIED</div>
                              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>All precision monitoring units reporting optimal <span style={{ color: 'var(--seafoam)' }}>7.5 pH</span> across entire grid. System stable.</div>
                           </div>
                        </div>
                      </div>
                   </div>

                   {/* 🐠 Species Analysis - Premium Sidebar Style */}
                   <div style={{ background: 'rgba(0,0,0,0.2)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '5px', marginBottom: '35px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px' }}>
                         <Fish size={24} /> AI SELECTION
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                         {['Rohu', 'Tilapia', 'Catla'].map((fish, index) => (
                            <div key={fish} className="fish-suggestion-card glass-deep" style={{ padding: '20px 25px', borderRadius: '20px' }}>
                               <div style={{ width: '50px', height: '50px', background: 'rgba(45,212,191,0.05)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Fish size={22} color="var(--seafoam)" />
                               </div>
                               <div>
                                 <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#fff' }}>{fish.toUpperCase()}</div>
                                 <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>GENETIC COMPATIBILITY</div>
                               </div>
                               <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                 <div style={{ fontSize: '0.8rem', color: 'var(--seafoam)', background: 'rgba(45, 212, 191, 0.12)', padding: '5px 12px', borderRadius: '10px', fontWeight: '900' }}>98%</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                </div>

                {/* Robotic Command Divider */}
                <div style={{ display: 'flex', gap: '30px', marginTop: '80px', marginBottom: '40px', alignItems: 'center' }}>
                   <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '6px', fontWeight: '900', opacity: 0.5 }}>MARITIME INTELLIGENCE COMMAND CENTER [SECURED]</div>
                   <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }}></div>
                </div>
              </motion.div>
            } />
            
            <Route path="map" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflow: 'hidden', borderRadius: '32px' }}><MapDashboard /></div>} />
            <Route path="incidents" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflow: 'hidden', borderRadius: '32px' }}><IncidentReporting /></div>} />
            <Route path="weather" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '32px' }}><WeatherDashboard /></div>} />
            <Route path="*" element={<Navigate to="" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

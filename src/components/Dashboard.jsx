import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  Users, 
  BarChart3, 
  MapPin, 
  LogOut,
  Bell,
  Activity, 
  Map as MapIcon, 
  ShieldAlert, 
  CloudSun, 
  ArrowLeft,
  LayoutDashboard,
  TrendingUp,
  Fish,
  Thermometer,
  Droplet,
  Waves,
  Compass,
  Plus,
  ClipboardList
} from 'lucide-react';
import { useNavigate, NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import customLogo from '../assets/new_logo.png';
import MapDashboard from './MapDashboard';
import IncidentReporting from './IncidentReporting';
import WeatherDashboard from './WeatherDashboard';
import GaugeWidget from './GaugeWidget';
import LiveWeatherCard from './LiveWeatherCard';
import FishInsights from './FishInsights';
import MarketInsights from './MarketInsights';
import RegionalOverview from './RegionalOverview';
import ManageFarmers from './ManageFarmers';
import FarmRegistry from './FarmRegistry';
import Alerts from './Alerts';
import Hatcheries from './Hatcheries';
import GovtSchemes from './GovtSchemes';

const Dashboard = ({ user, role, stats, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- IoT REAL-TIME DATA STATE ---
  const [sensorData, setSensorData] = useState({
    temperature: 28.4,
    ph: 7.5,
    turbidity: 12.0,
    salinity: 32.5,
    dissolvedOxygen: 6.8
  });

  // --- CENTRALIZED GEOLOCATION STATE ---
  const [userLocation, setUserLocation] = useState({
    lat: 15.42, // Default Goa latitude for instant loading
    lng: 73.80, // Default Goa longitude
    isDetected: false
  });

  useEffect(() => {
    const docRef = doc(db, 'water_parameters', '2pBQE1SbutGXrRT6NjjA');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSensorData({
          temperature: parseFloat(data.temperature || data.temp || 28.4),
          ph: parseFloat(data.pH || data.ph || 7.5),
          turbidity: parseFloat(data.turbidity || 12.0),
          salinity: parseFloat(data.salinity || 32.5),
          dissolvedOxygen: parseFloat(data.dissolvedOxygen || data.do || 6.8)
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const detectLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              isDetected: true
            });
          },
          async () => {
            // Fallback to IP if Geolocation fails or is denied
            try {
              const res = await fetch('https://ipapi.co/json/');
              const data = await res.json();
              if (data.latitude && data.longitude) {
                setUserLocation({
                  lat: data.latitude,
                  lng: data.longitude,
                  isDetected: true
                });
              } else {
                throw new Error("IP geolocation failed");
              }
            } catch (err) {
              console.error("Location detection failed:", err);
              setUserLocation({ lat: 15.42, lng: 73.80, isDetected: false });
            }
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      } else {
        // Fallback to IP if browser doesn't support geolocation
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          setUserLocation({ lat: data.latitude, lng: data.longitude, isDetected: true });
        } catch (err) {
          setUserLocation({ lat: 15.42, lng: 73.80, isDetected: false });
        }
      }
    };
    detectLocation();
  }, []);
  
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('/map')) return 'GIS MAP VIEW';
    if (path.includes('/incidents')) return 'INCIDENT LOGS';
    if (path.includes('/weather')) return 'METEOROLOGICAL DATA';
    if (path.includes('/insights')) return 'BIOLOGICAL INSIGHTS';
    if (path.includes('/market')) return 'MARKET INTEL & TRENDS';
    if (path.includes('/alerts')) return 'SYSTEM ALERTS & RECOMMENDATIONS';
    if (path.includes('/hatcheries')) return 'GOVERNMENT HATCHERIES';
    if (path.includes('/schemes')) return 'GOVERNMENT SCHEMES';
    if (path.includes('/farmers')) return 'OPERATOR DIRECTORY';
    if (path.includes('/registry')) return 'FARM REGISTRY';
    if (path.includes('/regional')) return 'REGIONAL PERFORMANCE';
    return role === 'authority' ? 'AUTHORITY DASHBOARD' : 'SMART FARMER DASHBOARD';
  };

  const navLinks = role === 'authority' ? [
    { id: '', label: 'AUTHORITY DASHBOARD', icon: <Activity size={20} /> },
    { id: 'registry', label: 'FARM REGISTRY', icon: <ClipboardList size={20} /> },
    { id: 'map', label: 'GIS MAP VIEW', icon: <MapIcon size={20} /> },
    { id: 'incidents', label: 'INCIDENT LOGS', icon: <ShieldAlert size={20} /> }
  ] : [
    { id: '', label: 'MY DASHBOARD', icon: <LayoutDashboard size={20} /> },
    { id: 'market', label: 'MARKET INTEL', icon: <TrendingUp size={20} /> },
    { id: 'alerts', label: 'ALERTS', icon: <Bell size={20} /> },
    { id: 'hatcheries', label: 'HATCHERIES', icon: <Waves size={20} /> },
    { id: 'schemes', label: 'GOVT SCHEMES', icon: <ClipboardList size={20} /> },
    { id: 'incidents', label: 'REPORT ISSUE', icon: <ShieldAlert size={20} /> }
  ];

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000c11', overflow: 'hidden' }}>
      
      <aside className="glass-deep" style={{ width: '300px', margin: '20px', display: 'flex', flexDirection: 'column', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(0,12,17,0.85)', position: 'relative', zIndex: 100 }}>
        <div style={{ padding: '40px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="btn-premium-outline" onClick={() => navigate('/')} style={{ padding: '10px 20px', marginBottom: '30px', width: '100%', justifyContent: 'center', fontSize: '0.75rem' }}>
            <ArrowLeft size={16} /> BACK TO HOME
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
             <div className="feature-card-icon-blob biolume-pulse" style={{ width: '50px', height: '50px', border: '2px solid var(--seafoam)' }}>
                <img src={customLogo} alt="Logo" style={{ width: '120%', height: '120%', objectFit: 'contain', filter: 'brightness(1.5)' }} />
             </div>
             <div>
                <h2 style={{ fontSize: '1.4rem', color: '#fff', letterSpacing: '1.5px', marginBottom: '0px', fontWeight: '900' }}>AQUA <span style={{ color: 'var(--seafoam)' }}>SYNC</span></h2>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '3px', fontWeight: '900', opacity: 0.8 }}>{role?.toUpperCase()} PORTAL</div>
             </div>
          </div>
        </div>

        <nav style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, overflowY: 'auto' }}>
          {navLinks.map((item) => (
            <NavLink key={item.id} to={`/dashboard/${item.id}`} end={item.id === ''} className={({ isActive }) => `btn ${isActive ? 'btn-premium' : 'btn-premium-outline'}`} style={{ justifyContent: 'flex-start', width: '100%', padding: '16px 24px', textDecoration: 'none', border: 'none', boxShadow: 'none' }}>
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div className="biolume-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', background: role === 'authority' ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'linear-gradient(135deg, var(--seafoam), #00f2c3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900', fontSize: '0.85rem' }}>
                {user ? user.email.charAt(0).toUpperCase() : 'G'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fff' }}>
                <div style={{ opacity: 0.6, fontSize: '0.65rem', letterSpacing: '1px' }}>{role === 'authority' ? 'ADMINISTRATOR' : 'OPERATOR'}</div>
                <div style={{ fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px', color: role === 'authority' ? '#0ea5e9' : 'var(--seafoam)' }}>
                  {user ? user.email.split('@')[0].toUpperCase() : 'GUEST USER'}
                </div>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={onLogout} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#ef4444', 
                cursor: 'pointer', 
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                outline: 'none',
                transition: 'background-color 0.2s'
              }}
              title="Logout System"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </aside>

      <main className="dashboard-premium-shell" style={{ flex: 1, padding: '30px 40px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-deep" style={{ padding: '20px 40px', marginBottom: '30px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 10, background: 'rgba(0,12,17,0.7)', maxWidth: '1400px', margin: '0 auto 30px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h1 style={{ fontSize: '1.8rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '-1px' }}>
              {getHeaderTitle()}
            </h1>
            <div style={{ display: 'flex', gap: '15px' }}>
               <div className="glass-card" style={{ padding: '8px 15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
                  <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: '700', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
               </div>
               <button className="btn-premium" style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}>
                  <Bell size={18} />
               </button>
            </div>
          </div>
        </motion.header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <Routes>
            {/* Common Routes */}
            <Route path="incidents" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflow: 'hidden', borderRadius: '32px' }}><IncidentReporting role={role} userLocation={userLocation} /></div>} />
            <Route path="map" element={<div className="glass-deep" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden', borderRadius: '32px' }}><MapDashboard sensorData={sensorData} userLocation={userLocation} /></div>} />

            {role === 'authority' ? (
              <>
                <Route index element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '32px' }}><RegionalOverview stats={stats} userLocation={userLocation} /></div>} />
                <Route path="registry" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '32px' }}><FarmRegistry /></div>} />
                <Route path="*" element={<Navigate to="" replace />} />
              </>
            ) : (
              <>
                <Route index element={<FarmerDashboard sensorData={sensorData} userLocation={userLocation} />} />
                <Route path="market" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '32px' }}><MarketInsights sensorData={sensorData} /></div>} />
                <Route path="alerts" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '32px' }}><Alerts sensorData={sensorData} /></div>} />
                <Route path="hatcheries" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '32px' }}><Hatcheries /></div>} />
                <Route path="schemes" element={<div className="glass-deep" style={{ flex: 1, padding: 0, overflowY: 'auto', borderRadius: '32px' }}><GovtSchemes /></div>} />
                <Route path="*" element={<Navigate to="" replace />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
};

const FarmerDashboard = ({ sensorData, userLocation }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, overflowY: 'auto', paddingRight: '15px' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '50px' }}>
        <LiveWeatherCard userLocation={userLocation} />
      </div>
      <div style={{ marginBottom: '60px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '5px', marginBottom: '35px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
            <Activity size={24} color="var(--seafoam)" /> REAL TIME IOT MONITORING
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
         <GaugeWidget value={sensorData.temperature} min={0} max={50} label="TEMPERATURE" unit="°C" icon={Thermometer} safeRange={{ safe: [25, 32], danger: [[20, 35]] }} />
         <GaugeWidget value={sensorData.ph} min={0} max={14} label="PH LEVEL" unit="PH" icon={Droplet} safeRange={{ safe: [6.8, 8.5], danger: [[6.5, 9.2]] }} />
         <GaugeWidget value={sensorData.turbidity} min={0} max={100} label="TURBIDITY" unit="NTU" icon={Waves} safeRange={{ safe: [0, 30], danger: [[-100, 60]] }} />
         <GaugeWidget value={sensorData.salinity} min={0} max={40} label="SALINITY" unit="PPT" icon={Compass} safeRange={{ safe: [15, 30], danger: [[5, 35]] }} />
        </div>
      </div>
      
      <div style={{ marginBottom: '60px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '5px', marginBottom: '35px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
            <Fish size={24} color="var(--seafoam)" /> MARINE INTELLIGENCE
        </h3>
        <FishInsights sensorData={sensorData} />
      </div>
    </div>
  </motion.div>
);

export default Dashboard;

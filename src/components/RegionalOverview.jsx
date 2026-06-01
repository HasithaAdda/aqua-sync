import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LiveWeatherCard from './LiveWeatherCard';

const RegionalOverview = ({ stats, userLocation }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}
    >
      {/* Dynamic Weather Widget based on Device Location */}
      <div style={{ marginBottom: '40px' }}>
         <LiveWeatherCard userLocation={userLocation} />
      </div>

      {/* KPI Cards (Dark Glassmorphic style matching the image's layout structure) */}
      <div className="dashboard-kpi-grid-responsive">
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigate('/dashboard/registry')}
          className="glass-deep"
          style={{
            padding: '35px 30px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.1), rgba(0, 0, 0, 0.4))',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          {/* Glow Orb */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '120px', height: '120px', background: '#0ea5e9', opacity: 0.15, filter: 'blur(40px)', borderRadius: '50%' }}></div>
          
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
            TOTAL REGISTERED FARMS
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            4
            <Users size={36} opacity={0.3} color="#0ea5e9" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-deep"
          style={{
            padding: '35px 30px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(0, 0, 0, 0.4))',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Glow Orb */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '120px', height: '120px', background: '#ef4444', opacity: 0.15, filter: 'blur(40px)', borderRadius: '50%' }}></div>
          
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
            FARMS IN CRZ (MOCK)
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            8
            <MapPin size={36} opacity={0.3} color="#ef4444" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          onClick={() => navigate('/dashboard/incidents')}
          className="glass-deep"
          style={{
            padding: '35px 30px',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(0, 0, 0, 0.4))',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          {/* Glow Orb */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '120px', height: '120px', background: '#f59e0b', opacity: 0.15, filter: 'blur(40px)', borderRadius: '50%' }}></div>
          
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800', letterSpacing: '2px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
            TOTAL COMPLAINTS
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
            {stats?.reports || 26}
            <AlertTriangle size={36} opacity={0.3} color="#f59e0b" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegionalOverview;

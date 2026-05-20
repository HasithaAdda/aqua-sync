import React from 'react';
import { motion } from 'framer-motion';

const GaugeWidget = ({ 
  value, 
  min = 0, 
  max = 100, 
  label, 
  unit, 
  icon: Icon, 
  safeRange,
}) => {
  // Calculate percentage for the gauge
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  // SVG Arc calculations (Semi-circle)
  const radius = 80;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Status Logic
  const getStatus = () => {
    if (!safeRange) return { text: 'SYSTEM IS STABLE', color: '#4ade80', level: 'safe' };
    
    const { safe, danger } = safeRange;

    // Check Danger (Critical)
    if (danger) {
      for (const [dMin, dMax] of danger) {
        if (value < dMin || value > dMax) {
           return { text: `CRITICAL ${label}`, color: '#f87171', level: 'danger' };
        }
      }
    }

    // Check Safe
    if (value >= safe[0] && value <= safe[1]) {
      return { text: 'SYSTEM IS STABLE', color: '#4ade80', level: 'safe' };
    }

    // Otherwise Caution
    return { text: `${label} ANOMALY`, color: '#facc15', level: 'warning' };
  };

  const status = getStatus();

  return (
    <div className="dashboard-metric-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '320px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <div className="feature-card-icon-blob" style={{ background: 'rgba(255, 255, 255, 0.05)', color: status.color, width: '45px', height: '45px' }}>
          {Icon && <Icon size={22} />}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase' }}>{label}</span>
          <div style={{ height: '3px', width: '30px', background: status.color, marginLeft: 'auto', marginTop: '6px', borderRadius: '2px', boxShadow: `0 0 10px ${status.color}` }}></div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
        {/* SVG Gauge */}
        <svg
          height="180"
          width="180"
          style={{ transform: 'rotate(135deg)' }}
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            
            {/* Dark inner glow for the track */}
            <filter id="innerGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="out" />
            </filter>
          </defs>
          
          {/* FULLY COLOURED BACKGROUND TRACK (The Scale) */}
          <circle
            stroke="url(#gaugeGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            style={{ 
              strokeLinecap: 'round',
              opacity: 0.3 // Dimmed background scale
            }}
            r={normalizedRadius}
            cx="90"
            cy="90"
          />
          
          {/* Progress Arc Overlay (Active part of the scale) */}
          <motion.circle
            stroke="url(#gaugeGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            style={{ 
              strokeLinecap: 'round',
              filter: `drop-shadow(0 0 10px rgba(255,255,255,0.1))`
            }}
            initial={{ strokeDashoffset: circumference * 0.75 }}
            animate={{ strokeDashoffset: circumference * 0.75 - (percentage / 100) * (circumference * 0.75) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            r={normalizedRadius}
            cx="90"
            cy="90"
          />
        </svg>

        {/* Center Content */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -40%)', textAlign: 'center' }}>
          <div style={{ 
            fontFamily: 'Outfit', 
            fontWeight: '900', 
            fontSize: '3rem', 
            color: '#fff', 
            lineHeight: 1,
            textShadow: '0 0 30px rgba(255,255,255,0.2)'
          }}>
            {typeof value === 'number' ? value.toFixed(1) : value}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800', marginTop: '6px', letterSpacing: '2px' }}>{unit}</div>
        </div>

      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: status.color, letterSpacing: '1px', fontWeight: '900' }}>
         <div className="biolume-pulse" style={{ width: '10px', height: '10px', borderRadius: '50%', background: status.color, boxShadow: `0 0 15px ${status.color}` }}></div>
         {status.text}
      </div>
    </div>
  );
};

export default GaugeWidget;

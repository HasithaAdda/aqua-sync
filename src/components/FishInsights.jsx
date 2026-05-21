import React, { useState, useEffect } from 'react';
import { Info, BrainCircuit, ShieldPlus } from 'lucide-react';
import { getDiseasePrediction } from '../services/predictionService';
import { motion, AnimatePresence } from 'framer-motion';

const RiskProfile = ({ species, sensorData }) => {
  const [status, setStatus] = useState("AI Analyzing...");
  const [riskLevel, setRiskLevel] = useState(0); // 0: safe, 1: medium, 2: high
  const [isWaiting, setIsWaiting] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPrediction = async () => {
      setIsWaiting(true);
      try {
        const result = await getDiseasePrediction(
          species === "Asian Seabass" ? "Seabass" : species, 
          sensorData.temperature, 
          sensorData.ph, 
          sensorData.turbidity, 
          sensorData.dissolvedOxygen || 6.0
        );
        
        if (isMounted) {
          let lowerStatus = result.toLowerCase();
          if (lowerStatus.includes("healthy") || lowerStatus.includes("safe") || result.trim() === "") {
            setStatus("Healthy");
            setRiskLevel(0);
          } else if (lowerStatus.includes("mild")) {
            setStatus(result);
            setRiskLevel(1);
          } else {
            setStatus(result);
            setRiskLevel(2);
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus("ML Server Offline");
          setRiskLevel(1); // Warning color for offline
        }
      } finally {
        if (isMounted) setIsWaiting(false);
      }
    };

    fetchPrediction();
    return () => { isMounted = false; };
  }, [sensorData, species]);

  const getStatusColor = () => {
    if (isWaiting) return 'rgba(255,255,255,0.5)';
    if (status === "ML Server Offline") return '#facc15'; // warning
    if (riskLevel === 2) return '#ff716c'; // error
    if (riskLevel === 1) return '#facc15'; // warning
    return 'var(--seafoam)'; // green
  };

  const getRiskText = () => {
    if (isWaiting) return "Computing...";
    if (riskLevel === 2) return "High Risk";
    if (riskLevel === 1) return "Medium Risk";
    return "Safe";
  };

  const getRiskColor = () => {
    if (isWaiting) return 'rgba(255,255,255,0.5)';
    if (riskLevel === 2) return '#ff716c';
    if (riskLevel === 1) return '#facc15';
    return 'var(--seafoam)';
  };

  const modalTitle = species === "Tilapia" ? "TILAPIA" : "Asian seabass";
  const tempRange = species === "Tilapia" ? "24–30°C" : "26–32°C";
  const phRange = species === "Tilapia" ? "6.5 – 9" : "7 – 8.5";
  const turbRange = species === "Tilapia" ? "< 25 NTU" : "< 20 NTU";

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-deep"
        style={{
          backgroundColor: 'rgba(25, 39, 52, 0.4)',
          padding: '20px 24px',
          borderRadius: '16px',
          marginBottom: '16px',
          color: '#fff',
          fontFamily: "'Inter', sans-serif",
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'default'
        }}
        whileHover={{ y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.3)', border: `1px solid ${getRiskColor()}50` }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: getRiskColor() }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.5px' }}>
            Species: <span style={{ color: 'var(--primary)' }}>{species}</span>
          </span>
          <button 
            onClick={() => setShowModal(true)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              cursor: 'pointer', 
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }} 
            title="Show Safe Ranges"
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Info size={18} color="var(--primary)" />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '16px', gap: '10px' }}>
          <BrainCircuit size={18} color="var(--primary)" style={{ opacity: 0.8 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>ML Prediction: </span>
          {isWaiting ? (
            <div className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          ) : (
            <span style={{ fontWeight: '800', color: getStatusColor(), fontSize: '0.95rem' }}>{status}</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
          <ShieldPlus size={18} color="var(--text-secondary)" style={{ opacity: 0.8 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Status: </span>
          <span style={{ 
            fontWeight: '800', 
            color: getRiskColor(), 
            fontSize: '0.75rem',
            background: `${getRiskColor()}15`,
            padding: '4px 10px',
            borderRadius: '6px',
            border: `1px solid ${getRiskColor()}30`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {getRiskText()}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,12,17,0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Inter', sans-serif"
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-deep"
              style={{
                backgroundColor: 'rgba(25, 39, 52, 0.9)',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '420px',
                padding: '30px',
                color: '#fff',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '12px', background: 'rgba(0, 242, 195, 0.1)', borderRadius: '12px', color: 'var(--seafoam)' }}>
                  <ShieldPlus size={28} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>
                    SAFE RANGE
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--seafoam)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>
                    {modalTitle}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0 0 12px 0', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Parameter</th>
                      <th style={{ textAlign: 'left', padding: '0 0 12px 0', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Safe Zone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>Temperature</td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 800, color: 'var(--seafoam)' }}>{tempRange}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff' }}>pH Level</td>
                      <td style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 800, color: 'var(--seafoam)' }}>{phRange}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '16px 0', color: '#fff' }}>Turbidity</td>
                      <td style={{ padding: '16px 0', fontWeight: 800, color: 'var(--seafoam)' }}>{turbRange}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn-premium-outline"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    justifyContent: 'center',
                    fontSize: '0.85rem'
                  }}
                >
                  CLOSE WINDOW
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

const FishInsights = ({ sensorData }) => {
  if (!sensorData) return null;
  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <RiskProfile species="Tilapia" sensorData={sensorData} />
      <RiskProfile species="Asian Seabass" sensorData={sensorData} />
    </div>
  );
};

export default FishInsights;

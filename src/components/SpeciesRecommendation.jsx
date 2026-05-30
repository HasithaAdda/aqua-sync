import React, { useState } from 'react';
import { Wifi, WifiOff, BrainCircuit, Dna, Gauge, Droplets, Waves, Thermometer, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { getSpeciesRecommendations } from '../services/predictionService';
import { motion, AnimatePresence } from 'framer-motion';

// ── Suitability badge colour mapped to web app's ocean theme
const getStatusStyle = (status) => {
  switch (status) {
    case 'Highly Suitable':
      return { color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.4)' };
    case 'Suitable':
      return { color: '#86efac', bg: 'rgba(134,239,172,0.12)', border: '1px solid rgba(134,239,172,0.4)' };
    case 'Moderately Suitable':
      return { color: '#facc15', bg: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.4)' };
    default:
      return { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)' };
  }
};

// ── Score bar fill colour
const getScoreColor = (score) => {
  if (score >= 85) return 'var(--seafoam)';
  if (score >= 70) return '#86efac';
  if (score >= 50) return '#facc15';
  return '#f87171';
};

// ── Species emoji map
const getSpeciesEmoji = (species) => {
  const map = {
    'whiteleg shrimp': '🦐',
    'tiger shrimp': '🦐',
    'tilapia': '🐟',
    'catfish': '🐡',
    'milkfish': '🐠',
  };
  return map[species.toLowerCase()] || '🐟';
};

// ── Parameter sensor row
const SensorRow = ({ icon: Icon, label, value, unit }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '10px',
      background: 'rgba(45,212,191,0.08)',
      border: '1px solid rgba(45,212,191,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--seafoam)', flexShrink: 0
    }}>
      <Icon size={16} />
    </div>
    <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>
      {label}
    </span>
    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
      {typeof value === 'number' ? value.toFixed(1) : value}
      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>{unit}</span>
    </span>
  </div>
);

// ── Recommendation card
const RecommendationCard = ({ rec, index }) => {
  const statusStyle = getStatusStyle(rec.status);
  const scoreColor = getScoreColor(rec.score);
  const pct = Math.min(100, rec.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120 }}
      className="glass-deep"
      style={{
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '16px',
        border: '1px solid rgba(255,255,255,0.07)',
        backgroundColor: 'rgba(0,12,17,0.6)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s, box-shadow 0.25s',
      }}
      whileHover={{ y: -3, boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 20px ${statusStyle.color}20` }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
        background: `linear-gradient(to bottom, ${statusStyle.color}, transparent)`,
        borderRadius: '20px 0 0 20px'
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{getSpeciesEmoji(rec.name)}</span>
          <div>
            <h3 style={{
              margin: 0, color: '#fff', fontFamily: "'Outfit', sans-serif",
              fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.5px'
            }}>
              {rec.name}
            </h3>
            {rec.isLocalFallback && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', marginTop: '2px' }}>
                <WifiOff size={11} /> LOCAL MODEL
              </span>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          padding: '6px 14px', borderRadius: '50px',
          background: statusStyle.bg,
          border: statusStyle.border,
          color: statusStyle.color,
          fontSize: '0.72rem', fontWeight: 800,
          letterSpacing: '0.5px', textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>
          {rec.status}
        </div>
      </div>

      {/* Score bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Suitability
        </span>
        <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: '3px', background: `linear-gradient(to right, ${scoreColor}80, ${scoreColor})` }}
          />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 900,
          fontSize: '1rem', color: scoreColor, minWidth: '48px', textAlign: 'right'
        }}>
          {rec.score.toFixed(0)}%
        </span>
      </div>
    </motion.div>
  );
};

// ── Main Component
const SpeciesRecommendation = ({ sensorData }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const currentTemp = sensorData?.temperature ?? 28.0;
  const currentPh = sensorData?.ph ?? 7.5;
  const currentSalinity = sensorData?.salinity ?? 10.0;
  const currentTurbidity = sensorData?.turbidity ?? 25.0;

  const handlePredict = async () => {
    setLoading(true);
    setHasRun(false);
    try {
      const raw = await getSpeciesRecommendations(currentTemp, currentPh, currentSalinity, currentTurbidity);
      const formatted = raw.map((rec) => ({
        id: rec.species.toLowerCase().replace(/\s+/g, '-'),
        name: rec.species,
        score: rec.score,
        status: rec.status,
        isLocalFallback: rec.isLocalFallback,
      }));
      setRecommendations(formatted);
    } catch (err) {
      console.error('Species prediction error:', err);
    } finally {
      setLoading(false);
      setHasRun(true);
    }
  };

  return (
    <div style={{
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      padding: '32px',
      fontFamily: "'Inter', sans-serif",
      color: '#fff',
      boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* ── Live Parameters Card ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-deep"
          style={{
            borderRadius: '24px',
            padding: '28px 32px',
            marginBottom: '28px',
            border: '1px solid rgba(255,255,255,0.07)',
            backgroundColor: 'rgba(0,12,17,0.7)',
          }}
        >
          {/* Card header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h2 style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff' }}>
              Live IoT Parameters
            </h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(45,212,191,0.1)',
              border: '1px solid rgba(45,212,191,0.3)',
              borderRadius: '50px', padding: '5px 12px',
            }}>
              <Wifi size={13} color="var(--seafoam)" />
              <span style={{ color: 'var(--seafoam)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1.5px' }}>LIVE</span>
            </div>
          </div>
          <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Streaming in real-time from your farm's IoT sensors via Firebase.
          </p>

          <SensorRow icon={Thermometer} label="Temperature" value={currentTemp} unit="°C" />
          <SensorRow icon={Droplets} label="pH Level" value={currentPh} unit="pH" />
          <SensorRow icon={Waves} label="Salinity" value={currentSalinity} unit="ppt" />
          <SensorRow icon={Gauge} label="Turbidity" value={currentTurbidity} unit="NTU" />
        </motion.div>

        {/* ── Predict Button ── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button
            id="species-predict-btn"
            className="btn-premium"
            onClick={handlePredict}
            disabled={loading}
            style={{
              opacity: loading ? 0.75 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              letterSpacing: '2px',
              padding: '16px 40px',
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ANALYZING...
              </>
            ) : (
              <>
                <BrainCircuit size={18} />
                PREDICT BEST SPECIES
              </>
            )}
          </button>
        </div>

        {/* ── Results ── */}
        <AnimatePresence>
          {hasRun && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {recommendations.length > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Dna size={20} color="var(--seafoam)" />
                    <h2 style={{
                      margin: 0, fontFamily: "'Outfit', sans-serif",
                      fontSize: '1rem', fontWeight: 800,
                      letterSpacing: '3px', textTransform: 'uppercase', color: '#fff'
                    }}>
                      Recommended Species
                    </h2>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {recommendations.length} results
                    </span>
                  </div>
                  {recommendations.map((rec, i) => (
                    <RecommendationCard key={rec.id} rec={rec} index={i} />
                  ))}
                </>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '40px',
                  color: 'var(--text-secondary)', fontSize: '0.9rem'
                }}>
                  No species recommendations generated. Adjust sensor conditions and retry.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SpeciesRecommendation;

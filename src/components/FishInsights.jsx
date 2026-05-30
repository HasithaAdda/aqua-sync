import React, { useState, useEffect } from 'react';
import { Info, BrainCircuit, ShieldPlus, ShieldAlert, Biohazard, Thermometer, Droplets, Waves, Activity } from 'lucide-react';
import { getDiseasePrediction } from '../services/predictionService';
import { motion, AnimatePresence } from 'framer-motion';

// ────────────────────────────────────────────────────────────
//  BACTERIAL INFECTION RISK  (mirrors ml_prediction_service.dart)
// ────────────────────────────────────────────────────────────
const getBacterialInfectionRisk = (temperature, ph, salinity, turbidity) => {
  let riskScore = 0;

  if (turbidity > 30) riskScore += 2;
  else if (turbidity > 20) riskScore += 1;

  if (temperature >= 26 && temperature <= 32) riskScore += 1;
  if (ph >= 6.5 && ph <= 8.5) riskScore += 1;
  if (salinity <= 10) riskScore += 1;

  if (riskScore >= 4) return 'High';
  if (riskScore >= 2) return 'Moderate';
  return 'Low';
};

// ────────────────────────────────────────────────────────────
//  LOCAL FALLBACK  (mirrors _getLocalFallbackPrediction in Dart)
// ────────────────────────────────────────────────────────────
const getLocalFallbackPrediction = (species, temperature, ph, salinity, turbidity) => {
  const isSeabass = species.toLowerCase().includes('seabass');
  const minTemp = isSeabass ? 26.0 : 24.0;
  const maxTemp = isSeabass ? 32.0 : 30.0;
  const minPh   = isSeabass ? 7.0  : 6.5;
  const maxPh   = isSeabass ? 8.5  : 9.0;
  const maxTurb = isSeabass ? 20.0 : 25.0;
  const minSal  = isSeabass ? 10.0 : 0.0;
  const maxSal  = isSeabass ? 30.0 : 5.0;

  let riskScore = 0;
  const riskFactors = [];

  if (temperature < minTemp - 2 || temperature > maxTemp + 2) {
    riskScore += 2; riskFactors.push('Critical Temp');
  } else if (temperature < minTemp || temperature > maxTemp) {
    riskScore += 1; riskFactors.push('Mild Temp Alert');
  }

  if (ph < minPh - 0.5 || ph > maxPh + 0.5) {
    riskScore += 2; riskFactors.push('Critical pH');
  } else if (ph < minPh || ph > maxPh) {
    riskScore += 1; riskFactors.push('Mild pH Alert');
  }

  if (salinity < minSal - 5 || salinity > maxSal + 5) {
    riskScore += 2; riskFactors.push('Critical Salinity');
  } else if (salinity < minSal || salinity > maxSal) {
    riskScore += 1; riskFactors.push('Unstable Salinity');
  }

  if (turbidity > maxTurb + 10) {
    riskScore += 2; riskFactors.push('Critical Turbidity');
  } else if (turbidity > maxTurb) {
    riskScore += 1; riskFactors.push('Elevated Turbidity');
  }

  const bacterialRisk = getBacterialInfectionRisk(temperature, ph, salinity, turbidity);

  let basePrediction;
  if (riskScore === 0) {
    basePrediction = 'Healthy / Safe conditions (Local)';
  } else if (riskScore <= 2) {
    basePrediction = `Mild risk: ${riskFactors.join(', ')} (Local)`;
  } else {
    basePrediction = `High risk: ${riskFactors.join(', ')} (Local)`;
  }

  return `${basePrediction} | Bacterial Infection Risk: ${bacterialRisk}`;
};

// ────────────────────────────────────────────────────────────
//  HELPERS
// ────────────────────────────────────────────────────────────
const parseResult = (result) => {
  const lower = result.toLowerCase();
  const [baseStr, bacterialStr] = result.split('|').map(s => s.trim());

  let riskLevel = 0;
  let mlStatus;

  if (lower.includes('high risk') || lower.includes('critical')) {
    riskLevel = 2;
    mlStatus = baseStr;
  } else if (lower.includes('mild') || lower.includes('moderate') || lower.includes('elevated') || lower.includes('unstable')) {
    riskLevel = 1;
    mlStatus = baseStr;
  } else {
    riskLevel = 0;
    mlStatus = 'Healthy';
  }

  let bacterialRisk = null;
  if (bacterialStr) {
    const match = bacterialStr.match(/bacterial infection risk:\s*(\w+)/i);
    if (match) bacterialRisk = match[1];
  }

  return { riskLevel, mlStatus, bacterialRisk };
};

const getRiskColor = (riskLevel) => {
  if (riskLevel === 2) return '#f87171';
  if (riskLevel === 1) return '#facc15';
  return 'var(--seafoam)';
};

const getRiskLabel = (riskLevel) => {
  if (riskLevel === 2) return 'High Risk';
  if (riskLevel === 1) return 'Medium Risk';
  return 'Safe';
};

const getBacterialColor = (risk) => {
  if (!risk) return 'var(--text-secondary)';
  if (risk === 'High') return '#f87171';
  if (risk === 'Moderate') return '#facc15';
  return 'var(--seafoam)';
};

const SPECIES_SAFE_RANGES = {
  'Tilapia':      { temp: '24–30 °C', ph: '6.5 – 9.0', turb: '< 25 NTU', sal: '0–5 ppt' },
  'Asian Seabass':{ temp: '26–32 °C', ph: '7.0 – 8.5', turb: '< 20 NTU', sal: '10–30 ppt' },
  'Catfish':      { temp: '25–32 °C', ph: '6.5 – 8.0', turb: '15–40 NTU', sal: '0–8 ppt' },
  'Milkfish':     { temp: '26–32 °C', ph: '7.0 – 8.5', turb: '20–45 NTU', sal: '10–35 ppt' },
};

const SPECIES_EMOJIS = {
  'Tilapia': '🐟',
  'Asian Seabass': '🐟',
  'Catfish': '🐡',
  'Milkfish': '🐠',
};

// ────────────────────────────────────────────────────────────
//  SAFE RANGE MODAL
// ────────────────────────────────────────────────────────────
const SafeRangeModal = ({ species, onClose }) => {
  const ranges = SPECIES_SAFE_RANGES[species] || {};
  const rows = [
    { param: 'Temperature', value: ranges.temp },
    { param: 'pH Level',    value: ranges.ph },
    { param: 'Turbidity',   value: ranges.turb },
    { param: 'Salinity',    value: ranges.sal },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,12,17,0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="glass-deep"
        style={{
          borderRadius: '24px',
          width: '90%', maxWidth: '420px',
          padding: '32px',
          background: 'rgba(0,30,38,0.95)',
          border: '1px solid rgba(45,212,191,0.15)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(45,212,191,0.05)',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(45,212,191,0.1)', borderRadius: '14px', color: 'var(--seafoam)' }}>
            <ShieldPlus size={26} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff' }}>
              Safe Ranges
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--seafoam)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '3px' }}>
              {SPECIES_EMOJIS[species]} {species}
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '14px', padding: '4px 0', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {rows.map((r, i) => (
            <div key={r.param} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>{r.param}</span>
              <span style={{ color: 'var(--seafoam)', fontWeight: 800, fontSize: '0.9rem', fontFamily: "'Outfit', sans-serif" }}>{r.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="btn-premium-outline"
          style={{ width: '100%', marginTop: '24px', justifyContent: 'center', fontSize: '0.8rem', padding: '13px 24px' }}
        >
          CLOSE
        </button>
      </motion.div>
    </motion.div>
  );
};

// ────────────────────────────────────────────────────────────
//  RISK PROFILE CARD (one per species)
// ────────────────────────────────────────────────────────────
const RiskProfile = ({ species, sensorData, index }) => {
  const [prediction, setPrediction] = useState(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsWaiting(true);
    setPrediction(null);

    const fetch = async () => {
      try {
        const apiSpecies = species === 'Asian Seabass' ? 'Seabass' : species;
        const result = await getDiseasePrediction(
          apiSpecies,
          sensorData.temperature,
          sensorData.ph,
          sensorData.salinity ?? 10.0,
          sensorData.turbidity,
          sensorData.dissolvedOxygen ?? 6.0
        );
        // Append bacterial infection risk locally (mirrors Dart logic)
        const bacterialRisk = getBacterialInfectionRisk(
          sensorData.temperature, sensorData.ph,
          sensorData.salinity ?? 10, sensorData.turbidity
        );
        const enriched = result.includes('Bacterial Infection Risk')
          ? result
          : `${result} | Bacterial Infection Risk: ${bacterialRisk}`;

        if (mounted) setPrediction(parseResult(enriched));
      } catch {
        if (mounted) setPrediction({ riskLevel: 1, mlStatus: 'ML Server Offline', bacterialRisk: null });
      } finally {
        if (mounted) setIsWaiting(false);
      }
    };

    fetch();
    return () => { mounted = false; };
  }, [sensorData, species]);

  const riskColor = isWaiting ? 'rgba(255,255,255,0.3)' : getRiskColor(prediction?.riskLevel ?? 0);
  const riskLabel = isWaiting ? 'Computing...' : getRiskLabel(prediction?.riskLevel ?? 0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, type: 'spring', stiffness: 120 }}
        className="glass-deep"
        style={{
          borderRadius: '18px',
          padding: '22px 26px',
          marginBottom: '14px',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,12,17,0.65)',
          position: 'relative', overflow: 'hidden',
          cursor: 'default',
        }}
        whileHover={{
          y: -2,
          boxShadow: `0 12px 36px rgba(0,0,0,0.4), 0 0 16px ${riskColor}20`,
          borderColor: `${riskColor}30`
        }}
      >
        {/* Accent bar */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
          background: isWaiting ? 'rgba(255,255,255,0.1)' : riskColor,
          borderRadius: '18px 0 0 18px',
          transition: 'background 0.4s'
        }} />

        {/* Species header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{SPECIES_EMOJIS[species]}</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '0.5px' }}>
              {species}
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '10px', padding: '7px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s', color: 'var(--seafoam)'
            }}
            title="View Safe Parameter Ranges"
            onMouseOver={e => e.currentTarget.style.background = 'rgba(45,212,191,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Info size={17} />
          </button>
        </div>

        {/* ML Prediction row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <BrainCircuit size={16} color="var(--seafoam)" style={{ opacity: 0.85 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            ML Prediction:
          </span>
          {isWaiting ? (
            <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--seafoam)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          ) : (
            <span style={{ fontWeight: 800, color: riskColor, fontSize: '0.9rem', maxWidth: '100%' }}>
              {prediction?.mlStatus}
            </span>
          )}
        </div>

        {/* Status badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <ShieldAlert size={16} color="var(--text-secondary)" style={{ opacity: 0.7 }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Status:
          </span>
          <span style={{
            fontWeight: 800, fontSize: '0.72rem',
            color: riskColor,
            background: `${riskColor}14`,
            padding: '4px 12px', borderRadius: '50px',
            border: `1px solid ${riskColor}35`,
            textTransform: 'uppercase', letterSpacing: '0.6px',
            transition: 'all 0.4s'
          }}>
            {riskLabel}
          </span>

          {/* Bacterial infection risk */}
          {!isWaiting && prediction?.bacterialRisk && (
            <span style={{
              fontWeight: 700, fontSize: '0.7rem',
              color: getBacterialColor(prediction.bacterialRisk),
              background: `${getBacterialColor(prediction.bacterialRisk)}12`,
              padding: '4px 12px', borderRadius: '50px',
              border: `1px solid ${getBacterialColor(prediction.bacterialRisk)}30`,
              letterSpacing: '0.5px',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              🦠 Bacterial Risk: {prediction.bacterialRisk}
            </span>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && <SafeRangeModal species={species} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
};

// ────────────────────────────────────────────────────────────
//  MAIN EXPORT  – Disease Prediction Panel
// ────────────────────────────────────────────────────────────
const SPECIES_LIST = ['Tilapia', 'Asian Seabass', 'Catfish', 'Milkfish'];

const FishInsights = ({ sensorData }) => {
  if (!sensorData) return null;

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      {SPECIES_LIST.map((s, i) => (
        <RiskProfile key={s} species={s} sensorData={sensorData} index={i} />
      ))}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FishInsights;

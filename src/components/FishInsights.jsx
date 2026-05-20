import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Fish, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  MapPin, 
  Activity,
  Droplet,
  Waves,
  Thermometer,
  Zap,
  ChevronRight,
  BrainCircuit,
  ShieldAlert,
  Cpu,
  Tornado,
  Waves as WavesIcon
} from 'lucide-react';

// --- DESIGN TOKENS (Abyssal Lumina) ---
const COLORS = {
  background: '#060f18',
  primary: '#a1faff',
  primaryGlow: 'rgba(161, 250, 255, 0.3)',
  secondary: '#73f1e7',
  tertiary: '#d9ffee',
  error: '#ff716c',
  errorGlow: 'rgba(255, 113, 108, 0.3)',
  warning: '#facc15',
  surface: '#0e1b26',
  surfaceVariant: 'rgba(25, 39, 52, 0.4)',
  textPrimary: '#e5effc',
  textSecondary: '#a2acb8',
};

// Mock trend data
const mockTrendData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  salinity: 30 + Math.random() * 5,
  oxygen: 5 + Math.random() * 3,
  temp: 26 + Math.random() * 4,
  ph: 7.0 + Math.random() * 1.0
}));

const FishInsights = ({ sensorData }) => {
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  const speciesPredictions = [
    { name: 'Chonak (Seabass)', confidence: 98, status: 'OPTIMAL', description: 'Environmental metrics align 98% with peak growth parameters for estuary-based Lates calcarifer.', id: 'chonak' },
    { name: 'Tamso (Red Snapper)', confidence: 84, status: 'STABLE', description: 'Salinity levels are within tolerance, though temperature is 1.2°C above ideal for premium curry fish.', id: 'tamso' },
    { name: 'Modso (Black Kingfish)', confidence: 76, status: 'VIABLE', description: 'Dissolved oxygen levels are acceptable for moderate stock density. Popular for local market demand.', id: 'modso' }
  ];

  const alerts = [
    { id: 1, type: 'CRITICAL', title: 'Dissolved Oxygen Flux', time: '02:14 PM', desc: 'Zone B monitoring detect DO drop to 4.2 mg/L. AI adjusting aerators.', color: COLORS.error },
    { id: 2, type: 'WARNING', title: 'Salinity Gradient Shift', time: '01:55 PM', desc: 'Zuari estuary inflow increasing salinity. Stability within 5% variance.', color: COLORS.warning },
    { id: 3, type: 'NORMAL', title: 'Biomass Prediction Sync', time: '01:30 PM', desc: 'Scan complete. Stock development proceeding at accelerated rate.', color: COLORS.secondary }
  ];

  return (
    <div style={{ 
      color: COLORS.textPrimary, 
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Bioluminescent Glows */}
      <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(161, 250, 255, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '0', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(115, 241, 231, 0.03) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '30px' }}>
        
        {/* LEFT COLUMN: SENSORS & PREDICTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          {/* 2. AI Species Prediction Panel */}
          <section className="glass-deep" style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: COLORS.surfaceVariant, 
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(161, 250, 255, 0.1)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '0.85rem', color: COLORS.primary, letterSpacing: '3px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BrainCircuit size={18} /> SPECIES PREDICTION ENGINE
              </h3>
              <div style={{ background: 'rgba(161, 250, 255, 0.05)', padding: '5px 15px', borderRadius: '50px', fontSize: '0.6rem', fontWeight: '900', color: COLORS.primary, border: `1px solid ${COLORS.primaryGlow}` }}>
                AI MODEL: AQUA-NET v3
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {speciesPredictions.map((species, idx) => (
                <motion.div 
                  key={species.id}
                  whileHover={{ x: 10, backgroundColor: 'rgba(161, 250, 255, 0.05)' }}
                  onClick={() => setSelectedSpecies(species.id)}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '16px', 
                    background: 'rgba(14, 27, 38, 0.3)', 
                    border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}
                >
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Fish size={32} color={idx === 0 ? COLORS.primary : COLORS.textSecondary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.5px' }}>{species.name}</h4>
                      <span style={{ fontSize: '0.7rem', fontWeight: '900', color: species.status === 'OPTIMAL' ? COLORS.secondary : COLORS.warning }}>{species.status}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: COLORS.textSecondary, lineHeight: 1.4 }}>{species.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: '900', color: idx === 0 ? COLORS.primary : '#fff' }}>{species.confidence}%</div>
                    <div style={{ fontSize: '0.6rem', color: COLORS.textSecondary, fontWeight: '800' }}>AI MATCH</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 3. Historical Data Area */}
          <section className="glass-deep" style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: COLORS.surfaceVariant, 
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(161, 250, 255, 0.1)`,
            height: '350px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '0.85rem', color: COLORS.primary, letterSpacing: '3px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={18} /> BIO-STABILITY OVERVIEW (24H)
              </h3>
            </div>
            <div style={{ height: '240px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.surface} vertical={false} />
                  <XAxis dataKey="time" stroke={COLORS.textSecondary} fontSize={10} tick={{ fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
                  <YAxis stroke={COLORS.textSecondary} fontSize={10} tick={{ fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: COLORS.surface, border: `1px solid ${COLORS.primaryGlow}`, borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="salinity" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorPrimary)" strokeWidth={3} />
                  <Area type="monotone" dataKey="oxygen" stroke={COLORS.secondary} fillOpacity={1} fill="url(#colorSecondary)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: AI COMMANDER & ALERTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* 4. AI Commander AXON */}
          <section className="glass-deep" style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: `linear-gradient(135deg, ${COLORS.surface}, rgba(6, 15, 24, 0.8))`, 
            border: `2px solid ${COLORS.primary}`,
            position: 'relative',
            overflow: 'hidden'
          }}>
             <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '120px', height: '120px', background: COLORS.primary, filter: 'blur(70px)', opacity: 0.15 }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '12px', 
                  background: COLORS.primaryGlow, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: `1px solid ${COLORS.primary}`
                }}>
                  <Cpu size={24} color={COLORS.primary} className="biolume-pulse" />
                </div>
                <div>
                   <h3 style={{ fontSize: '0.9rem', color: '#fff', letterSpacing: '2px', margin: 0 }}>AI COMMANDER</h3>
                   <div style={{ fontSize: '0.6rem', color: COLORS.primary, fontWeight: '900' }}>AGENT AXON-7 // ACTIVE</div>
                </div>
             </div>
             <p style={{ 
               fontSize: '0.85rem', 
               color: COLORS.textPrimary, 
               lineHeight: 1.6, 
               margin: '0 0 20px',
               fontStyle: 'italic',
               background: 'rgba(161, 250, 255, 0.03)',
               padding: '15px',
               borderRadius: '12px',
               borderLeft: `2px solid ${COLORS.primary}`
             }}>
               "Current environmental metrics are stable, however, predicted metabolic shifts in the nursery quadrant suggest a 0.5 unit pH adjustment within 4 hours. Recommend proactive oxygenation increase."
             </p>
             <button className="btn-premium" style={{ width: '100%', borderRadius: '12px', padding: '12px', fontSize: '0.75rem' }}>
               EXECUTE PROTOCOLS
             </button>
          </section>

          {/* 5. Mission Control Alerts */}
          <section className="glass-deep" style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: COLORS.surfaceVariant, 
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(161, 250, 255, 0.1)`,
            flex: 1
          }}>
            <h3 style={{ fontSize: '0.85rem', color: COLORS.primary, letterSpacing: '3px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={18} /> MISSION LOGS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{ 
                  padding: '15px', 
                  borderRadius: '16px', 
                  background: 'rgba(6, 15, 24, 0.4)', 
                  border: `1px solid ${alert.color}22`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: '900', color: alert.color, letterSpacing: '1px' }}>[{alert.type}]</span>
                    <span style={{ fontSize: '0.6rem', color: COLORS.textSecondary }}>{alert.time}</span>
                  </div>
                  <h4 style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#fff' }}>{alert.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: COLORS.textSecondary, lineHeight: 1.4 }}>{alert.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Geo-Context HUD */}
          <section className="glass-deep" style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: COLORS.surfaceVariant, 
            backdropFilter: 'blur(20px)',
            border: `1px solid rgba(161, 250, 255, 0.1)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
               <MapPin size={20} color={COLORS.secondary} />
               <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', color: COLORS.textSecondary }}>GEO-COORDINATES</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff', marginBottom: '5px' }}>ZUARI ESTUARY, GOA</div>
            <div style={{ fontSize: '0.65rem', color: COLORS.secondary, letterSpacing: '1px', marginBottom: '15px' }}>15°24'N 73°48'E // DEPTH: 14M</div>
            <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5, fontSize: '0.75rem', color: COLORS.textSecondary }}>
              Zonal turbulence is nominal. Local biomass density is at 88% capacity.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

export default FishInsights;

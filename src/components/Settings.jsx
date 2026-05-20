import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Cpu, 
  Palette, 
  User, 
  Database,
  Save,
  RefreshCcw,
  Download,
  Trash2,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Radio
} from 'lucide-react';

const Settings = ({ onLogout }) => {
  const [config, setConfig] = useState({
    tempMin: 25,
    tempMax: 32,
    phMin: 6.8,
    phMax: 8.5,
    turbidityMax: 30,
    alertsEnabled: true,
    sensitivity: 'Medium',
    refreshRate: 5,
    theme: 'Dark',
    unit: 'Celsius'
  });

  const handleToggle = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, val) => {
    setConfig(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div style={{ padding: '40px', color: '#A7EBF2', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
        
        {/* ── 1. Sensor Configuration ── */}
        <motion.section 
          whileHover={{ y: -5 }}
          className="glass-deep" 
          style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.4), rgba(1, 28, 64, 0.6))', 
            border: '1px solid rgba(38, 101, 140, 0.4)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
          }}
        >
          <h3 style={{ fontSize: '1rem', color: '#fff', letterSpacing: '4px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 900 }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(84, 172, 191, 0.1)', border: '1px solid rgba(84, 172, 191, 0.2)' }}>
              <SettingsIcon size={18} color="#54ACBF" />
            </div>
            SENSOR CONFIGURATION
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(167, 235, 242, 0.7)' }}>pH Safe Range</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="text" value={config.phMin} className="form-input-premium" style={{ width: '70px', padding: '10px', textAlign: 'center', background: 'rgba(1, 28, 64, 0.4)', border: '1px solid rgba(38, 101, 140, 0.5)', color: '#fff', borderRadius: '12px' }} readOnly />
                <span style={{ color: '#54ACBF', opacity: 0.5 }}>–</span>
                <input type="text" value={config.phMax} className="form-input-premium" style={{ width: '70px', padding: '10px', textAlign: 'center', background: 'rgba(1, 28, 64, 0.4)', border: '1px solid rgba(38, 101, 140, 0.5)', color: '#fff', borderRadius: '12px' }} readOnly />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(167, 235, 242, 0.7)' }}>Temp Protocol (Min-Max)</span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="text" value={`${config.tempMin}°`} className="form-input-premium" style={{ width: '70px', padding: '10px', textAlign: 'center', background: 'rgba(1, 28, 64, 0.4)', border: '1px solid rgba(38, 101, 140, 0.5)', color: '#fff', borderRadius: '12px' }} readOnly />
                <input type="text" value={`${config.tempMax}°`} className="form-input-premium" style={{ width: '70px', padding: '10px', textAlign: 'center', background: 'rgba(1, 28, 64, 0.4)', border: '1px solid rgba(38, 101, 140, 0.5)', color: '#fff', borderRadius: '12px' }} readOnly />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(167, 235, 242, 0.7)' }}>Turbidity Threshold</span>
                <input type="text" value={`${config.turbidityMax} NTU`} className="form-input-premium" style={{ width: '110px', padding: '10px', textAlign: 'center', background: 'rgba(1, 28, 64, 0.4)', border: '1px solid rgba(38, 101, 140, 0.5)', color: '#fff', borderRadius: '12px' }} readOnly />
            </div>
          </div>
          <button className="btn-premium" style={{ width: '100%', marginTop: '35px', background: 'linear-gradient(to right, #26658C, #0ea5e9)', color: '#fff', border: 'none', padding: '18px', borderRadius: '14px', fontWeight: 900, letterSpacing: '1px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
            <Save size={16} /> SAVE SENSOR PROTOCOLS
          </button>
        </motion.section>

        {/* ── 2. Alert Settings ── */}
        <motion.section 
          whileHover={{ y: -5 }}
          className="glass-deep" 
          style={{ 
            padding: '30px', 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.4), rgba(1, 28, 64, 0.6))', 
            border: '1px solid rgba(38, 101, 140, 0.4)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
          }}
        >
          <h3 style={{ fontSize: '1rem', color: '#fff', letterSpacing: '4px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 900 }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(84, 172, 191, 0.1)', border: '1px solid rgba(84, 172, 191, 0.2)' }}>
              <Bell size={18} color="#54ACBF" />
            </div>
            ALERT TRIGGERS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>Intelligent Alerts</div>
                  <div style={{ fontSize: '0.7rem', color: '#54ACBF', opacity: 0.6 }}>AI-driven predictive notification</div>
               </div>
               <label className="switch">
                  <input type="checkbox" checked={config.alertsEnabled} onChange={() => handleToggle('alertsEnabled')} />
                  <span className="slider round"></span>
               </label>
             </div>
             <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(167, 235, 242, 0.5)', marginBottom: '15px', fontWeight: 900, letterSpacing: '1px' }}>SYSTEM SENSITIVITY</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'rgba(1, 28, 64, 0.3)', padding: '6px', borderRadius: '15px' }}>
                  {['Low', 'Medium', 'High'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => handleSelect('sensitivity', s)}
                      style={{ 
                        padding: '12px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        background: config.sensitivity === s ? 'linear-gradient(135deg, #26658C, #0ea5e9)' : 'rgba(255, 255, 255, 0.08)',
                        color: config.sensitivity === s ? '#fff' : 'rgba(167, 235, 242, 0.7)',
                        fontSize: '0.75rem',
                        fontWeight: '900',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: `1px solid ${config.sensitivity === s ? 'transparent' : 'rgba(255, 255, 255, 0.1)'}`,
                        boxShadow: config.sensitivity === s ? '0 5px 15px rgba(14, 165, 233, 0.3)' : 'none'
                      }}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </motion.section>

        {/* ── 3. IoT Device Settings ── */}
        <section className="glass-deep" style={{ padding: '30px', borderRadius: '24px', background: '#023859', border: '1px solid #26658C' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', letterSpacing: '2px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={20} color="#54ACBF" /> HARDWARE TELEMETRY
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
             <div style={{ flex: 1, minWidth: '150px', padding: '15px', background: '#011C40', borderRadius: '15px', border: '1px solid #26658C' }}>
                <div style={{ fontSize: '0.65rem', color: '#54ACBF', marginBottom: '5px' }}>DEVICE STATUS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '900' }}>
                   <Radio size={16} className="biolume-pulse" /> CONNECTED
                </div>
             </div>
             <div style={{ flex: 1, minWidth: '150px', padding: '15px', background: '#011C40', borderRadius: '15px', border: '1px solid #26658C' }}>
                <div style={{ fontSize: '0.65rem', color: '#54ACBF', marginBottom: '5px' }}>LAST UPDATED</div>
                <div style={{ color: '#fff', fontWeight: '900' }}>2 SEC AGO</div>
             </div>
          </div>
          <div style={{ marginTop: '20px' }}>
             <div style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '10px' }}>Sync Frequency</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input type="range" min="1" max="10" step="1" value={config.refreshRate} onChange={(e) => handleSelect('refreshRate', e.target.value)} style={{ flex: 1, accentColor: '#A7EBF2' }} />
                <span style={{ fontSize: '0.9rem', width: '40px', textAlign: 'right' }}>{config.refreshRate}s</span>
             </div>
          </div>
        </section>

        {/* ── 4. UI Preferences ── */}
        <section className="glass-deep" style={{ padding: '30px', borderRadius: '24px', background: '#023859', border: '1px solid #26658C' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', letterSpacing: '2px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Palette size={20} color="#54ACBF" /> UI ARCHITECTURE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>Visual Mode</span>
                <div style={{ display: 'flex', gap: '5px', background: '#011C40', padding: '4px', borderRadius: '10px' }}>
                  {['Dark', 'Light'].map(m => (
                    <button key={m} style={{ padding: '5px 15px', borderRadius: '7px', border: 'none', background: config.theme === m ? '#26658C' : 'transparent', color: '#fff', fontSize: '0.7rem', fontWeight: '800' }}>{m.toUpperCase()}</button>
                  ))}
                </div>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>Thermal Unit</span>
                <div style={{ display: 'flex', gap: '5px', background: '#011C40', padding: '4px', borderRadius: '10px' }}>
                  {['Celsius', 'Fahrenheit'].map(u => (
                    <button key={u} style={{ padding: '5px 15px', borderRadius: '7px', border: 'none', background: config.unit === u ? '#26658C' : 'transparent', color: '#fff', fontSize: '0.7rem', fontWeight: '800' }}>{u.toUpperCase()}</button>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* ── 5. User/Profile Settings ── */}
        <motion.section 
          whileHover={{ scale: 1.01 }}
          className="glass-deep" 
          style={{ 
            padding: '35px', 
            borderRadius: '28px', 
            background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(2, 56, 89, 0.4))', 
            border: '1px solid rgba(45, 212, 191, 0.2)', 
            gridColumn: 'span 2',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}
        >
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                 <div className="biolume-pulse" style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#011C40', fontWeight: '900', fontSize: '1.5rem', boxShadow: '0 0 30px rgba(45, 212, 191, 0.4)' }}>
                    H
                 </div>
                 <div>
                    <h4 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: 900, letterSpacing: '-0.5px' }}>HASITHA ADDA</h4>
                    <div style={{ fontSize: '0.7rem', color: 'var(--seafoam)', letterSpacing: '4px', fontWeight: 900, marginTop: '4px' }}>MARITIME ADMINISTRATOR</div>
                 </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout} 
                className="btn-premium" 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.15)', 
                  border: '1px solid rgba(239, 68, 68, 0.6)', 
                  color: '#fff', 
                  padding: '12px 30px',
                  borderRadius: '15px',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  letterSpacing: '1.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)'
                }}
              >
                <LogOut size={16} /> SYSTEM TERMINATION
              </motion.button>
           </div>
        </motion.section>

        {/* ── 6. Data Management ── */}
        <section className="glass-deep" style={{ padding: '35px', borderRadius: '28px', background: 'linear-gradient(145deg, rgba(2, 56, 89, 0.3), rgba(1, 28, 64, 0.5))', border: '1px solid rgba(255, 255, 255, 0.1)', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', letterSpacing: '2px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={20} color="#0ea5e9" /> DATA ARCHIVE
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
             <button className="btn-premium-outline" style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#fff', fontSize: '0.75rem', fontWeight: 900 }}>
                <Download size={16} color="#0ea5e9" /> EXPORT CSV DATA
             </button>
             <button className="btn-premium-outline" style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', color: '#fff', fontSize: '0.75rem', fontWeight: 900 }}>
                <RefreshCcw size={16} color="#0ea5e9" /> CONNECT GOOGLE SHEETS
             </button>
             <button className="btn-premium-outline" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ff8a8a', fontSize: '0.75rem', fontWeight: 900 }}>
                <Trash2 size={16} color="#ef4444" /> PURGE HISTORY
             </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;

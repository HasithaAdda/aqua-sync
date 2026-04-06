import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Activity, 
  Waves, 
  Target,
  Zap,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  Thermometer
} from 'lucide-react';
import dashboardMain from '../../assets/dashboard-preview-main.png';

const DashboardPreview = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <section className="wave-section" style={{ 
      padding: '100px 5% 150px', 
      background: 'radial-gradient(circle at 50% 0%, #001f22 0%, #000c11 100%)', 
      position: 'relative', 
      zIndex: 10,
      overflow: 'hidden'
    }}>
      {/* Background Ambience */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(45, 212, 191, 0.05) 0%, transparent 70%)',
        zIndex: -1
      }} />

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: '3.8rem', color: '#ffffff', marginBottom: '15px', fontWeight: '900', letterSpacing: '2px' }}
          >
            SMART AQUACULTURE CONTROL CENTER
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: '#94a3b8', fontSize: '1.25rem', letterSpacing: '0.5px', opacity: 0.8 }}
          >
            Manage your fishery with real-time AI-driven insights and recommendations.
          </motion.p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)', 
          gap: '40px', 
          alignItems: 'start' 
        }}>
          
          {/* LEFT: Main Interface Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 40px rgba(45, 212, 191, 0.1)',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#001e26'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '20px', 
              left: '25px', 
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              background: 'rgba(0, 245, 212, 0.15)',
              border: '1px solid rgba(0,245,212,0.3)',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)'
            }}>
              <Activity size={14} color="#00f5d4" />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fff', letterSpacing: '1px' }}>
                LIVE OCEAN MONITORING INTERFACE
              </span>
            </div>

            <img 
              src={dashboardMain} 
              alt="High-Fidelity Control Center" 
              style={{ width: '100%', display: 'block', opacity: 0.95 }}
            />
          </motion.div>

          {/* RIGHT: High-Fidelity Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* 1. AI YIELD PREDICTION */}
            <motion.div
              custom={1}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '30px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                 <div>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '4px' }}>AI YIELD PREDICTION</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Best harvest time: <span style={{ color: '#00f5d4', fontWeight: '700' }}>5 days</span></p>
                 </div>
                 <div style={{ background: 'rgba(0, 245, 212, 0.1)', padding: '12px', borderRadius: '12px', color: '#00f5d4' }}>
                    <TrendingUp size={22} />
                 </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Profit Chance</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#00f5d4' }}>HIGH +</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '92%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #00f5d4, #00bbf9)', boxShadow: '0 0 15px rgba(0, 245, 212, 0.4)' }}
                    />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '50px', marginTop: '10px' }}>
                 <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '5px' }}>pH Level</div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.25rem' }}>7.5 <span style={{ fontSize: '0.75rem', color: '#00f5d4', fontWeight: '400', marginLeft: '5px' }}>OPTIMAL</span></div>
                 </div>
                 <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '5px' }}>Salinity</div>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.25rem' }}>34 <span style={{ fontSize: '0.75rem', color: '#00f5d4', fontWeight: '400', marginLeft: '5px' }}>GOOD</span></div>
                 </div>
              </div>
            </motion.div>

            {/* 2. RISK ALERTS */}
            <motion.div
              custom={2}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                background: 'rgba(255, 77, 77, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 77, 77, 0.1)',
                borderRadius: '24px',
                padding: '30px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px' }}>RISK ALERTS</h3>
                <AlertTriangle size={22} color="#ff4d4d" />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#ffb703' }}><Clock size={16} /></div>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>STORM RISK: <span style={{ color: '#00f5d4', fontWeight: '700' }}>LOW</span></span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#ff4d4d' }}><AlertTriangle size={16} /></div>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>OXYGEN DROP: <span style={{ color: '#ff4d4d', fontWeight: '700' }}>POSSIBLE IN 6 HRS</span></span>
                 </div>
              </div>
            </motion.div>

            {/* 3. AI RECOMMENDATION */}
            <motion.div
              custom={3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '30px'
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '25px' }}>AI RECOMMENDATION</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {[
                  "INCREASE AERATION IN NEXT 3 HOURS",
                  "BEST SPECIES: TILAPIA TODAY",
                  "AVOID FISHING TOMORROW (WEATHER RISK)"
                ].map((text, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                  >
                    <CheckCircle2 size={18} color="#00f5d4" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', opacity: 0.85 }}>{text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Live Status Bar in Card Footer */}
              <div style={{ 
                marginTop: '35px', 
                paddingTop: '20px', 
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#94a3b8' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 5px #00f5d4' }}></div> SYSTEM ACTIVE
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#94a3b8' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f5d4', boxShadow: '0 0 5px #00f5d4' }}></div> SENSORS ONLINE
                  </div>
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px' }}>AI RUNNING</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;

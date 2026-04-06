import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Activity, 
  Waves, 
  Target,
  Zap,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import aqua_modern_farming from '../../assets/aqua_modern_farming.png';

const DashboardPreview = () => {
  return (
    <section className="wave-section" style={{ padding: '0 5% 120px', backgroundColor: 'var(--ocean-dark)', position: 'relative', zIndex: 10 }}>
      {/* Wave transition for visual flow */}
      <div className="wave-divider wave-hero-bottom" style={{ top: '-180px', transform: 'rotate(180deg)', zIndex: -1 }}></div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-text"
            style={{ fontSize: '3.5rem', marginBottom: '20px' }}
          >
            Real-Time AI Intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}
          >
            Experience the future of aquaculture with our integrated dashboard. 
            From water quality monitoring to AI-driven yield predictions.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'start' }}>
          {/* Main Dashboard Preview Wrap */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              position: 'relative',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 50px 100px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.02)',
              padding: '20px'
            }}
          >
            <img 
              src={aqua_modern_farming} 
              alt="AI Dashboard Preview" 
              style={{ width: '100%', borderRadius: '20px', opacity: 0.9 }}
            />
            
            {/* Dynamic Overlay Elements */}
            <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', gap: '15px' }}>
              <div style={{ background: 'rgba(45,212,191,0.9)', padding: '10px 20px', borderRadius: '50px', color: '#000', fontWeight: '800', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(45,212,191,0.4)' }}>
                <Activity size={14} /> LIVE MONITORING
              </div>
            </div>
          </motion.div>

          {/* AI Prediction Card (The WOW factor) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '35px',
                borderRadius: '30px',
                boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                <div>
                  <h3 style={{ color: 'var(--seafoam)', fontSize: '1.4rem', marginBottom: '5px' }}>AI YIELD PREDICTION</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Forecast based on current cycles</p>
                </div>
                <div style={{ background: 'rgba(0, 245, 212, 0.1)', padding: '15px', borderRadius: '15px', color: 'var(--seafoam)' }}>
                  <TrendingUp size={24} />
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#fff', opacity: 0.7 }}>OPTIMAL HARVEST PROBABILITY</span>
                  <span style={{ color: 'var(--seafoam)', fontWeight: '800' }}>94.2%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '94.2%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #00f5d4, #00bbf9)' }}
                    />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                 <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '5px' }}>
                        <Waves size={14} /> WATER Q.
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>EXCELLENT</div>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '5px' }}>
                        <ShieldCheck size={14} /> RISK LEVEL
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00f5d4' }}>LOW</div>
                 </div>
              </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
            >
              {[
                { icon: <Target size={20} />, label: 'Accuracy', val: '99.8%' },
                { icon: <Zap size={20} />, label: 'Analysis', val: 'Live' }
              ].map((stat, i) => (
                <div key={i} className="feature-card-premium" style={{ padding: '20px' }}>
                   <div className="feature-card-icon-blob" style={{ width: '45px', height: '45px' }}>
                      {stat.icon}
                   </div>
                   <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff' }}>{stat.val}</div>
                   </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;

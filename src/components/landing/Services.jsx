import React from 'react';
import aboutImg from '../../assets/aqua_modern_farming.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
  const navigate = useNavigate();

  return (
    <section id="features" style={{ 
      backgroundColor: 'var(--ocean-mid)', 
      padding: '120px 5% 120px', 
      position: 'relative',
      zIndex: 5 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '80px', maxWidth: '1400px', margin: '0 auto' }}>
        
        <motion.div 
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ flex: 1 }}
        >
          <div className="about-shape" style={{ overflow: 'hidden', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <img 
              src={aboutImg} 
              alt="Analysis" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block' 
              }} 
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{ flex: 1 }}
        >
          <h2 style={{ fontSize: '4.2rem', marginBottom: '30px', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-2px', color: '#fff' }}>
            PRECISE <br />
            <span className="gradient-text">INSIGHTS</span> <br />
            FOR MODERN HARVEST.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.25rem', lineHeight: '1.7', opacity: 0.8 }}>
            Our system uses advanced GIS mapping and Gemini AI to provide actionable insights. From identifying illegal fishing hotspots to recommending the best species based on water vision analysis, we empower fishermen with technology.
          </p>
          <button 
            className="btn-premium-outline" 
            onClick={() => navigate('/dashboard')}
            style={{ padding: '16px 32px', fontSize: '1rem' }}
          >
            EXPLORE DASHBOARD
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;

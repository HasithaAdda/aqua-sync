import React from 'react';
import { BrainCircuit, Droplet, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesGrid = () => {
  const cards = [
    { 
      title: 'AI FISH PREDICTION', 
      desc: 'Get accurate species recommendations based on water, weather & season.', 
      icon: <BrainCircuit size={32} /> 
    },
    { 
      title: 'WATER MONITORING', 
      desc: 'Analyze temperature, pH, salinity and more in real-time.', 
      icon: <Droplet size={32} fill="currentColor" /> 
    },
    { 
      title: 'REAL-TIME ALERTS', 
      desc: 'Receive instant warnings for weather & water quality risks.', 
      icon: <ShieldAlert size={32} />,
      hasNotif: true
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="feature-card-grid" 
      style={{ width: '90%', maxWidth: '1400px', margin: '-40px auto 0' }}
    >
      {cards.map((card, idx) => (
        <motion.div 
          key={idx} 
          variants={item}
          className="feature-card-premium"
        >
          <div className="feature-card-icon-blob">
            {card.icon}
            {card.hasNotif && <div className="notif-dot"></div>}
          </div>
          <div>
            <div className="feature-card-title">{card.title}</div>
            <div className="feature-card-desc">{card.desc}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturesGrid;

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Droplets, 
  ShieldAlert, 
  Waves,
  ChevronRight
} from 'lucide-react';
import predictionImg from '../../assets/service_prediction.png';
import monitoringImg from '../../assets/service_monitoring.png';
import alertsImg from '../../assets/service_alerts.png';

const FeaturesGrid = () => {
  const services = [
    {
      id: '01',
      title: 'AI FISH PREDICTION',
      desc: 'Get accurate species recommendations based on water, weather & season.',
      icon: <BrainCircuit size={32} />,
      img: predictionImg
    },
    {
      id: '02',
      title: 'WATER MONITORING',
      desc: 'Analyze temperature, pH, salinity and more in real-time.',
      icon: <Droplets size={32} />,
      img: monitoringImg,
      active: true // Middle card has special "Learn More" visibility in reference
    },
    {
      id: '03',
      title: 'REAL-TIME ALERTS',
      desc: 'Receive instant warnings for weather & water quality risks.',
      icon: <ShieldAlert size={32} />,
      img: alertsImg
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="wave-section" style={{ padding: '20px 5% 20px', backgroundColor: '#000c11' }}>
      
      {/* Premium Header */}
      <div className="services-header-premium">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '2.8rem', color: '#fff', fontWeight: '900', letterSpacing: '2px' }}
        >
          OUR SERVICES
        </motion.h2>
        <div className="wave-ornament">
          <span></span>
          <Waves size={20} className="wave-icon-small" />
          <span></span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '10px auto 0', fontSize: '1rem', lineHeight: '1.6' }}
        >
          Precision aquaculture management powered by advanced maritime intelligence and real-time aquatic monitoring.
        </motion.p>
      </div>

      {/* High-Fidelity Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="services-grid-high-fidelity"
      >
        {services.map((service, idx) => (
          <motion.div 
            key={service.id}
            variants={cardVariants}
            className="services-card-vertical"
          >
            {/* Background Image */}
            <img src={service.img} alt={service.title} className="services-card-bg" />
            
            {/* Top Glass Ornament */}
            <div className="services-glass-overlay services-glass-top">
              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--seafoam)', letterSpacing: '2px' }}>
                SERVICE {service.id}
              </span>
            </div>

            {/* Center Icon Ring */}
            <div className="services-icon-center">
              {service.icon}
            </div>

            {/* Bottom Glass Content */}
            <div className="services-glass-overlay services-glass-bottom">
              <h3 className="services-title-premium">{service.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', maxWidth: '80%', marginTop: '10px', lineHeight: '1.4' }}>
                {service.desc}
              </p>
              
              <div className="services-btn-reveal">
                <button className="btn-glass-pill">
                  LEARN MORE
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesGrid;

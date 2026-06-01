import React from 'react';
import { 
  Waves,
  Fish,
  Utensils,
  Bell,
  Dna,
  Activity
} from 'lucide-react';
import predictionImg from '../../assets/service_prediction.png';
import monitoringImg from '../../assets/service_monitoring.png';
import alertsImg from '../../assets/service_alerts.png';
import farmingImg from '../../assets/aqua_modern_farming.png';

const FeaturesGrid = () => {
  const features = [
    {
      id: '01',
      title: 'POND MONITORING',
      desc: 'Real-time tracking of temperature, pH, and dissolved oxygen levels.',
      icon: <Waves size={32} />,
      img: monitoringImg
    },
    {
      id: '02',
      title: 'SPECIES RECOMMENDATION',
      desc: 'AI-driven analysis to recommend the optimal fish species based on environmental parameters.',
      icon: <Dna size={32} />,
      img: farmingImg,
      active: true
    },
    {
      id: '03',
      title: 'DISEASE PREDICTION',
      desc: 'Predict potential health outbreaks before they happen using real-time IoT data and machine learning.',
      icon: <Activity size={32} />,
      img: predictionImg
    },
    {
      id: '04',
      title: 'INSTANT ALERTS',
      desc: 'Immediate 24/7 notifications for critical water parameter changes.',
      icon: <Bell size={32} />,
      img: alertsImg
    }
  ];

  return (
    <section id="features" className="wave-section" style={{ padding: '20px 5% 20px', backgroundColor: '#000c11' }}>
      
      {/* Premium Header */}
      <div className="services-header-premium">
        <h2 style={{ fontSize: '2.8rem', color: '#fff', fontWeight: '900', letterSpacing: '2px' }}>
          OUR FEATURES
        </h2>
        <div className="wave-ornament">
          <span></span>
          <Waves size={20} className="wave-icon-small" />
          <span></span>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '10px auto 0', fontSize: '1rem', lineHeight: '1.6' }}>
          Precision aquaculture management powered by advanced maritime intelligence and real-time aquatic monitoring.
        </p>
      </div>

      {/* High-Fidelity Grid */}
      <div 
        className="services-grid-high-fidelity features-grid-responsive"
      >
        {features.map((feature) => (
          <div 
            key={feature.id}
            className="services-card-vertical"
          >
            {/* Background Image */}
            <img src={feature.img} alt={feature.title} className="services-card-bg" />
            
            {/* Top Glass Ornament */}
            <div className="services-glass-overlay services-glass-top">
              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--seafoam)', letterSpacing: '2px' }}>
                FEATURE {feature.id}
              </span>
            </div>

            {/* Center Icon Ring */}
            <div className="services-icon-center">
              {feature.icon}
            </div>

            {/* Bottom Glass Content */}
            <div 
              className="services-glass-overlay services-glass-bottom"
              style={{ 
                height: '190px', 
                padding: '15px 20px 10px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <h3 
                className="services-title-premium" 
                style={{ 
                  fontSize: '1.1rem', 
                  color: '#fff', 
                  marginBottom: '6px', 
                  fontWeight: '800', 
                  marginTop: '0px', 
                  lineHeight: '1.2',
                  textAlign: 'center'
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', maxWidth: '95%', margin: '4px auto 0', lineHeight: '1.3' }}>
                {feature.desc}
              </p>
              

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;

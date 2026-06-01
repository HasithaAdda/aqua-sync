import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import farmingImg from '../assets/aqua_modern_farming.png';
import underwaterImg from '../assets/contact_underwater.png';

const Hatcheries = () => {
  const hatcheriesList = [
    {
      id: 1,
      name: 'Estuarine Fish Farm',
      location: 'Estuarine Fish Farm, Ela, Dhauji, Old Goa',
      district: 'North Goa',
      status: 'Operational',
      phone: '+91 832 225 6189',
      hours: '09:30 AM - 05:45 PM',
      email: 'dir-fish.goa@nic.in',
      mapUrl: 'https://maps.google.com/maps?q=Estuarine+Fish+Farm+Ela+Dhauji+Old+Goa',
      bgImg: farmingImg,
      details: 'Specializes in estuarine species breeding. Provides high-quality seed/fingerlings of Sea Bass (Chonak), Milk Fish, Mullet, and Pearl Spot (Kalundar) to local farmers at subsidized government rates.'
    },
    {
      id: 2,
      name: 'Directorate of Fisheries Hatchery',
      location: 'Directorate of Fisheries, Dayanand Bandodkar Marg, Panaji, Goa',
      district: 'North Goa',
      status: 'Operational',
      phone: '+91 832 222 4865',
      hours: '09:30 AM - 05:45 PM',
      email: 'dir-fish.goa@nic.in',
      mapUrl: 'https://maps.google.com/maps?q=Directorate+of+Fisheries+Panaji+Goa',
      bgImg: underwaterImg,
      details: 'State central fisheries management and distribution centre. Offers training, technical guidance on stocking density, feed formulation, water management, and distributes quality shrimp and fish seed.'
    }
  ];

  return (
    <div style={{ padding: '30px', color: '#fff', background: 'transparent' }}>
      {/* Removed Header to use Dashboard unified header */}

      {/* Grid */}
      <div className="hatcheries-grid">
        {hatcheriesList.map((hatchery) => (
          <motion.div
            key={hatchery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-deep"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(255, 255, 255, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Banner Image */}
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
              <img 
                src={hatchery.bgImg} 
                alt={hatchery.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0, 12, 17, 0.2), #000c11)' }}></div>
              <div style={{ position: 'absolute', bottom: '15px', left: '20px' }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: '900', 
                  backgroundColor: 'var(--seafoam)', 
                  color: '#000', 
                  padding: '4px 10px', 
                  borderRadius: '30px', 
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  {hatchery.district}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '5px 0 0', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {hatchery.name}
                </h3>
              </div>
            </div>

            {/* Info Body */}
            <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
                {hatchery.details}
              </p>

              {/* Specs Grid */}
              <div className="hatcheries-specs-grid">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Clock size={16} style={{ color: 'var(--seafoam)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>HOURS</div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '600' }}>{hatchery.hours}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--seafoam)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>CERTIFICATION</div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '600' }}>State Fisheries Dept.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} style={{ color: 'var(--seafoam)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>CONTACT</div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '600' }}>{hatchery.phone}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Mail size={16} style={{ color: 'var(--seafoam)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>EMAIL</div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{hatchery.email}</div>
                  </div>
                </div>
              </div>

              {/* Location & Map button */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <MapPin size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.4' }}>
                    {hatchery.location}
                  </span>
                </div>

                <a 
                  href={hatchery.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-premium"
                  style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px',
                    fontSize: '0.8rem',
                    fontWeight: '800'
                  }}
                >
                  NAVIGATE ON GOOGLE MAPS <ExternalLink size={14} />
                </a>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Hatcheries;

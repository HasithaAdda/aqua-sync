import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Waves
} from 'lucide-react';
import contactImg from '../../assets/contact_underwater.png';

const Contact = () => {
  return (
    <section id="contact" style={{ padding: '40px 5%', backgroundColor: '#000c11', position: 'relative' }}>
      
      {/* Centered Heading */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase' }}
        >
          CONTACT US
        </motion.h2>
        <div className="wave-ornament">
          <span></span>
          <Waves size={20} className="wave-icon-small" />
          <span></span>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label className="form-label-premium">FIRST NAME</label>
              <input type="text" className="form-input-premium" />
            </div>
            <div>
              <label className="form-label-premium">LAST NAME</label>
              <input type="text" className="form-input-premium" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label className="form-label-premium">PHONE</label>
              <input type="tel" className="form-input-premium" />
            </div>
            <div>
              <label className="form-label-premium">EMAIL</label>
              <input type="email" className="form-input-premium" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label className="form-label-premium">ADDRESS</label>
              <input type="text" className="form-input-premium" />
            </div>
            <div>
              <label className="form-label-premium">ZIP CODE</label>
              <input type="text" className="form-input-premium" />
            </div>
          </div>

          <div>
            <label className="form-label-premium">MESSAGE</label>
            <textarea 
              className="form-input-premium" 
              rows="4" 
              style={{ resize: 'none' }}
            ></textarea>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input type="checkbox" id="consent" style={{ transform: 'scale(1.2)' }} />
            <label htmlFor="consent" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              By submitting this form, I agree to the privacy policy.
            </label>
          </div>

          <button className="btn-premium" style={{ marginTop: '20px', padding: '12px 40px' }}>
             SEND MESSAGE <Send size={18} />
          </button>
        </motion.div>

        {/* Info Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="feature-card-icon-blob" style={{ width: '40px', height: '40px' }}>
                 <Phone size={20} />
              </div>
              <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '600' }}>
                +91 832 242 0000<br />+91 98765 43210
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="feature-card-icon-blob" style={{ width: '50px', height: '50px' }}>
                 <MapPin size={20} />
              </div>
              <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '600' }}>
                Aqua Sync HQ, Ocean Tower<br />Miramar, Panaji, Goa 403001
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="feature-card-icon-blob" style={{ width: '50px', height: '50px' }}>
                 <Clock size={20} />
              </div>
              <div style={{ color: '#fff', fontSize: '1rem', fontWeight: '600' }}>
                Monday to Friday: 9:00 - 18:00<br />Saturday: 10:00 - 14:00
              </div>
            </div>
          </div>

          <div style={{ 
            width: '100%', 
            height: '350px', 
            borderRadius: '40px', 
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
          }}>
             <img 
               src={contactImg} 
               alt="Underworld" 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
             />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;

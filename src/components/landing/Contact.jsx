import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Clock,
  Send,
  Waves
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import contactImg from '../../assets/contact_underwater.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: ''
      });
      setTimeout(() => setSubmitStatus(null), 5000); // clear success message after 5 seconds
    } catch (error) {
      console.error("Error adding document: ", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{
      padding: '100px 5%',
      backgroundColor: '#000c11',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 70% 30%, #001e26 0%, #000c11 100%)'
    }}>

      {/* Bioluminescent Orbs */}
      <div className="orb-biolume" style={{ top: '-10%', left: '-10%', opacity: 0.5 }}></div>
      <div className="orb-biolume" style={{ bottom: '-10%', right: '10%', opacity: 0.3, width: '600px', height: '600px' }}></div>

      {/* Centered Heading */}
      <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 2 }}>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-text"
          style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '8px', textShadow: '0 0 30px var(--seafoam-glow)' }}
        >
          CONTACT US
        </motion.h2>
        <div className="wave-ornament" style={{ marginTop: '10px' }}>
          <span style={{ background: 'linear-gradient(90deg, transparent, var(--seafoam))' }}></span>
          <Waves size={24} className="wave-icon-small" style={{ color: 'var(--seafoam)' }} />
          <span style={{ background: 'linear-gradient(90deg, var(--seafoam), transparent)' }}></span>
        </div>
      </div>

      <div className="contact-grid-responsive">

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="form-container-premium"
        >
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '10px', letterSpacing: '2px' }}>Get Started Now</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>Your comments help us achieve our objective of being a center of excellence in education. Thank you.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row-responsive">
              <div>
                <label className="form-label-premium">FIRST NAME</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input-premium"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="form-label-premium">LAST NAME</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input-premium"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="form-row-responsive">
              <div>
                <label className="form-label-premium">PHONE</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input-premium"
                  placeholder=""
                />
              </div>
              <div>
                <label className="form-label-premium">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input-premium"
                  placeholder="abc@gmail.com"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label-premium">MESSAGE</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-input-premium"
                rows="4"
                style={{ resize: 'none' }}
                placeholder="Message..."
                required
              ></textarea>
            </div>



            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium"
              style={{ marginTop: '30px', width: '100%', justifyContent: 'center', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'} <Send size={20} />
            </button>
            {submitStatus === 'success' && (
              <p style={{ color: 'var(--seafoam)', marginTop: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
                Transmission successful. Command center has received your query.
              </p>
            )}
            {submitStatus === 'error' && (
              <p style={{ color: '#ff4d4d', marginTop: '15px', textAlign: 'center', fontSize: '0.9rem' }}>
                Transmission failed. Please verify your connection and try again.
              </p>
            )}
          </form>
        </motion.div>

        {/* Info Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="contact-card-premium"
          >
            <div className="feature-card-icon-blob" style={{ background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(0, 187, 249, 0.2))', width: '60px', height: '60px' }}>
              <Phone size={24} style={{ animation: 'pulse-glow 2s infinite' }} />
            </div>
            <div>
              <p style={{ color: 'var(--seafoam)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>CONTACT</p>
              <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>+91 832 242 0000</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="contact-card-premium"
          >
            <div className="feature-card-icon-blob" style={{ background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(0, 187, 249, 0.2))', width: '60px', height: '60px' }}>
              <MapPin size={24} style={{ animation: 'pulse-glow 2s infinite' }} />
            </div>
            <div>
              <p style={{ color: 'var(--seafoam)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>LOCATION</p>
              <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>Ocean Tower, Miramar, Goa</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="contact-card-premium"
          >
            <div className="feature-card-icon-blob" style={{ background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(0, 187, 249, 0.2))', width: '60px', height: '60px' }}>
              <Clock size={24} style={{ animation: 'pulse-glow 2s infinite' }} />
            </div>
            <div>
              <p style={{ color: 'var(--seafoam)', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>TIMINGS</p>
              <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>09:00am - 5:00pm (IST)</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              marginTop: '10px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              height: '240px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000c11, transparent)', zIndex: 1, opacity: 0.6 }}></div>
            <img
              src={contactImg}
              alt="Underworld"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Contact;



import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  MapPin, 
  Activity, 
  Mail, 
  Phone,
  ArrowUpRight,
  Fish,
  Filter
} from 'lucide-react';

const ManageFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'farmer'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFarmers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredFarmers = farmers.filter(f => 
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
         <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0, letterSpacing: '-1px' }}>
               OPERATOR <span style={{ color: '#0ea5e9' }}>DIRECTORY</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '5px', letterSpacing: '1px' }}>
               MANAGEMENT AND OVERSIGHT OF ALL LICENSED PISCICULTURE UNITS
            </p>
         </div>
         <div style={{ display: 'flex', gap: '15px' }}>
            <div className="input-group-premium" style={{ width: '300px' }}>
               <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
               <input 
                 type="text" 
                 placeholder="Search by Email..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 style={{ 
                    padding: '12px 15px 12px 45px', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.08)', 
                    border: '1px solid rgba(255,255,255,0.25)', 
                    color: '#fff',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                 }} 
                 onFocus={(e) => { e.target.style.borderColor = '#0ea5e9'; e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                 onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.25)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}               />
            </div>
            <button className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Filter size={18} /> FILTER
            </button>
         </div>
      </div>

      {loading ? (
        <div style={{ padding: '100px', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
           Synchronizing Fleet Data...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
          {filteredFarmers.map((farmer, i) => (
            <motion.div 
              key={farmer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ delay: i * 0.05 }}
              style={{ 
                 padding: '35px', 
                 borderRadius: '28px', 
                 border: '1px solid rgba(255,255,255,0.1)',
                 background: 'linear-gradient(145deg, rgba(2, 56, 89, 0.3), rgba(1, 28, 64, 0.5))',
                 position: 'relative',
                 overflow: 'hidden',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
            >
               {/* Glow Orb */}
               <div style={{ 
                 position: 'absolute', 
                 top: '-10%', 
                 left: '-10%', 
                 width: '150px', 
                 height: '150px', 
                 background: '#0ea5e9', 
                 opacity: 0.08, 
                 filter: 'blur(50px)', 
                 borderRadius: '50%' 
               }}></div>

               <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '25px', position: 'relative', zIndex: 1 }}>
                  <div className="biolume-pulse" style={{ 
                     width: '65px', 
                     height: '65px', 
                     borderRadius: '20px', 
                     background: 'linear-gradient(135deg, #0ea5e9, #2dd4bf)',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     color: '#011C40',
                     fontWeight: '900',
                     fontSize: '1.4rem',
                     boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)',
                     border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                     {farmer.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                     <h4 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>
                        {farmer.email.split('@')[0].toUpperCase()}
                     </h4>
                     <div className="gradient-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '900', marginTop: '6px', letterSpacing: '1px' }}>
                        <Activity size={12} /> ACTIVE STATUS
                     </div>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px', position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(167, 235, 242, 0.7)', fontSize: '0.9rem', fontWeight: 500 }}>
                     <div style={{ padding: '6px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px' }}><Mail size={16} color="#0ea5e9" /></div> {farmer.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(167, 235, 242, 0.7)', fontSize: '0.9rem', fontWeight: 500 }}>
                     <div style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}><MapPin size={16} color="#ef4444" /></div> Goa Regional Precinct
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(167, 235, 242, 0.7)', fontSize: '0.9rem', fontWeight: 500 }}>
                     <div style={{ padding: '6px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '8px' }}><Fish size={16} color="#2dd4bf" /></div> Ponds Verified: 3 Units
                  </div>
               </div>

               <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                  <button className="btn-premium-outline" style={{ flex: 1, fontSize: '0.75rem', fontWeight: 900, padding: '12px' }}>VIEW TELEMETRY</button>
                  <button className="btn-premium" style={{ width: '50px', padding: 0, justifyContent: 'center', borderRadius: '15px' }}>
                     <ArrowUpRight size={20} />
                  </button>
               </div>

               <div style={{ position: 'absolute', top: '25px', right: '25px', color: '#0ea5e9', opacity: 0.05 }}>
                  <Users size={80} />
               </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ManageFarmers;

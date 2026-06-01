import React, { useState } from 'react';
import { 
  auth, 
  db 
} from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Check,
  Fish,
  LayoutDashboard,
  ArrowRight,
  Shield,
  Zap,
  Waves,
  Droplets,
  Navigation,
  Globe,
  Activity,
  User,
  Eye,
  EyeOff,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import oceanBg from '../assets/underwater_surface_bg.png';
 
const Login = ({ onGuestEntry }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('authority');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    if (onGuestEntry) {
      onGuestEntry(role);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          email: email,
          role: role,
          createdAt: new Date().toISOString()
        });
        
        await updateProfile(user, { displayName: email.split('@')[0] });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          role: role
        }, { merge: true });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root" style={{ 
      minHeight: '100vh', 
      width: '100%',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#000c11',
      backgroundImage: `url(${oceanBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      {/* ── Background Animations ── */}
      
      {/* 1. Cinematic Light Ray Overlays (God Rays) */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            rotate: [15 + i * 5, 20 + i * 5, 15 + i * 5],
            scaleX: [1, 1.2, 1]
          }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-20%',
            left: `${15 + i * 15}%`,
            width: '300px',
            height: '150%',
            background: 'linear-gradient(to bottom, rgba(0, 245, 255, 0.4), transparent)',
            filter: 'blur(100px)',
            transformOrigin: 'top center',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* 2. Enhanced Rising Bubbles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          initial={{ 
            y: '110vh', 
            x: `${Math.random() * 100}vw`, 
            opacity: 0,
            scale: Math.random() * 0.5 + 0.2
          }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.6, 0],
            x: [null, `${(Math.random() - 0.5) * 50}px`]
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity, 
            delay: Math.random() * 20,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(0, 245, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* 3. Subtle Caustic Wave Overlay */}
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 60%, rgba(0, 245, 255, 0.05) 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* 4. Drifting Marine Life Silhouettes */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`fish-${i}`}
          initial={{ x: '-20vw', y: `${30 + i * 15}vh`, opacity: 0 }}
          animate={{ x: '120vw', opacity: [0, 0.05, 0.05, 0] }}
          transition={{ 
            duration: 50 + i * 15, 
            repeat: Infinity, 
            delay: i * 10,
            ease: "linear"
          }}
          style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', filter: 'blur(6px)' }}
        >
          <Fish size={50 + i * 20} color="rgba(0, 245, 255, 0.2)" />
        </motion.div>
      ))}

      {/* ── Main Glass Card ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: 1, 
          y: [0, -10, 0] 
        }}
        transition={{ 
          opacity: { duration: 1 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
        className="login-card-responsive"
      >
        {/* Specular Highlight (The 'Glossy' shine) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Subtle background glow inside card */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, transparent 70%)',
          zIndex: -1
        }} />

        {/* Header Section */}
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <motion.div
            animate={{ filter: ['drop-shadow(0 0 10px #00E5FF)', 'drop-shadow(0 0 25px #00E5FF)', 'drop-shadow(0 0 10px #00E5FF)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ marginBottom: '20px' }}
          >
            <div style={{
              width: '70px',
              height: '70px',
              margin: '0 auto',
              borderRadius: '20px',
              background: 'rgba(0, 18, 30, 0.6)', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid rgba(0, 229, 255, 0.6)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 0 25px rgba(0, 229, 255, 0.2)'
            }}>
              <Fish size={38} color="#00E5FF" />
            </div>
          </motion.div>

          <h1 style={{ 
            fontSize: '2.8rem', 
            fontWeight: '900', 
            background: 'linear-gradient(to bottom, #fff 20%, #00E5FF 80%, #0077FF 100%)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px', 
            letterSpacing: '5px',
            textTransform: 'uppercase',
            margin: '0',
            filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))' 
          }}>
            AQUA SYNC
          </h1>
          <p style={{ 
            color: '#fff', 
            fontSize: '0.85rem', 
            letterSpacing: '4px', 
            fontWeight: '800',
            textTransform: 'uppercase',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
          }}>
            Smart Aquaculture Control System
          </p>
        </div>

        {/* Role Switcher */}
        <div style={{ 
          width: '100%', 
          maxWidth: '500px',
          display: 'flex', 
          background: 'rgba(0, 12, 20, 0.7)', 
          borderRadius: '18px', 
          padding: '5px',
          border: '1px solid rgba(0, 229, 255, 0.4)',
          position: 'relative',
          boxShadow: 'inset 0 4px 15px rgba(0, 0, 0, 0.6)',
          zIndex: 2
        }}>
          <motion.div
            animate={{ x: role === 'authority' ? '0%' : '100%' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: 'absolute',
              width: 'calc(50% - 5px)',
              height: 'calc(100% - 10px)',
              background: 'linear-gradient(135deg, #00E5FF 0%, #0077FF 100%)',
              borderRadius: '14px',
              zIndex: 0,
              boxShadow: '0 8px 25px rgba(0, 229, 255, 0.5)'
            }}
          />
          <button 
            onClick={() => setRole('authority')}
            style={{ 
              flex: 1, 
              padding: '14px', 
              borderRadius: '14px', 
              border: 'none',
              background: 'transparent',
              color: role === 'authority' ? '#fff' : 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              zIndex: 1,
              fontSize: '1rem',
              transition: '0.3s',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
          >
             <Shield size={18} /> Authority
          </button>
          <button 
            onClick={() => setRole('farmer')}
            style={{ 
              flex: 1, 
              padding: '14px', 
              borderRadius: '14px', 
              border: 'none',
              background: 'transparent',
              color: role === 'farmer' ? '#fff' : 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              zIndex: 1,
              fontSize: '1rem',
              transition: '0.3s',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}
          >
            <User size={18} /> Farmer
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAuth} style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 2 }}>
          {error && (
            <div style={{ padding: '12px', background: 'rgba(255, 60, 60, 0.15)', border: '1px solid rgba(255, 60, 60, 0.3)', borderRadius: '12px', color: '#ff6b6b', textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold', backdropFilter: 'blur(5px)' }}>
              {error}
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <User size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#00E5FF' }} />
            <input 
              type="email" 
              placeholder="Username / Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '18px 20px 18px 60px', 
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '1rem',
                outline: 'none',
                background: 'rgba(0, 10, 15, 0.6)', 
                color: '#fff',
                transition: '0.4s',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00E5FF';
                e.target.style.background = 'rgba(0, 229, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(0, 10, 15, 0.6)';
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#00E5FF' }} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '18px 60px 18px 60px', 
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '1rem',
                outline: 'none',
                background: 'rgba(0, 10, 15, 0.6)', 
                color: '#fff',
                transition: '0.4s',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00E5FF';
                e.target.style.background = 'rgba(0, 229, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.background = 'rgba(0, 10, 15, 0.6)';
              }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#00E5FF',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#00E5FF', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '800', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Forgot Password?
            </button>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(0, 229, 255, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '20px', 
              borderRadius: '16px', 
              background: 'linear-gradient(90deg, #00E5FF, #0077FF, #6A00FF)', 
              color: '#fff', 
              fontSize: '1.2rem', 
              fontWeight: '900', 
              border: 'none',
              cursor: 'pointer',
              marginTop: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              transition: '0.4s',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
            }}
          >
            {loading ? (isRegistering ? 'REGISTERING...' : 'LOGGING IN...') : (isRegistering ? 'Register' : 'Login')}
            {!loading && <ArrowRight size={24} />}
          </motion.button>
        </form>

        {/* Footer Section */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '1px'
            }}
          >
            {isRegistering ? 'Already have an account? Log in' : <span>New user? <span style={{ color: '#00E5FF', textDecoration: 'underline' }}>Register</span></span>}
          </button>
          <button 
            type="button"
            onClick={handleContinueAsGuest}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'rgba(255, 255, 255, 0.5)', 
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '1px',
              textDecoration: 'underline',
              marginTop: '5px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#00E5FF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
          >
            Continue as Guest
          </button>
        </div>
      </motion.div>

      {/* Decorative Corner Accents */}
      <div style={{ position: 'absolute', bottom: '40px', left: '40px', color: 'rgba(255, 255, 255, 0.1)', pointerEvents: 'none' }}>
        <Compass size={60} />
      </div>
      <div style={{ position: 'absolute', top: '40px', right: '40px', color: 'rgba(255, 255, 255, 0.1)', pointerEvents: 'none' }}>
        <Activity size={60} />
      </div>
    </div>
  );
};

export default Login;

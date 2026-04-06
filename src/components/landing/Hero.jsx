import React, { useEffect, useRef, useState, useCallback } from 'react';
import oceanBg from '../../assets/ocean-bg.png';
import { 
  Zap, 
  Droplet, 
  ChevronRight, 
  Fish 
} from 'lucide-react';
import heroImg_final from '/C:/Users/addah/.gemini/antigravity/brain/fe295921-fb5e-4bff-864e-eebec8c458e0/media__1775310280822.png';
import { useNavigate } from 'react-router-dom';
import FeaturesGrid from './FeaturesGrid';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';



// ── Realistic Ocean Bubbles Canvas ──
const OceanBubbles = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let bubbles = [];
    const count = 45;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();
    
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height,
        size: Math.random() * 8 + 2,
        speed: Math.random() * 1.2 + 0.4,
        opacity: Math.random() * 0.3 + 0.05,
        swayX: Math.random() * 1.5,
        swaySpeed: Math.random() * 0.02 + 0.005,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += Math.sin(Date.now() * b.swaySpeed + b.offset) * b.swayX;
        
        if (b.y + b.size < -50) {
          b.y = canvas.height + 50;
          b.x = Math.random() * canvas.width;
        }
        
        ctx.beginPath();
        const rad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size);
        rad.addColorStop(0, `rgba(255, 255, 255, ${b.opacity})`);
        rad.addColorStop(0.5, `rgba(255, 255, 255, ${b.opacity * 0.4})`);
        rad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = rad;
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Small glisten highlight
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.8})`;
        ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.1, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, opacity: 0.8 }} />;
};

// ── Fish Breathing Bubbles ──
const FishBreathingBubbles = () => {
  const [bubbles, setBubbles] = useState([]);
  
  useEffect(() => {
    // Emit bubbles in rhythmic bursts to simulate "breathing"
    const interval = setInterval(() => {
      // 70% chance to emit a bubble every 600ms, creating natural irregularity
      if (Math.random() > 0.3) {
        const id = Date.now() + Math.random();
        setBubbles(prev => [...prev, id]);
        // Clean up after animation duration
        setTimeout(() => {
          setBubbles(prev => prev.filter(b => b !== id));
        }, 3000);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'absolute', 
      top: '18%',   /* Moved way up: Mouth is on the top-front of the tilted head */
      left: '5%',   /* Moved left: Mouth is at the very front edge */
      zIndex: 11, 
      pointerEvents: 'none' 
    }}>
      <AnimatePresence>
        {bubbles.map(id => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.1, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 0.9, 0], 
              scale: [0.1, 1, 1.4],
              // Bubbles float away from the mouth (leftward and upward)
              x: [-10, -50 - Math.random() * 50],
              y: [-10, -100 - Math.random() * 80]
            }}
            transition={{ duration: 2.8, ease: "circOut" }}
            style={{
              position: 'absolute',
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.5)',
              border: '0.5px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 0 10px rgba(255,255,255,0.4)',
              backdropFilter: 'blur(1px)'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};



const Hero = () => {
  const navigate   = useNavigate();
  const fishRef    = useRef(null);
  const statsRef   = useRef(null);
  const bgRef      = useRef(null);  // parallax bg layer
  const rafRef     = useRef(null);

  useEffect(() => {
    // ── Scroll-driven parallax on the bg image ──
    const onScroll = () => {
      if (bgRef.current) {
        // Image moves at 40% of scroll → stays behind content
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    const scheduleRAF = () => {
      rafRef.current = requestAnimationFrame(onScroll);
    };
    window.addEventListener('scroll', scheduleRAF, { passive: true });
    onScroll();

    // ── GSAP fish float ──
    if (fishRef.current) {
      gsap.to(fishRef.current, { y: -15, rotation: 2, duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut' });
    }
    if (statsRef.current) {
      gsap.to(statsRef.current, { y: 10, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    return () => {
      window.removeEventListener('scroll', scheduleRAF);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <section
      className="wave-section hero-main-section"
      style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* ── Parallax underwater background image ── */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          top: '-30%',
          left: 0,
          width: '100%',
          height: '160%',
          backgroundImage: `url(${oceanBg})`,
          backgroundSize: '100% auto',   /* fill full width, keep landscape ratio */
          backgroundPosition: 'center 40%', /* anchor the light-ray focal point */
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
          zIndex: 0,
        }}
      />

      {/* ── Background depth layers ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,12,17,0.1) 0%, rgba(0,12,17,0.5) 60%, rgba(0,12,17,0.95) 100%)',
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 40%, transparent 20%, rgba(0,12,17,0.6) 100%)',
      }} />

      <OceanBubbles />


      {/* ── Animated teal god-ray overlay ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="hero-god-ray" style={{
            left: `${10 + i * 14}%`,
            animationDelay: `${i * 0.9}s`,
            opacity: 0.07 + i * 0.01,
            width: `${60 + i * 20}px`,
          }} />
        ))}
      </div>

      {/* ── Floating bioluminescent particles ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {[...Array(28)].map((_, i) => (
          <div key={i} className="ocean-particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${5 + Math.random() * 8}s`,
          }} />
        ))}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', maxWidth: '1400px', margin: '0 auto' }}
      >
        
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginBottom: '100px', gap: '40px' }}>
          
          <div style={{ flex: 1.4, minWidth: '700px' }}>
            <motion.span 
              variants={itemVariants} 
              style={{ color: 'var(--seafoam)', fontSize: '0.9rem', fontWeight: '800', letterSpacing: '2px', display: 'block' }}
            >
              
            </motion.span>
            
            <motion.h1 
              variants={itemVariants}
              style={{ fontSize: '7.5rem', marginTop: '20px', marginBottom: '10px', color: '#ffffff', lineHeight: '0.85', fontWeight: '900', letterSpacing: '-5px' }}
            >
              AQUA <br /> 
              <span className="gradient-text" style={{ paddingRight: '20px' }}> SYNC</span>
            </motion.h1>
            
            <motion.div 
              variants={itemVariants}
              style={{ width: '40px', height: '1px', background: 'var(--seafoam)', margin: '30px 0' }}
            ></motion.div>
            
            <motion.div 
              variants={itemVariants}
              style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '30px', letterSpacing: '1px' }}
            >
              POWERED BY AI <br />
              FOR MODERN FISHERY
            </motion.div>

            
            <motion.p 
              variants={itemVariants}
              style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '480px', marginBottom: '50px', lineHeight: '1.7', opacity: 0.8 }}
            >
              One Solution For Fish Farmers And Authorities
            </motion.p>

            <motion.div 
              variants={itemVariants}
              style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
            >
              <button className="btn-premium" onClick={() => navigate('/dashboard')}>
                <Zap size={20} fill="currentColor" /> GET STARTED
              </button>
              <button className="btn-premium-outline">
                <Droplet size={20} /> ANALYZE WATER
              </button>
              <a href="#features" style={{ color: 'var(--seafoam)', fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
                View Features <ChevronRight size={18} />
              </a>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', marginLeft: '40px' }}
          >
             <div className="fish-container-premium">
                <FishBreathingBubbles />
                <img 
                  ref={fishRef}
                  src={heroImg_final} 
                  alt="Elite Catch" 
                  className="hero-fish-main"
                  style={{ 
                    width: '140%', 
                    zIndex: 10, 
                    position: 'relative', 
                  }} 
                />
             </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          style={{ width: '100%', position: 'relative', zIndex: 100, marginBottom: '-40px' }}
        >
           <FeaturesGrid />
        </motion.div>
      </motion.div>




    </section>
  );
};

export default Hero;

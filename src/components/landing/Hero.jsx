import React, { useEffect, useRef, useState } from 'react';
import oceanBg from '../../assets/ocean-bg.png';
import { 
  Zap, 
  Fish,
  ShieldCheck
} from 'lucide-react';
import heroImg_final from '../../assets/hero-fish.png';
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
        const newBubble = {
          id,
          xTarget: -50 - Math.random() * 50,
          yTarget: -100 - Math.random() * 80,
          size: 4 + Math.random() * 6
        };
        setBubbles(prev => [...prev, newBubble]);
        // Clean up after animation duration
        setTimeout(() => {
          setBubbles(prev => prev.filter(b => b.id !== id));
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
        {bubbles.map(b => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0.1, x: 0, y: 0 }}
            animate={{ 
              opacity: [0, 0.9, 0], 
              scale: [0.1, 1, 1.4],
              // Bubbles float away from the mouth (leftward and upward)
              x: [-10, b.xTarget],
              y: [-10, b.yTarget]
            }}
            transition={{ duration: 2.8, ease: "circOut" }}
            style={{
              position: 'absolute',
              width: `${b.size}px`,
              height: `${b.size}px`,
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



const Hero = ({ onEnterApp }) => {
  const fishRef    = useRef(null);
  const bgRef      = useRef(null);  // parallax bg layer
  const rafRef     = useRef(null);

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParticles(Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        width: 2 + Math.random() * 4,
        height: 2 + Math.random() * 4,
        delay: Math.random() * 8,
        duration: 5 + Math.random() * 8,
      })));
    }, 0);

    // ── Scroll-driven parallax on the bg image ──
    const onScroll = () => {
      if (bgRef.current) {
        // Clamp the translation to prevent exposing the top edge
        const shift = window.scrollY * 0.25; 
        bgRef.current.style.transform = `translateY(${shift}px)`;
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

    return () => {
      clearTimeout(timer);
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
        paddingTop: '60px',
        paddingBottom: '100px',
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
          top: '-50vh',
          left: 0,
          width: '100%',
          height: 'calc(100% + 50vh)',
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
        {particles.map(p => (
          <div key={p.id} className="ocean-particle" style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }} />
        ))}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '90%', maxWidth: '1400px', margin: '0 auto', height: '100%' }}
      >
        
        <div className="hero-content-row">
          
          <div className="hero-text-side">
            <motion.div 
              variants={itemVariants}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'rgba(45, 212, 191, 0.1)',
                border: '1px solid rgba(45, 212, 191, 0.2)',
                borderRadius: '30px',
                marginBottom: '20px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ShieldCheck size={16} color="var(--seafoam)" />
              <span style={{ color: 'var(--seafoam)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1px' }}>
                AI-Powered Management
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="hero-title-giant"
            >
              AQUA <br /> 
              <span className="gradient-text" style={{ paddingRight: '20px' }}> SYNC</span>
            </motion.h1>
            
            <motion.div 
              variants={itemVariants}
              style={{ width: '40px', height: '1px', background: 'var(--seafoam)', margin: '20px 0' }}
            ></motion.div>
            
            <motion.div 
              variants={itemVariants}
              style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '15px', letterSpacing: '1px' }}
            >
              ONE SOLUTION FOR <br />
              FISH FARMERS & AUTHORITIES
            </motion.div>

            
            <motion.p 
              variants={itemVariants}
              style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '400px', marginBottom: '15px', lineHeight: '1.6', opacity: 0.8 }}
            >
              Track water quality, species recommendation, and disease prediction all in one intelligent, real-time dashboard designed for modern pisciculture
            </motion.p>
          </div>


          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hero-image-side"
          >
             <div className="fish-container-premium" style={{ width: '100%', maxWidth: '450px' }}>
                <FishBreathingBubbles />
                <img 
                  ref={fishRef}
                  src={heroImg_final} 
                  alt="Sync Catch" 
                  className="hero-fish-main"
                  style={{ 
                    width: '100%', 
                    zIndex: 10, 
                    position: 'relative', 
                  }} 
                />
             </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="hero-btn-wrapper"
        >
          <button className="btn-premium" onClick={onEnterApp} style={{ padding: '15px 40px', fontSize: '1rem' }}>
            <Zap size={20} fill="currentColor" /> GET STARTED
          </button>
        </motion.div>

        <div 
          style={{ width: '100%', position: 'relative', zIndex: 100, marginBottom: '-40px' }}
        >
           <FeaturesGrid />
        </div>
      </motion.div>




    </section>
  );
};

export default Hero;

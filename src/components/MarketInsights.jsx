import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, X, Activity, TrendingUp, TrendingDown, Info, 
  ShoppingBag, Truck, MapPin, BrainCircuit, Sparkles, 
  Banknote, Waves, Calendar, Clock, Languages
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Import fish assets
import pomfretImg from '../assets/fish/pomfret.png';
import kingfishImg from '../assets/fish/kingfish.png';
import mackerelImg from '../assets/fish/mackerel.png';
import sardinesImg from '../assets/fish/sardines.png';
import tunaImg from '../assets/fish/tuna.png';
import ladyfishImg from '../assets/fish/ladyfish.png';
import bombayDuckImg from '../assets/fish/bombay_duck.png';
import redSnapperImg from '../assets/fish/red_snapper.png';
import seabassImg from '../assets/fish/seabass.png';
import sharkImg from '../assets/fish/mori.png';
import prawnsImg from '../assets/fish/prawns.png';
import crabImg from '../assets/fish/crab.png';
import lobsterImg from '../assets/fish/lobster.png';
import musselsImg from '../assets/fish/mussels.png';
import oysterImg from '../assets/fish/oyster.png';
import squidImg from '../assets/fish/squid.png';

const MARKET_DATA = [
  { 
    id: 'pomfret', name: 'Silver Pomfret', price: 950, img: pomfretImg, trend: 'up', category: 'High Value',
    desc: 'The Silver Pomfret is a top-quality fish very popular in India. It has soft white meat and is expensive in the fish market.',
    marketScore: 9.4, demand: 'Very High', supply: 'Low',
    idealTemp: [26, 30], idealDO: [6.5, 8.0],
    konkani: 'Paplet', marathi: 'Pamplet', habitat: 'Sea', bestSeason: 'Winter', commonArea: 'Varca Beach, Agonda, Palolem Shore', catchTime: '04:00 AM - 07:00 AM', stability: 'STABLE'
  },
  { 
    id: 'kingfish', name: 'Kingfish (Surmai)', price: 850, img: kingfishImg, trend: 'up', category: 'High Value',
    desc: 'Surmai is famous for its firm meat and rich flavor. People always want to buy this fish.',
    marketScore: 9.1, demand: 'Very High', supply: 'Medium',
    idealTemp: [27, 32], idealDO: [6.0, 7.5],
    konkani: 'Iswon', marathi: 'Surmai', habitat: 'Sea', bestSeason: 'Summer', commonArea: 'Deep Sea (off Vasco, Grand Island)', catchTime: '05:00 AM - 08:00 AM', stability: 'RISING'
  },
  { 
    id: 'mackerel', name: 'Indian Mackerel', price: 180, img: mackerelImg, trend: 'stable', category: 'Common Fish',
    desc: 'Bangda is eaten every day. It is healthy and easy to find in most markets.',
    marketScore: 7.8, demand: 'High', supply: 'High',
    idealTemp: [24, 29], idealDO: [5.0, 7.0],
    konkani: 'Bangdo', marathi: 'Bangda', habitat: 'Sea', bestSeason: 'Winter', commonArea: 'Vasco, Margao Coastline', catchTime: '03:00 AM - 06:00 AM', stability: 'STABLE'
  },
  { 
    id: 'sardines', name: 'Sardines (Tarle)', price: 120, img: sardinesImg, trend: 'up', category: 'Common Fish',
    desc: 'Small sardines are important for daily food. Their price changes quickly depending on the season.',
    marketScore: 7.2, demand: 'High', supply: 'Very High',
    idealTemp: [23, 28], idealDO: [5.5, 7.0],
    konkani: 'Tarlo', marathi: 'Tarli', habitat: 'Sea', bestSeason: 'Peak', commonArea: 'Morjim Shore, Palolem Bay', catchTime: '04:00 AM - 08:00 AM', stability: 'RISING'
  },
  { 
    id: 'tuna', name: 'Tuna (Kupa)', price: 450, img: tunaImg, trend: 'down', category: 'Deep Sea',
    desc: 'Tuna is usually sent to big hotels. Right now, there is a lot of Tuna available, so the price is a bit low.',
    marketScore: 8.2, demand: 'Medium', supply: 'High',
    idealTemp: [22, 27], idealDO: [6.0, 8.0],
    konkani: 'Bakado', marathi: 'Tuna', habitat: 'Sea', bestSeason: 'Summer', commonArea: 'Deep Offshore (off Cutbona Jetty)', catchTime: '06:00 AM - 10:00 AM', stability: 'FALLING'
  },
  { 
    id: 'ladyfish', name: 'Ladyfish (Kane)', price: 550, img: ladyfishImg, trend: 'up', category: 'River Fish',
    desc: 'Kane is a thin, tasty fish found in rivers. It is very special and people love it.',
    marketScore: 8.5, demand: 'High', supply: 'Low',
    idealTemp: [26, 30], idealDO: [5.5, 7.5],
    konkani: 'Mudhoshi', marathi: 'Mudoshi', habitat: 'River', bestSeason: 'Winter', commonArea: 'Mandovi Mouth, Zuari Estuary', catchTime: '05:00 AM - 09:00 AM', stability: 'STABLE'
  },
  { 
    id: 'bombay_duck', name: 'Bombay Duck (Bombil)', price: 250, img: bombayDuckImg, trend: 'stable', category: 'Soft Fish',
    desc: 'Bombil is a very soft fish. It is very tasty when fried.',
    marketScore: 7.5, demand: 'Medium', supply: 'Medium',
    idealTemp: [25, 29], idealDO: [5.0, 6.5],
    konkani: 'Bombil', marathi: 'Bombil', habitat: 'Sea', bestSeason: 'Peak', commonArea: 'Arpora, Candolim Coastline', catchTime: '04:00 AM - 07:00 AM', stability: 'STABLE'
  },
  { 
    id: 'red_snapper', name: 'Red Snapper (Tamso)', price: 650, img: redSnapperImg, trend: 'up', category: 'High Value',
    desc: 'Tamso is a bright red fish from the sea. It has firm meat and is a favorite at restaurants.',
    marketScore: 8.8, demand: 'High', supply: 'Medium',
    idealTemp: [26, 31], idealDO: [6.0, 8.0],
    konkani: 'Tamoshi', marathi: 'Tamushi', habitat: 'Sea', bestSeason: 'All-year', commonArea: 'Reis Magos Jetty, Aguada Rocks', catchTime: '05:00 AM - 09:00 AM', stability: 'RISING'
  },
  { 
    id: 'seabass', name: 'Asian Seabass (Chonak)', price: 750, img: seabassImg, trend: 'up', category: 'River Fish',
    desc: 'Chonak is a very good fish found in rivers.',
    marketScore: 9.0, demand: 'Very High', supply: 'Low',
    idealTemp: [26, 32], idealDO: [5.0, 7.5],
    konkani: 'Chonak', marathi: 'Chonak', habitat: 'Brackish', bestSeason: 'Summer', commonArea: 'Mandovi Bridge, Cumbharjua Canal', catchTime: '06:00 AM - 10:00 AM', stability: 'STABLE'
  },
  { 
    id: 'shark', name: 'Shark (Mori)', price: 380, img: sharkImg, trend: 'stable', category: 'Traditional',
    desc: 'Shark meat is used in local curries. It is a good source of food.',
    marketScore: 7.0, demand: 'Medium', supply: 'Medium',
    idealTemp: [24, 30], idealDO: [4.5, 6.5],
    konkani: 'Mori', marathi: 'Mori', habitat: 'Sea', bestSeason: 'All-year', commonArea: 'Deep Sea (off Vengurla Rocks)', catchTime: '04:00 AM - 08:00 AM', stability: 'STABLE'
  },
  { 
    id: 'prawns', name: 'Tiger Prawns', price: 950, img: prawnsImg, trend: 'up', category: 'Shellfish',
    desc: 'Big Tiger Prawns are high quality and everyone wants them.',
    marketScore: 9.5, demand: 'Very High', supply: 'Very Low',
    idealTemp: [28, 33], idealDO: [5.5, 7.5],
    konkani: 'Sungta', marathi: 'Kolambi', habitat: 'Brackish', bestSeason: 'Peak', commonArea: 'Zuari Estuary, Backwaters', catchTime: '05:00 AM - 08:00 AM', stability: 'RISING'
  },
  { 
    id: 'crab', name: 'Mud Crab', price: 680, img: crabImg, trend: 'up', category: 'Shellfish',
    desc: 'Crabs are found in the mangroves. They are a local favorite.',
    marketScore: 8.6, demand: 'High', supply: 'Low',
    idealTemp: [26, 31], idealDO: [4.0, 6.0],
    konkani: 'Kurlo', marathi: 'Kekda', habitat: 'Mangrove', bestSeason: 'Peak', commonArea: 'Chapora River Backwaters', catchTime: '06:00 AM - 09:00 AM', stability: 'STABLE'
  },
  { 
    id: 'lobster', name: 'Lobster', price: 1800, img: lobsterImg, trend: 'stable', category: 'Luxury',
    desc: 'Lobsters are the most expensive seafood. They are usually served in fancy hotels.',
    marketScore: 9.2, demand: 'Medium', supply: 'Very Low',
    idealTemp: [25, 29], idealDO: [6.0, 8.0],
    konkani: 'Shivod', marathi: 'Lobster', habitat: 'Sea', bestSeason: 'Winter', commonArea: 'Rocky Cliffs off Anjuna', catchTime: '04:00 AM - 07:00 AM', stability: 'STABLE'
  },
  { 
    id: 'mussels', name: 'Mussels (Xinaneto)', price: 300, img: musselsImg, trend: 'up', category: 'Shellfish',
    desc: 'Mussels are found on river rocks. They are a common food during the monsoon season.',
    marketScore: 7.4, demand: 'Medium', supply: 'Medium',
    idealTemp: [22, 27], idealDO: [4.5, 6.5],
    konkani: 'Shinaneo', marathi: 'Shinane', habitat: 'Estuary', bestSeason: 'Monsoon', commonArea: 'River Sal Rocks, Mandovi Pillars', catchTime: '05:00 AM - 10:00 AM', stability: 'STABLE'
  },
  { 
    id: 'oyster', name: 'Oyster (Kalva)', price: 400, img: oysterImg, trend: 'up', category: 'Shellfish',
    desc: 'Oysters are collected from the backwaters. They have a special salty taste.',
    marketScore: 8.0, demand: 'High', supply: 'Low',
    idealTemp: [23, 28], idealDO: [4.5, 6.5],
    konkani: 'Kalvam', marathi: 'Kalva', habitat: 'Estuary', bestSeason: 'Peak', commonArea: 'Zuari Riverbed, Backwater Rocks', catchTime: '06:00 AM - 11:00 AM', stability: 'RISING'
  },
  { 
    id: 'squid', name: 'Squid (Mankios)', price: 420, img: squidImg, trend: 'down', category: 'Shellfish',
    desc: 'Squid are used for many dishes. There are a lot of them available right now.',
    marketScore: 7.9, demand: 'Medium', supply: 'High',
    idealTemp: [22, 28], idealDO: [5.5, 7.5],
    konkani: 'Maanki', marathi: 'Squid', habitat: 'Sea', bestSeason: 'Summer', commonArea: 'Varca Shore, Morjim Bay', catchTime: '05:00 AM - 09:00 AM', stability: 'FALLING'
  },
];

const StatRow = ({ icon: Icon, label, value, color = '#f1f5f9' }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '16px 0', 
    borderBottom: '1px solid #f1f5f9' 
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '8px', 
        background: color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <Icon size={16} color="#64748b" />
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#64748b' }}>{label}</span>
    </div>
    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{value}</span>
  </div>
);

const MarketInsights = ({ sensorData }) => {
  const [selectedFish, setSelectedFish] = useState(null);

  const bestCatchList = useMemo(() => {
    const temp = sensorData?.temperature || 28.4;
    const oxygen = sensorData?.dissolvedOxygen || 6.8;

    return MARKET_DATA
      .map(fish => {
        let score = 0;
        if (temp >= fish.idealTemp[0] && temp <= fish.idealTemp[1]) score += 40;
        if (oxygen >= fish.idealDO[0] && oxygen <= fish.idealDO[1]) score += 30;
        if (fish.trend === 'up') score += 10;
        score += fish.marketScore;
        return { ...fish, dynamicScore: score };
      })
      .sort((a, b) => b.dynamicScore - a.dynamicScore)
      .slice(0, 8);
  }, [sensorData]);

  const getHarvestRecommendation = (fish) => {
    const isPriceUp = fish.trend === 'up';
    const isOxygenHigh = (sensorData?.dissolvedOxygen || 6.8) > 6.5;
    
    if (isPriceUp && isOxygenHigh) return { 
      action: 'BEST TIME TO SELL', 
      color: '#10b981', 
      msg: `Market prices for ${fish.name} are going up. Water conditions are perfect now. You should sell.` 
    };
    if (fish.trend === 'down') return { 
      action: 'WAIT TO SELL', 
      color: '#f59e0b', 
      msg: `There is a lot of ${fish.name} in the market right now. Wait for the price to go up.` 
    };
    return { 
      action: 'CHECKING GROWTH', 
      color: '#0ea5e9', 
      msg: `Your fish are growing well. Demand for ${fish.name} is steady.` 
    };
  };

  const dynamicPriceHistory = useMemo(() => {
    if (!selectedFish) return [];
    const idSeed = selectedFish.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 7 }, (_, i) => {
      const x = Math.sin(idSeed + i) * 10000;
      const randomFactor = 0.9 + (x - Math.floor(x)) * 0.2;
      return {
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        price: Math.round(selectedFish.price * randomFactor)
      };
    });
  }, [selectedFish]);

  return (
    <div style={{ 
      background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)', 
      minHeight: '100%', 
      padding: '40px',
      fontFamily: "'Inter', sans-serif",
      color: '#0f172a'
    }}>
      
      {/* TODAY'S BEST CATCH */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
           <h2 style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '2px', color: '#1e293b', textTransform: 'uppercase' }}>TODAY'S BEST CATCH</h2>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(14, 165, 233, 0.1)', padding: '8px 15px', borderRadius: '50px' }}>
              <Sparkles size={14} color="#0ea5e9" />
              <span style={{ fontSize: '0.66rem', fontWeight: '900', color: '#0ea5e9' }}>BEST DAILY CATCH</span>
           </div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', margin: '0 -40px', paddingLeft: '40px' }}>
          {bestCatchList.map((fish) => (
            <motion.div 
              key={fish.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedFish(fish)}
              style={{ minWidth: '180px', background: '#fff', borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', cursor: 'pointer' }}
            >
              <img src={fish.img} alt={fish.name} style={{ width: '100px', height: '80px', objectFit: 'contain', marginBottom: '15px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#334155', textAlign: 'center' }}>{fish.name}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#0ea5e9' }}>₹{fish.price}/kg</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FULL GRID */}
      <section>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: '40px' }}>Market Intelligence</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '30px', maxWidth: '1400px', margin: '0 auto' }}>
          {MARKET_DATA.map((fish) => (
            <motion.div key={fish.id} whileHover={{ scale: 1.02 }} style={{ background: '#fff', borderRadius: '32px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '30px', color: '#334155' }}>{fish.name}</h3>
              <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
                <img src={fish.img} alt={fish.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <button 
                onClick={() => setSelectedFish(fish)} 
                style={{ background: 'transparent', border: '2px solid #0ea5e9', borderRadius: '12px', padding: '12px 24px', color: '#0ea5e9', fontWeight: '900' }}
              >
                &gt; See Details
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MODAL (Portal for true fullscreen/no-clip) */}
      {selectedFish && createPortal(
        <AnimatePresence>
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedFish(null)} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              style={{ width: '90%', maxWidth: '1000px', maxHeight: '90vh', background: '#fff', borderRadius: '40px', position: 'relative', zIndex: 10001, display: 'flex', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}
            >
              
              {/* Left Panel: Preview & Chart */}
              <div style={{ width: '340px', background: '#f8fafc', padding: '40px 30px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #f1f5f9', flexShrink: 0 }}>
                 <div style={{ background: '#fff', padding: '25px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                    <img src={selectedFish.img} alt={selectedFish.name} style={{ width: '240px', height: '180px', objectFit: 'contain' }} />
                 </div>
                 
                 <div style={{ width: '100%', marginBottom: '25px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: '900', color: '#64748b', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Price History (7 Days)</div>
                    <div style={{ height: '140px', width: '100%' }}>
                       <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={dynamicPriceHistory}>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" hide />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="price" stroke="#0ea5e9" fill="url(#colorPrice)" strokeWidth={3} />
                         </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div style={{ background: selectedFish.trend === 'down' ? '#fff1f2' : '#f0fdf4', padding: '18px', borderRadius: '24px', border: `1px solid ${selectedFish.trend === 'down' ? '#fecdd3' : '#bbf7d0'}`, marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>₹{selectedFish.price}<span style={{ fontSize: '0.75rem', opacity: 0.5 }}>/kg</span></div>
                       <div style={{ color: selectedFish.trend === 'up' ? '#10b981' : (selectedFish.trend === 'stable' ? '#64748b' : '#f43f5e'), fontWeight: '900', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {selectedFish.trend === 'up' && <TrendingUp size={12} />}
                          {selectedFish.trend === 'down' && <TrendingDown size={12} />}
                          {selectedFish.trend === 'stable' && <Activity size={12} />}
                          {selectedFish.trend.toUpperCase()}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Panel: Detailed Intelligence */}
              <div style={{ flex: 1, padding: '50px 60px', overflowY: 'auto' }}>
                <button onClick={() => setSelectedFish(null)} style={{ position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f1f5f9', borderRadius: '50%', padding: '10px', cursor: 'pointer', zIndex: 10002 }}><X size={20} color="#64748b" /></button>
                
                <div style={{ position: 'absolute', top: '35px', right: '85px', background: '#fff1f2', color: '#f43f5e', padding: '6px 12px', borderRadius: '8px', fontSize: '0.55rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid #fecdd3', zIndex: 10002 }}>
                   <TrendingDown size={12} />
                   {selectedFish.stability}
                </div>

                <div style={{ marginBottom: '35px', paddingTop: '10px' }}>
                  <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-1.2px', marginBottom: '8px', lineHeight: 1.1 }}>{selectedFish.name}</h2>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
                    <span><strong style={{ color: '#0ea5e9' }}>Konkani:</strong> {selectedFish.konkani}</span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span><strong style={{ color: '#0ea5e9' }}>Marathi:</strong> {selectedFish.marathi}</span>
                  </div>
                </div>

                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '35px' }}>{selectedFish.desc}</p>

                {/* Stats Dashboard */}
                <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '32px', padding: '8px 25px', marginBottom: '35px' }}>
                   <StatRow icon={Banknote} label="Market Price" value={`₹${selectedFish.price}/kg`} color="rgba(16, 185, 129, 0.1)" />
                   <StatRow icon={Waves} label="Habitat" value={selectedFish.habitat} color="rgba(14, 165, 233, 0.1)" />
                   <StatRow icon={Calendar} label="Best Season" value={selectedFish.bestSeason} color="rgba(245, 158, 11, 0.1)" />
                   <StatRow icon={MapPin} label="Common Area" value={selectedFish.commonArea} color="rgba(244, 63, 94, 0.1)" />
                   <StatRow icon={Clock} label="Catch Time" value={selectedFish.catchTime} color="rgba(139, 92, 246, 0.1)" />
                </div>

                <div style={{ background: '#f0f9ff', padding: '30px', borderRadius: '32px', border: '1px solid #e0f2fe' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <BrainCircuit size={18} color="#0ea5e9" />
                      <div style={{ fontWeight: '900', color: '#0f172a', fontSize: '0.75rem', letterSpacing: '1px' }}>AI HARVEST GUIDE</div>
                   </div>
                   <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0, fontWeight: '500', fontStyle: 'italic' }}>
                     "{getHarvestRecommendation(selectedFish).msg}"
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default MarketInsights;

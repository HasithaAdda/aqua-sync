import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, ChevronRight, ArrowLeft, Phone, Mail, X,
  MapPin, Map as MapIcon, FileText, CheckCircle, Clock, XCircle, FileWarning, TrendingUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MOCK_FARMS = [
  {
    id: "FRM-2024-001",
    name: "Goa Smart Prawn Farm",
    owner: "Rajesh Sharma",
    location: "Calangute, Bardez",
    status: "Active",
    phone: "+91 98765 43210",
    email: "rajesh.sharma@example.com",
    lat: 15.5406,
    lng: 73.7562,
    docs: [
      { name: "License", status: "Verified" },
      { name: "Land Ownership", status: "Verified" },
      { name: "Pollution Certificate", status: "Verified" },
    ]
  },
  {
    id: "FRM-2024-002",
    name: "Khazan Traditional Farm",
    owner: "Sandeep Naik",
    location: "Divar, Tiswadi",
    status: "Pending Approval",
    phone: "+91 98765 43211",
    email: "sandeep.n@example.com",
    lat: 15.5122,
    lng: 73.9161,
    docs: [
      { name: "License", status: "Pending" },
      { name: "Land Ownership", status: "Verified" },
    ]
  },
  {
    id: "FRM-2024-003",
    name: "Mandovi Cage Culture",
    owner: "Anthony Fernandes",
    location: "Panjim, Tiswadi",
    status: "Inactive",
    phone: "+91 98765 43212",
    email: "anthony.f@example.com",
    lat: 15.4909,
    lng: 73.8278,
    docs: [
      { name: "License", status: "Expired" },
    ]
  },
  {
    id: "FRM-2024-004",
    name: "Zuari Biofloc Unit",
    owner: "Preeti Singh",
    location: "Cortalim, Mormugao",
    status: "Rejected",
    phone: "+91 98765 43213",
    email: "preeti.s@example.com",
    lat: 15.4057,
    lng: 73.9221,
    docs: [
      { name: "License", status: "Rejected" },
    ]
  }
];

const MOCK_METRICS = {
  temp: {
    label: 'TEMPERATURE',
    unit: '°C',
    data: [
      { time: '02/13', value: 28.5 },
      { time: '02/14', value: 29.1 },
      { time: '02/15', value: 27.8 },
      { time: '02/16', value: 26.5 },
      { time: '02/17', value: 28.0 },
    ]
  },
  ph: {
    label: 'pH LEVEL',
    unit: '',
    data: [
      { time: '02/13', value: 7.2 },
      { time: '02/14', value: 7.4 },
      { time: '02/15', value: 7.3 },
      { time: '02/16', value: 7.8 },
      { time: '02/17', value: 7.5 },
    ]
  },
  do: {
    label: 'DISSOLVED OXYGEN',
    unit: 'mg/L',
    data: [
      { time: '02/13', value: 5.1 },
      { time: '02/14', value: 5.4 },
      { time: '02/15', value: 5.0 },
      { time: '02/16', value: 4.8 },
      { time: '02/17', value: 5.5 },
    ]
  }
};

const getStatusColor = (status) => {
  if (status === 'Active') return '#10b981'; // Green
  if (status === 'Pending Approval' || status === 'Pending') return '#f59e0b'; // Orange
  if (status === 'Inactive') return '#6b7280'; // Gray
  if (status === 'Rejected' || status === 'Expired') return '#ef4444'; // Red
  return '#3b82f6';
};

const FarmRegistry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFarm, setSelectedFarm] = useState(location.state?.selectedFarm || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('temp');
  const [showAddModal, setShowAddModal] = useState(false);
  const [firebaseFarms, setFirebaseFarms] = useState([]);
  const [newFarm, setNewFarm] = useState({ name: '', owner: '', location: '', lat: '', lng: '', status: 'Pending Approval' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'farms'), (snapshot) => {
      const farms = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.name && data.name !== 'Unknown Farm') {
          farms.push({ ...data, location: data.location || data.address });
        }
      });
      setFirebaseFarms(farms);
    });
    return () => unsub();
  }, []);

  const handleAddFarm = async () => {
    if (!newFarm.name || !newFarm.owner || !newFarm.location) {
      alert("Please fill out Name, Owner, and Location.");
      return;
    }
    const newId = `FRM-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const farmData = {
      id: newId,
      name: newFarm.name,
      owner: newFarm.owner,
      address: newFarm.location,
      location: newFarm.location,
      lat: parseFloat(newFarm.lat) || 0,
      lng: parseFloat(newFarm.lng) || 0,
      status: newFarm.status,
      phone: "N/A", email: "N/A",
      docs: [
        { name: "License", status: "Pending" },
        { name: "Land Ownership", status: "Pending" }
      ]
    };
    try {
      await setDoc(doc(collection(db, 'farms'), newId), farmData);
      setShowAddModal(false);
      setNewFarm({ name: '', owner: '', location: '', lat: '', lng: '', status: 'Pending Approval' });
    } catch (e) {
      console.error(e);
      alert("Error adding farm");
    }
  };

  const allFarmsData = [...MOCK_FARMS, ...firebaseFarms];
  const uniqueFarms = Array.from(new Map(allFarmsData.map(item => [item.id, item])).values());

  const filteredFarms = uniqueFarms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          farm.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'All') return matchesSearch;
    if (filter === 'Active') return matchesSearch && farm.status === 'Active';
    if (filter === 'Pending') return matchesSearch && farm.status === 'Pending Approval';
    if (filter === 'Inactive') return matchesSearch && (farm.status === 'Inactive' || farm.status === 'Rejected');
    return matchesSearch;
  });

  return (
    <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto', width: '100%', color: '#fff' }}>
      <AnimatePresence mode="wait">
        {!selectedFarm ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >

            {/* Search and Action */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="text" 
                  placeholder="Search by Name or Owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '14px 14px 14px 45px', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}>
                <Plus size={18} /> Add Farm
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
              {['All', 'Active', 'Pending', 'Inactive'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '50px',
                    background: filter === f ? 'rgba(14, 165, 233, 0.2)' : 'transparent',
                    border: filter === f ? '1px solid #0ea5e9' : '1px solid rgba(255,255,255,0.1)',
                    color: filter === f ? '#0ea5e9' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    transition: 'all 0.2s'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredFarms.map((farm, idx) => (
                <motion.div 
                  key={farm.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedFarm(farm)}
                  style={{
                    padding: '30px', 
                    borderRadius: '24px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'linear-gradient(145deg, rgba(2, 56, 89, 0.3), rgba(1, 28, 64, 0.5))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                    e.currentTarget.style.borderColor = '#0ea5e9';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5), 0 0 25px rgba(14, 165, 233, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Glow Orb */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '-20%', 
                    left: '-10%', 
                    width: '120px', 
                    height: '120px', 
                    background: getStatusColor(farm.status), 
                    opacity: 0.05, 
                    filter: 'blur(40px)', 
                    borderRadius: '50%' 
                  }}></div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                    <div className="biolume-pulse" style={{ 
                      width: '55px', 
                      height: '55px', 
                      borderRadius: '16px', 
                      background: 'linear-gradient(135deg, #0ea5e9, #2dd4bf)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#011C40',
                      fontWeight: '900',
                      fontSize: '1.2rem',
                      boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {farm.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '6px' }}>{farm.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#0ea5e9', fontWeight: '700' }}>{farm.owner}</span> • {farm.location}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
                    <div style={{ 
                      padding: '6px 14px', 
                      borderRadius: '50px', 
                      fontSize: '0.75rem', 
                      fontWeight: '800',
                      color: getStatusColor(farm.status),
                      background: `${getStatusColor(farm.status)}15`,
                      border: `1px solid ${getStatusColor(farm.status)}30`
                    }}>
                      {farm.status}
                    </div>
                    <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
                  </div>
                </motion.div>
              ))}
              
              {filteredFarms.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
                  No farms found matching your criteria.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Detail Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <button 
                onClick={() => setSelectedFarm(null)}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  letterSpacing: '1px'
                }}
              >
                <ArrowLeft size={16} /> BACK
              </button>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0 }}>{selectedFarm.name}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Top Info Card */}
              <div className="glass-deep" style={{ padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.3), rgba(1, 28, 64, 0.5))', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: '1px', marginBottom: '4px' }}>
                      FARM ID: {selectedFarm.id}
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{selectedFarm.owner}</div>
                  </div>
                  <div style={{ 
                    padding: '6px 14px', 
                    borderRadius: '50px', 
                    fontSize: '0.75rem', 
                    fontWeight: '800',
                    color: getStatusColor(selectedFarm.status),
                    background: `${getStatusColor(selectedFarm.status)}15`,
                    border: `1px solid ${getStatusColor(selectedFarm.status)}30`
                  }}>
                    {selectedFarm.status}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                    <Phone size={16} color="rgba(255,255,255,0.4)" /> {selectedFarm.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                    <Mail size={16} color="rgba(255,255,255,0.4)" /> {selectedFarm.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                    <MapPin size={16} color="rgba(255,255,255,0.4)" /> {selectedFarm.location}
                  </div>
                </div>
              </div>

              {/* GIS & Location */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#fff', fontWeight: '800', letterSpacing: '1px' }}>
                  <MapPin size={18} color="#ef4444" /> GIS & Location
                </div>
                <div className="glass-deep" style={{ padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.3), rgba(1, 28, 64, 0.5))', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginBottom: '25px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: '1px' }}>LATITUDE</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{selectedFarm.lat}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: '1px' }}>LONGITUDE</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{selectedFarm.lng}</div>
                    </div>
                  </div>
                  <button 
                    className="btn-premium" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}
                    onClick={() => navigate('/dashboard/map', { state: { farm: selectedFarm } })}
                  >
                    <MapIcon size={18} /> View on GIS Map
                  </button>
                </div>
              </div>

              {/* Real-time Trends */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#fff', fontWeight: '800', letterSpacing: '1px' }}>
                  <TrendingUp size={18} color="#f59e0b" /> Real-time Trends
                </div>
                <div className="glass-deep" style={{ padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.3), rgba(1, 28, 64, 0.5))', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '2px' }}>
                      {MOCK_METRICS[selectedMetric].label} {MOCK_METRICS[selectedMetric].unit && `(${MOCK_METRICS[selectedMetric].unit})`}
                    </div>
                    <select 
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: '#fff', 
                        padding: '6px 12px', 
                        borderRadius: '8px',
                        outline: 'none'
                      }}
                    >
                      <option value="temp" style={{ color: '#000' }}>Temperature</option>
                      <option value="ph" style={{ color: '#000' }}>pH Level</option>
                      <option value="do" style={{ color: '#000' }}>Dissolved Oxygen</option>
                    </select>
                  </div>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_METRICS[selectedMetric].data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#f59e0b', fontWeight: '800' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#fff', fontWeight: '800', letterSpacing: '1px' }}>
                  <FileText size={18} color="#0ea5e9" /> Documents
                </div>
                <div className="glass-deep" style={{ padding: '25px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, rgba(2, 56, 89, 0.3), rgba(1, 28, 64, 0.5))', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                  {selectedFarm.docs.map((doc, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '16px 20px', 
                      background: 'rgba(255,255,255,0.02)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', fontWeight: '600' }}>
                        <FileText size={16} color="#0ea5e9" />
                        {doc.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '800', color: getStatusColor(doc.status) }}>
                        {doc.status === 'Verified' && <CheckCircle size={14} />}
                        {doc.status === 'Pending' && <Clock size={14} />}
                        {(doc.status === 'Expired' || doc.status === 'Rejected') && <XCircle size={14} />}
                        {doc.status}
                      </div>
                    </div>
                  ))}
                  {selectedFarm.docs.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                      No documents uploaded yet.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Farm Modal matching the requested UI */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '600px', background: '#F8FAFC', padding: '30px', borderRadius: '16px', color: '#333', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Add Farm</h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}><X size={24}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  placeholder="Farm Name" value={newFarm.name} onChange={e => setNewFarm({...newFarm, name: e.target.value})}
                  style={{ width: '100%', padding: '14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#fff' }} 
                />
                <input 
                  placeholder="Owner Name" value={newFarm.owner} onChange={e => setNewFarm({...newFarm, owner: e.target.value})}
                  style={{ width: '100%', padding: '14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#fff' }} 
                />
                
                <div style={{ position: 'relative' }}>
                  <input 
                    placeholder="Farm Location / Address" value={newFarm.location} onChange={e => setNewFarm({...newFarm, location: e.target.value})}
                    style={{ width: '100%', padding: '14px', paddingRight: '45px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#fff' }} 
                  />
                  <MapIcon size={20} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#3b82f6' }} />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <input 
                    placeholder="Latitude" type="number" value={newFarm.lat} onChange={e => setNewFarm({...newFarm, lat: e.target.value})}
                    style={{ flex: 1, padding: '14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#fff' }} 
                  />
                  <input 
                    placeholder="Longitude" type="number" value={newFarm.lng} onChange={e => setNewFarm({...newFarm, lng: e.target.value})}
                    style={{ flex: 1, padding: '14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1rem', outline: 'none', background: '#fff' }} 
                  />
                </div>

                <div style={{ position: 'relative', marginTop: '4px' }}>
                   <label style={{ position: 'absolute', top: '-10px', left: '10px', background: '#fff', padding: '0 4px', fontSize: '0.8rem', color: '#64748B' }}>Status</label>
                   <select 
                     value={newFarm.status} onChange={e => setNewFarm({...newFarm, status: e.target.value})}
                     style={{ width: '100%', padding: '14px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1rem', outline: 'none', appearance: 'none', background: '#fff' }}
                   >
                     <option>Active</option>
                     <option>Pending Approval</option>
                     <option>Inactive</option>
                     <option>Rejected</option>
                   </select>
                   <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #64748B' }}></div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    style={{ flex: 1, padding: '14px', background: '#F8FAFC', border: '1px solid #22c55e', color: '#16a34a', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddFarm}
                    style={{ flex: 1, padding: '14px', background: '#F0FDF4', border: '1px solid #F0FDF4', color: '#16a34a', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    Add Farm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmRegistry;

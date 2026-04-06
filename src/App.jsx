import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import LandingPage from './components/LandingPage';
import DashboardShell from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ hotspots: 0, reports: 0, farmers: 128 });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const qHotspots = query(collection(db, 'complaints'), where('status', '==', 'Action Taken'));
    const unsubHotspots = onSnapshot(qHotspots, (snap) => setStats(prev => ({ ...prev, hotspots: snap.size })));

    const qReports = query(collection(db, 'complaints'));
    const unsubReports = onSnapshot(qReports, (snap) => setStats(prev => ({ ...prev, reports: snap.size })));

    return () => {
      unsubscribe();
      unsubHotspots();
      unsubReports();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--ocean-dark)' }}>
        <div style={{ color: 'var(--seafoam)', fontFamily: 'Outfit', fontSize: '1.2rem', letterSpacing: '2px' }} className="float-anim">
          SYNCHRONIZING MARITIME INTELLIGENCE...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <LandingPage user={user} onEnterApp={() => navigate('/dashboard')} />
      } />
      <Route path="/dashboard/*" element={
        <DashboardShell user={user} stats={stats} />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

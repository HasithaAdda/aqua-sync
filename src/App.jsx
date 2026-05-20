import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import LandingPage from './components/LandingPage';
import DashboardShell from './components/Dashboard';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const [stats, setStats] = useState({ hotspots: 0, reports: 0, farmers: 128 });
  const navigate = useNavigate();

  const handleGuestEntry = (selectedRole) => {
    // Set role and guest status firmly to avoid listener overrides
    const guestRole = selectedRole || 'farmer';
    setRole(guestRole);
    setIsGuest(true);
    navigate('/dashboard');
  };

  useEffect(() => {
    let unsubUserDoc = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsGuest(false);
        setUser(currentUser);
        
        unsubUserDoc = onSnapshot(doc(db, 'users', currentUser.uid), (userDoc) => {
          if (userDoc.exists()) {
            setRole(userDoc.data().role || 'farmer');
          } else {
            setRole('farmer');
            setDoc(doc(db, 'users', currentUser.uid), {
              email: currentUser.email,
              role: 'farmer'
            });
          }
        });
      } else {
        setUser(null);
        if (unsubUserDoc) {
          unsubUserDoc();
          unsubUserDoc = null;
        }
        // CRITICAL: Only wipe role if NOT currently a guest
        // This prevents the null user state from clearing a guest's selected role
        setRole(prevRole => (isGuest ? prevRole : null));
      }
    });

    const qHotspots = query(collection(db, 'complaints'), where('status', '==', 'Action Taken'));
    const unsubHotspots = onSnapshot(qHotspots, (snap) => setStats(prev => ({ ...prev, hotspots: snap.size })));

    const qReports = query(collection(db, 'complaints'));
    const unsubReports = onSnapshot(qReports, (snap) => setStats(prev => ({ ...prev, reports: snap.size })));

    return () => {
      unsubscribe();
      if (unsubUserDoc) unsubUserDoc();
      unsubHotspots();
      unsubReports();
    };
  }, [isGuest]); // Re-run if isGuest changes to ensure role logic holds



  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsGuest(false);
      setRole(null);
      setUser(null);
      navigate('/', { replace: true });
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <LandingPage user={user || isGuest} onEnterApp={() => navigate((user || isGuest) ? '/dashboard' : '/login')} />
      } />
      <Route path="/login" element={
        (user || isGuest) ? <Navigate to="/dashboard" replace /> : <Login onGuestEntry={handleGuestEntry} />
      } />
      <Route path="/dashboard/*" element={
        (user || isGuest) ? <DashboardShell user={user} role={role} stats={stats} onLogout={handleLogout} /> : <Navigate to="/" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

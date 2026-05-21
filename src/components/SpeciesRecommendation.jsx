import React, { useState } from 'react';
import { Activity, Wifi, BarChart2, OfflineBolt, ImageOff } from 'lucide-react';
import { getSpeciesRecommendations } from '../services/predictionService';

const SpeciesRecommendation = ({ sensorData }) => {
  const [speciesPredictions, setSpeciesPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentTemp = sensorData?.temperature ?? 28.0;
  const currentPh = sensorData?.ph ?? 7.5;
  const currentSalinity = sensorData?.salinity ?? 10.0;
  const currentTurbidity = sensorData?.turbidity ?? 25.0;

  const handlePredict = async () => {
    setLoading(true);
    try {
      const recommendations = await getSpeciesRecommendations(currentTemp, currentPh, currentSalinity, currentTurbidity);
      
      const formattedRecommendations = recommendations.map((rec) => ({
         id: rec.species.toLowerCase().replace(' ', '-'),
         name: rec.species,
         score: rec.score,
         status: rec.status,
         isLocalFallback: rec.isLocalFallback
      }));
      
      setSpeciesPredictions(formattedRecommendations);
    } catch (err) {
      console.error("Error fetching species:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Highly Suitable': return '#4caf50'; // green
      case 'Suitable': return '#8bc34a'; // lightGreen
      case 'Moderately Suitable': return '#ff9800'; // orange
      default: return '#f44336'; // red
    }
  };

  const getImageForSpecies = (species) => {
    switch (species.toLowerCase()) {
      case 'whiteleg shrimp': return '/assets/images/whiteleg_shrimp.png';
      case 'tiger shrimp': return '/assets/images/tiger_shrimp.png';
      case 'tilapia': return '/assets/images/tilapia.png';
      case 'catfish': return '/assets/images/catfish.png';
      case 'milkfish': return '/assets/images/milkfish.png';
      default: return null;
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8fafc',
      height: '100%',
      width: '100%',
      fontFamily: "'Inter', sans-serif",
      color: '#1e293b',
      overflowY: 'auto'
    }}>
      {/* AppBar */}
      <div style={{ 
        backgroundColor: '#1e3a8a', 
        padding: '16px 24px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        AI Species Prediction
      </div>

      <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Input Section */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Live IoT Parameters</h2>
            <div style={{ 
              backgroundColor: '#e8f5e9', 
              border: '1px solid #4caf50',
              borderRadius: '12px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Wifi size={14} color="#4caf50" />
              <span style={{ color: '#4caf50', fontSize: '0.75rem', fontWeight: 'bold' }}>Live</span>
            </div>
          </div>
          
          <p style={{ color: '#757575', fontSize: '0.85rem', marginTop: 0, marginBottom: '20px' }}>
            These values are streaming live from your farm's sensors via Firebase.
          </p>

          <ReadonlySlider label="Temperature (°C)" value={currentTemp} min={15} max={45} />
          <ReadonlySlider label="pH Level" value={currentPh} min={0} max={14} />
          <ReadonlySlider label="Salinity (ppt)" value={currentSalinity} min={0} max={40} />
          <ReadonlySlider label="Turbidity (NTU)" value={currentTurbidity} min={0} max={100} />
        </div>

        {/* Predict Button */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button 
            onClick={handlePredict}
            disabled={loading}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? (
              <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            ) : (
              <BarChart2 size={20} />
            )}
            {loading ? 'Analyzing...' : 'Predict Best Species'}
          </button>
        </div>

        {/* Recommendations */}
        {speciesPredictions.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '12px' }}>
              Recommended Species
            </h2>
            
            {speciesPredictions.map((rec) => {
              const badgeColor = getStatusColor(rec.status);
              const imgPath = getImageForSpecies(rec.name);

              return (
                <div key={rec.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
                      {rec.name}
                    </h3>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2563eb' }}>
                      Score: {rec.score.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '8px' }}>
                    <div style={{
                      backgroundColor: badgeColor + '1A', // 10% opacity
                      border: `1px solid ${badgeColor}`,
                      borderRadius: '8px',
                      padding: '6px 10px',
                      color: badgeColor,
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {rec.status}
                    </div>
                    {rec.isLocalFallback && (
                      <OfflineBolt size={20} color="#ff9800" title="Local Fallback Used" />
                    )}
                  </div>

                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    {imgPath ? (
                      <img 
                        src={imgPath} 
                        alt={rec.name} 
                        style={{ height: '180px', objectFit: 'contain', borderRadius: '12px' }} 
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div style={{ 
                      display: imgPath ? 'none' : 'flex', 
                      height: '180px', 
                      backgroundColor: '#e0e0e0',
                      borderRadius: '12px',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#757575'
                    }}>
                      <ImageOff size={40} />
                      <span style={{ marginTop: '8px', fontSize: '0.9rem' }}>Image not found</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        /* Reset slider default styles for readonly effect */
        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
        }
        input[type=range]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

const ReadonlySlider = ({ label, value, min, max }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ position: 'relative', width: '100%', height: '4px', backgroundColor: 'rgba(37, 99, 235, 0.2)', borderRadius: '2px' }}>
        <div style={{ 
          position: 'absolute', 
          height: '100%', 
          backgroundColor: '#2563eb', 
          borderRadius: '2px',
          width: `${Math.max(0, Math.min(100, percentage))}%`
        }} />
        <div style={{
          position: 'absolute',
          width: '16px',
          height: '16px',
          backgroundColor: '#2563eb',
          borderRadius: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          left: `${Math.max(0, Math.min(100, percentage))}%`
        }} />
      </div>
    </div>
  );
};

export default SpeciesRecommendation;

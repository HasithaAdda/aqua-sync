import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { MOCK_FARMS } from './mockFarms';

import { 
    Satellite,
    Map as MapIcon,
    Droplet,
    Thermometer,
    Waves,
    Wind,
    Cpu,
    Filter,
    Activity,
    Shield,
    Fish,
    Maximize,
    Navigation,
    Target,
    MapPin
} from 'lucide-react';

// --- TACTICAL DESIGN TOKENS (MATCHING SCREENSHOT) ---
const COLORS = {
  crz: '#ef4444', // Red
  bs: '#f59e0b',  // Orange/Yellow
  sn: '#8b5cf6',  // Purple
  fish: '#0ea5e9', // Blue
  safety: '#10b981', // Green
  background: '#f8fafc',
  border: '#e2e8f0',
  text: '#1e293b'
};

const SHORT_TAGS = {
    'Fishing in Banned Area (CRZ / Protected Zone)': 'CRZ',
    'Fishing During Ban Season': 'BS',
    'Using Illegal Small Nets': 'SN',
    'Suspicious Night Fishing': 'NF',
    'Dumping Trash or Oil': 'DT/O'
};

// --- CUSTOM MARKERS (L.divIcon) ---
const HOTSPOT_ICON_CACHE = {};
const getHotspotIcon = (color, tag) => {
    const key = `${color}-${tag}`;
    if (!HOTSPOT_ICON_CACHE[key]) {
        HOTSPOT_ICON_CACHE[key] = L.divIcon({
            className: 'tactical-hotspot-icon',
            html: `
                <div class="hotspot-wrapper" style="background-color: ${color}">
                    <span class="hotspot-tag">${tag}</span>
                    <div class="hotspot-glow" style="background-color: ${color}"></div>
                </div>
            `,
            iconSize: [45, 45],
            iconAnchor: [22, 22]
        });
    }
    return HOTSPOT_ICON_CACHE[key];
};

const selectedFarmIcon = L.divIcon({
    className: 'tactical-selected-farm-icon',
    html: `
        <div class="selected-farm-wrapper" style="z-index: 9999 !important;">
            <span style="font-size: 22px;">🐟</span>
            <div class="selected-farm-glow"></div>
        </div>
    `,
    iconSize: [45, 45],
    iconAnchor: [22, 22]
});

const standardFarmIcon = L.divIcon({
    className: 'tactical-farm-icon',
    html: `
        <div class="standard-farm-wrapper" style="width: 35px; height: 35px; background: #3b82f6; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1000;">
            <span style="font-size: 16px;">🐟</span>
        </div>
    `,
    iconSize: [35, 35],
    iconAnchor: [17, 17]
});





function MapEvents({ coordinatesRef }) {
    useMapEvents({ 
        mousemove(e) { 
            if (coordinatesRef.current) {
                coordinatesRef.current.innerText = `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
            }
        } 
    });
    return null;
}

export default function MapDashboard({ userLocation }) {
    const location = useLocation();
    const navigate = useNavigate();
    const farmState = location.state?.farm;

    const effectiveLocation = farmState ? { lat: farmState.lat, lng: farmState.lng } : userLocation;

    const [incidents, setIncidents] = useState([]);
    const [mapMode, setMapMode] = useState('street');
    const [activeLayers, setActiveLayers] = useState(['hotspots', 'farms']);
    const coordinatesRef = useRef(null);

    const [firebaseFarms, setFirebaseFarms] = useState([]);
    const markerRef = useRef(null);

    // Sub-component to handle map re-centering
    const MapController = ({ lat, lng }) => {
        const map = useMap();
        useEffect(() => {
            if (lat && lng) {
                map.flyTo([lat, lng], map.getZoom());
            }
        }, [lat, lng, map]);
        return null;
    };

    useEffect(() => {
        const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIncidents(data);
        });
        return () => unsubscribe();
    }, []);

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

    const allFarms = useMemo(() => {
        const combined = [...MOCK_FARMS, ...firebaseFarms];
        return Array.from(new Map(combined.map(item => [item.id, item])).values());
    }, [firebaseFarms]);

    useEffect(() => {
        if (farmState && markerRef.current) {
            // Wait for map to fly to location before opening popup
            setTimeout(() => {
                if (markerRef.current) markerRef.current.openPopup();
            }, 500);
        }
    }, [farmState]);

    const toggleLayer = (layer) => {
        setActiveLayers(prev => 
            prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
        );
    };

    return (
        <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#e5e7eb' }}>
            
            <MapContainer
                center={[effectiveLocation?.lat || 15.425, effectiveLocation?.lng || 73.81]} 
                zoom={14}
                style={{ flex: 1, width: '100%' }}
                zoomControl={false}
            >
                <MapController lat={effectiveLocation?.lat} lng={effectiveLocation?.lng} />
                {mapMode === 'street' ? (
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap" />
                ) : (
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Esri" />
                )}

                <MapEvents coordinatesRef={coordinatesRef} />

                {/* ── 0. SELECTED FARM ── */}
                {farmState && (
                    <Marker
                        position={[farmState.lat, farmState.lng]}
                        eventHandlers={{ click: () => navigate('/dashboard/registry', { state: { selectedFarm: farmState } }) }}
                        icon={selectedFarmIcon}
                        zIndexOffset={10000}
                        ref={(r) => { if (r && !r.isPopupOpen()) r.openPopup() }}
                    >
                        <Popup className="custom-farm-popup">
                            <div style={{ minWidth: '220px', fontFamily: 'sans-serif', color: '#1a2b22' }}>
                                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', fontWeight: '500', color: '#1a2b22' }}>{farmState.name}</h3>
                                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Owner: {farmState.owner}</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Status: {farmState.status}</p>
                                <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Lat: {farmState.lat}, Lng: {farmState.lng}</p>
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', gap: '15px' }}>
                                    <button 
                                        onClick={(e) => {
                                            const closeBtn = e.target.closest('.leaflet-popup').querySelector('.leaflet-popup-close-button');
                                            if (closeBtn) closeBtn.click();
                                        }}
                                        style={{ background: 'transparent', border: 'none', color: '#335340', cursor: 'pointer', fontSize: '0.9rem' }}
                                    >Close</button>
                                    <button 
                                        onClick={() => navigate('/dashboard/registry', { state: { selectedFarm: farmState } })}
                                        style={{ 
                                            background: '#e9ede0', 
                                            border: '1px solid #c0cbb8', 
                                            color: '#335340', 
                                            padding: '8px 12px', 
                                            borderRadius: '8px', 
                                            fontWeight: 'bold', 
                                            cursor: 'pointer', 
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                            textTransform: 'uppercase',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        VIEW MORE DETAILS
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* ── 1. HOTSPOT LAYERS (INCIDENTS) ── */}
                {activeLayers.includes('hotspots') && incidents.map((incident) => {
                    if (!incident.location) return null;
                    const tag = SHORT_TAGS[incident.activityType] || 'INC';
                    const statusColor = incident.status === 'Pending' ? '#ef4444' : (incident.status === 'Investigating' ? '#f59e0b' : '#2dd4bf');
                    
                    return (
                        <React.Fragment key={incident.id}>
                            <Marker
                                position={[incident.location.latitude, incident.location.longitude]}
                                icon={getHotspotIcon(statusColor, tag)}
                            >
                                <Popup>
                                    <div style={{ padding: '8px', minWidth: '150px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 900, color: statusColor, background: `${statusColor}22`, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                                {incident.status}
                                            </span>
                                        </div>
                                        <h4 style={{ color: '#1e293b', margin: '0 0 5px', fontSize: '0.9rem', fontWeight: 800 }}>{incident.activityType}</h4>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>{incident.description}</p>
                                        <div style={{ marginTop: '10px', fontSize: '0.65rem', color: '#64748b' }}>
                                            Vessel: {incident.vesselType}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}

                {/* ── 2. ALL FARMS LAYER ── */}
                {activeLayers.includes('farms') && allFarms.map((farm) => {
                    if (farmState && farmState.id === farm.id) return null;
                    return (
                        <Marker
                            key={farm.id}
                            position={[farm.lat, farm.lng]}
                            icon={standardFarmIcon}
                        >
                            <Popup className="custom-farm-popup">
                                <div style={{ minWidth: '220px', fontFamily: 'sans-serif', color: '#1a2b22' }}>
                                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', fontWeight: '500', color: '#1a2b22' }}>{farm.name}</h3>
                                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Owner: {farm.owner}</p>
                                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Status: {farm.status}</p>
                                    <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>Lat: {farm.lat}, Lng: {farm.lng}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', gap: '15px' }}>
                                        <button 
                                            onClick={(e) => {
                                                const closeBtn = e.target.closest('.leaflet-popup').querySelector('.leaflet-popup-close-button');
                                                if (closeBtn) closeBtn.click();
                                            }}
                                            style={{ background: 'transparent', border: 'none', color: '#335340', cursor: 'pointer', fontSize: '0.9rem' }}
                                        >Close</button>
                                        <button 
                                            onClick={() => navigate('/dashboard/registry', { state: { selectedFarm: farm } })}
                                            style={{ 
                                                background: '#e9ede0', 
                                                border: '1px solid #c0cbb8', 
                                                color: '#335340', 
                                                padding: '8px 12px', 
                                                borderRadius: '8px', 
                                                fontWeight: 'bold', 
                                                cursor: 'pointer', 
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                textTransform: 'uppercase',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            VIEW MORE DETAILS
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

            </MapContainer>

            {/* ── RIGHT UI CONTROLS (STACK) ── */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ControlBox 
                    icon={<Satellite size={18} />} 
                    label="Satellite" 
                    isActive={mapMode === 'satellite'} 
                    onClick={() => setMapMode('satellite')} 
                />
                <ControlBox 
                    icon={<MapIcon size={18} />} 
                    label="Map" 
                    isActive={mapMode === 'street'} 
                    onClick={() => setMapMode('street')} 
                />
                <div style={{ height: '10px' }}></div>
                <ControlBox 
                    icon={<Activity size={18} />} 
                    label="Hotspots" 
                    isActive={activeLayers.includes('hotspots')} 
                    color={COLORS.crz}
                    onClick={() => toggleLayer('hotspots')} 
                />
                <ControlBox 
                    icon={<MapPin size={18} />} 
                    label="Farms" 
                    isActive={activeLayers.includes('farms')} 
                    color="#3b82f6"
                    onClick={() => toggleLayer('farms')} 
                />
            </div>

            {/* ── BOTTOM TELEMETRY BAR ── */}
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '35px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.7rem', fontWeight: '800' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={12} color="#94a3b8" />
                    <span ref={coordinatesRef}>{(effectiveLocation?.lat || 15.42000).toFixed(5)}, {(effectiveLocation?.lng || 73.80000).toFixed(5)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Target size={12} color="#94a3b8" />
                        <span>Scale: 1 : 250,000</span>
                    </div>
                </div>
            </div>

            <style>{`
                .tactical-hotspot-icon { background: none !important; border: none !important; }
                .hotspot-wrapper {
                    width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); position: relative; z-index: 2;
                }
                .hotspot-tag { color: #fff; font-size: 0.65rem; font-weight: 900; letter-spacing: -0.5px; }
                .hotspot-glow {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%;
                    filter: blur(8px); opacity: 0.4; z-index: -1; transform: scale(1.2);
                }

                .tactical-selected-farm-icon { background: none !important; border: none !important; }
                .selected-farm-wrapper {
                    width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    border: 3px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.4); position: relative; z-index: 1000;
                    background: #10b981; 
                }
                .selected-farm-glow {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%;
                    filter: blur(10px); opacity: 0.6; z-index: -1; transform: scale(1.3); background: #10b981;
                }

                .custom-farm-popup .leaflet-popup-content-wrapper,
                .custom-farm-popup .leaflet-popup-tip {
                    background: #e9ede0;
                    color: #1a2b22;
                }
                .custom-farm-popup .leaflet-popup-content {
                    margin: 15px;
                }

                .tactical-fish-icon { background: none !important; border: none !important; }
                .fish-icon-outer {
                    width: 40px; height: 40px; border-radius: 50%; background: #0ea5e9;
                    display: flex; align-items: center; justify-content: center; border: 3px solid #fff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                }
                .fish-icon-inner { color: #fff; display: flex; align-items: center; justify-content: center; }

                .safety-wrapper {
                    width: 40px; height: 40px; border-radius: 50%; background: #fff;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15); border: 2.5px solid #10b981;
                }

                .hud-control-btn {
                    width: 65px; height: 65px; background: #fff; border-radius: 12px;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    border: none; cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1); gap: 6px;
                }
                .hud-control-btn.active { background: #f1f5f9; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05); }
                .hud-control-btn:hover { transform: scale(1.05); }
                .hud-label { font-size: 0.6rem; font-weight: 800; color: #64748b; }
            `}</style>
        </div>
    );
}

function ControlBox({ icon, label, isActive, onClick, color }) {
    return (
        <button 
            className={`hud-control-btn ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div style={{ color: isActive ? (color || '#1e293b') : '#94a3b8', transition: '0.2s' }}>
                {icon}
            </div>
            <span className="hud-label" style={{ color: isActive ? '#1e293b' : '#94a3b8' }}>{label.toUpperCase()}</span>
            {isActive && color && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: color, borderRadius: '50%' }}></div>
            )}
        </button>
    );
}

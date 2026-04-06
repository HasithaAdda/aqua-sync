import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Layers, AlertTriangle } from 'lucide-react';

const activityStyles = {
    'Fishing in Banned Area (CRZ / Protected Zone)': { tag: 'CRZ', color: '#ef4444' }, // red
    'Fishing During Ban Season': { tag: 'BS', color: '#f97316' }, // orange
    'Using Illegal Small Nets': { tag: 'SN', color: '#8b5cf6' }, // purple
    'Suspicious Night Fishing': { tag: 'NF', color: '#6366f1' }, // indigo
    'Dumping Trash or Oil': { tag: 'DT/O', color: '#a8a29e' }, // brown
    'Other': { tag: 'OTH', color: '#14b8a6' }, // teal
};

export default function MapDashboard() {
    const [incidents, setIncidents] = useState([]);
    const [isSatellite, setIsSatellite] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'complaints'), where('status', '==', 'Action Taken'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIncidents(data);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--glass-border)' }}>
            <MapContainer
                center={[15.4989, 73.8278]}
                zoom={11}
                style={{ height: '100%', width: '100%', background: '#0b0f19' }}
                zoomControl={false}
            >
                {isSatellite ? (
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="Esri World Imagery"
                    />
                ) : (
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution="&copy; OpenStreetMap & CartoDB"
                    />
                )}

                {incidents.map((incident) => {
                    if (!incident.location) return null;
                    const { latitude, longitude } = incident.location;
                    const activity = incident.activityType || 'Other';
                    const styleInfo = activityStyles[activity] || activityStyles['Other'];

                    return (
                        <CircleMarker
                            key={incident.id}
                            center={[latitude, longitude]}
                            radius={10}
                            pathOptions={{
                                fillColor: styleInfo.color,
                                fillOpacity: 0.8,
                                color: '#ffffff',
                                weight: 2
                            }}
                        >
                            <Popup className="glass-popup">
                                <div style={{ fontFamily: 'Inter' }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: styleInfo.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <AlertTriangle size={16} />
                                        {activity}
                                    </h4>
                                    <p style={{ margin: '4px 0', fontSize: '0.9rem' }}><strong>Vessel:</strong> {incident.vesselType}</p>
                                    {incident.aiAnalysis?.isHotspot && (
                                        <span className="badge badge-danger">AI Hotspot</span>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Layer Control */}
            <div className="glass-panel" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1000, padding: '8px', display: 'flex', gap: '8px' }}>
                <button
                    className={`btn ${!isSatellite ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setIsSatellite(false)}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                    <Layers size={14} /> Dark
                </button>
                <button
                    className={`btn ${isSatellite ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setIsSatellite(true)}
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                    <Layers size={14} /> Satellite
                </button>
            </div>

        </div>
    );
}

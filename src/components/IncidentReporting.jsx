import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    User,
    MapPin,
    Image as ImageIcon,
    Mic,
    AlertCircle,
    History,
    CheckCircle,
    Clock,
    Shield,
    ChevronRight,
    Phone,
    Ship,
    AlertTriangle,
    X,
    Navigation,
    Target,
    Camera
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, GeoPoint, orderBy, doc, updateDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const VESSEL_TYPES = [
    'Large Net Fishing Boat (Trawler)',
    'Small Local Boat',
    'Speedboat / Motorboat',
    'Large Cargo / Transfer Ship',
    'Unknown / Other Boat'
];

const ACTIVITY_TYPES = [
    'Fishing in Banned Area (CRZ / Protected Zone)',
    'Fishing During Ban Season',
    'Using Illegal Small Nets',
    'Suspicious Night Fishing',
    'Dumping Trash or Oil'
];

// Gemini AI Setup
const genAI = new GoogleGenerativeAI('AIzaSyANLBtNn6ynJCTdC6-TDkSXpS5ggpXCfxM', { apiVersion: 'v1' });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Custom Leaflet Marker
const createCustomMarker = () => L.divIcon({
    className: 'custom-location-marker',
    html: `<div style="width: 20px; height: 20px; background: #0284c7; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 0 10px rgba(2,132,199,0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
});

function LocationPicker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });
    return position ? <Marker position={[position.lat, position.lng]} icon={createCustomMarker()} /> : null;
}

export default function IncidentReporting({ role, userLocation }) {
    const [formData, setFormData] = useState({
        isAnonymous: false,
        phone: '',
        vesselType: '',
        activityType: '',
        description: '',
        locationName: '',
        lat: userLocation?.lat || 15.4989,
        lng: userLocation?.lng || 73.8278
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [myReports, setMyReports] = useState([]);
    
    // Media & Speech States
    const [imagePreview, setImagePreview] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef(null);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);

    // Fetch location suggestions from Nominatim (OpenStreetMap)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!formData.locationName || formData.locationName.length < 3) {
                setLocationSuggestions([]);
                return;
            }

            setIsSearchingLocation(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.locationName)}&limit=5`
                );
                const data = await response.json();
                setLocationSuggestions(data);
            } catch (error) {
                console.error("Error fetching location suggestions:", error);
            } finally {
                setIsSearchingLocation(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(debounceTimer);
    }, [formData.locationName]);

    const handleSuggestionClick = (suggestion) => {
        setFormData(prev => ({
            ...prev,
            locationName: suggestion.display_name,
            lat: parseFloat(suggestion.lat),
            lng: parseFloat(suggestion.lon)
        }));
        setLocationSuggestions([]);
    };

    // Update location when userLocation prop changes
    useEffect(() => {
        if (userLocation?.lat && userLocation?.lng) {
            setFormData(prev => ({
                ...prev,
                lat: userLocation.lat,
                lng: userLocation.lng
            }));
        }
    }, [userLocation]);

    // Fetch reports
    useEffect(() => {
        const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyReports(docs);
        });
        return () => unsubscribe();
    }, []);

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            const reportRef = doc(db, 'complaints', reportId);
            await updateDoc(reportRef, { status: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error updating status.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // -- IMAGE HANDLING --
    const handleImageClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // -- SPEECH RECOGNITION --
    const toggleSpeechRecognition = () => {
        if (isRecording) {
            setIsRecording(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setFormData(prev => ({
                ...prev,
                description: prev.description ? `${prev.description} ${transcript}` : transcript
            }));
        };
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
        };
        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    const runAIAnalysis = async (data) => {
        try {
            const prompt = `
        You are an AI analyst for a Maritime Authority. Analyze this incident:
        Activity: ${data.activityType}
        Vessel: ${data.vesselType}
        Description: ${data.description}
        
        Output JSON:
        {
          "priority": "High|Medium|Low",
          "category": "string",
          "isHotspot": boolean,
          "summary": "1 sentence"
        }
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().trim();
            if (text.startsWith('\`\`\`json')) text = text.substring(7, text.length - 3).trim();
            return JSON.parse(text);
        } catch (error) {
            return { priority: "Medium", category: data.activityType, isHotspot: false, summary: "Automated analysis pending." };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.activityType || !formData.vesselType || !formData.description) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const reportData = {
                ...formData,
                location: new GeoPoint(formData.lat, formData.lng),
                status: 'Pending',
                timestamp: serverTimestamp(),
                reporterName: formData.isAnonymous ? 'Anonymous' : 'Web User',
                hasImage: !!imagePreview,
                aiAnalysis: { priority: "Processing...", summary: "AI Analysis in progress..." }
            };

            const docRef = await addDoc(collection(db, 'complaints'), reportData);
            
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
            
            setFormData(prev => ({
                ...prev,
                vesselType: '',
                activityType: '',
                description: '',
                locationName: '',
            }));
            setImagePreview(null);

            runAIAnalysis(formData).then(async (aiAnalysis) => {
                const reportRef = doc(db, 'complaints', docRef.id);
                await updateDoc(reportRef, { aiAnalysis });
            });

        } catch (error) {
            alert("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter reports based on role
    const displayedReports = role === 'authority' 
        ? myReports 
        : myReports.filter(r => r.status === 'Action Taken' || r.status === 'Investigating');

    return (
        <>
            {role === 'authority' ? (
                <div style={{ 
                    height: '100%', 
                    width: '100%', 
                    padding: '24px', 
                    background: '#f0f4f8', 
                    fontFamily: "'Inter', sans-serif",
                    overflowY: 'auto'
                }}>
                    <div style={{ 
                        maxWidth: '1400px',
                        margin: '0 auto',
                        background: '#ffffff', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                        display: 'flex', 
                        flexDirection: 'column',
                        minHeight: 'calc(100vh - 48px)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ padding: '24px 40px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '10px', color: '#0284c7' }}>
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: 800 }}>Maritime Authority Intelligence Log</h2>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Monitor and manage all incoming distress signals and suspicious activity reports.</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>{myReports.length}</div>
                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Signals</div>
                            </div>
                        </div>

                        <div style={{ padding: '40px' }}>
                            {myReports.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
                                    <History size={64} style={{ opacity: 0.2, margin: '0 auto 20px' }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No reports recorded in the system.</h3>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                                    {myReports.map((report) => (
                                        <motion.div
                                            key={report.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '16px',
                                                padding: '24px',
                                                background: '#f8fafc',
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '16px',
                                                transition: 'transform 0.2s, box-shadow 0.2s'
                                            }}
                                            whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }}
                                        >
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: report.status === 'Action Taken' ? '#22c55e' : report.status === 'Investigating' ? '#f59e0b' : '#0284c7' }} />
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', marginBottom: '4px' }}>
                                                        {report.vesselType}
                                                    </div>
                                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                                                        {report.activityType}
                                                    </h4>
                                                </div>
                                                <span style={{ 
                                                    background: report.status === 'Action Taken' ? '#dcfce7' : report.status === 'Investigating' ? '#fef3c7' : '#e0f2fe',
                                                    color: report.status === 'Action Taken' ? '#166534' : report.status === 'Investigating' ? '#92400e' : '#0284c7',
                                                    padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700
                                                }}>
                                                    {report.status}
                                                </span>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', color: '#475569', background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <User size={14} color="#94a3b8" /> {report.reporterName || 'Anonymous'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Clock size={14} color="#94a3b8" /> {report.timestamp?.toDate()?.toLocaleDateString() || 'Recently'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: 'span 2' }}>
                                                    <MapPin size={14} color="#94a3b8" /> {report.locationName || 'Location Not Specified'}
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, flex: 1 }}>
                                                <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>Report Details:</strong>
                                                {report.description}
                                            </div>

                                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                                {['Pending', 'Investigating', 'Action Taken'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(report.id, status)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px 4px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 800,
                                                            borderRadius: '8px',
                                                            border: '1px solid #e2e8f0',
                                                            background: report.status === status ? '#0284c7' : '#fff',
                                                            color: report.status === status ? '#fff' : '#64748b',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            textTransform: 'uppercase'
                                                        }}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ 
                    height: '100%', 
                    width: '100%', 
                    display: 'flex', 
                    gap: '24px', 
                    padding: '24px', 
                    background: '#f0f4f8', 
                    fontFamily: "'Inter', sans-serif",
                    overflow: 'hidden'
                }}>
                    
                    {/* LEFT SIDE: REPORT FORM */}
                    <div style={{ 
                        flex: '0 0 65%', 
                        background: '#ffffff', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                        display: 'flex', 
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0'
                    }}>
                        {/* Header */}
                        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '8px', color: '#0284c7' }}>
                                <AlertCircle size={20} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>Report Incident</h2>
                        </div>

                        {/* Form Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                            {isSuccess ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <CheckCircle size={64} color="#0284c7" style={{ margin: '0 auto 20px' }} />
                                    <h3 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '10px' }}>Report Submitted Successfully</h3>
                                    <p style={{ color: '#64748b' }}>Your report has been sent to the maritime authorities.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    
                                    {/* Safety Alert */}
                                    <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '16px 20px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <Shield size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', lineHeight: 1.5 }}>
                                            Your safety is our priority. If you feel threatened, please submit the report anonymously. Do not approach suspicious vessels directly.
                                        </p>
                                    </div>

                                    {/* Anonymous Toggle */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <Shield size={20} color="#64748b" />
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Submit Anonymously</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Your name will be hidden from the authorities.</div>
                                            </div>
                                        </div>
                                        <label className="switch" style={{ margin: 0 }}>
                                            <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleInputChange} />
                                            <span className="slider round" style={{ background: formData.isAnonymous ? '#0284c7' : '#cbd5e1' }}></span>
                                        </label>
                                    </div>

                                    {/* Contact Number */}
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Contact Number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
                                        />
                                    </div>

                                    {/* Vessel Information Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Vessel Information</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <Ship size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                                <select
                                                    name="vesselType"
                                                    value={formData.vesselType}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#0f172a', outline: 'none', appearance: 'none', background: '#fff' }}
                                                >
                                                    <option value="">Vessel Type</option>
                                                    {VESSEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <AlertTriangle size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                                <select
                                                    name="activityType"
                                                    value={formData.activityType}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#0f172a', outline: 'none', appearance: 'none', background: '#fff' }}
                                                >
                                                    <option value="">Type of Suspicious Activity</option>
                                                    {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </div>
                                            <textarea
                                                name="description"
                                                placeholder="Additional Details / Description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                style={{ width: '100%', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#0f172a', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Evidence Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Evidence</h3>
                                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
                                        <div 
                                            onClick={handleImageClick}
                                            style={{ 
                                                width: '100%', 
                                                border: '1px dashed #cbd5e1', 
                                                background: '#f8fafc', 
                                                borderRadius: '8px', 
                                                padding: imagePreview ? '8px' : '40px 20px',
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {imagePreview ? (
                                                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <img src={imagePreview} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button 
                                                        type="button" onClick={removeImage}
                                                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '6px', color: '#fff', cursor: 'pointer' }}
                                                    ><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Camera size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                                                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Tap to take a photo of the vessel</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Voice Evidence Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Voice Evidence</h3>
                                        <div 
                                            onClick={toggleSpeechRecognition}
                                            style={{ 
                                                width: '100%', 
                                                border: `1px solid ${isRecording ? '#0284c7' : '#cbd5e1'}`, 
                                                background: isRecording ? '#f0f9ff' : '#f8fafc', 
                                                borderRadius: '8px', 
                                                padding: '16px 20px',
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Mic size={20} color={isRecording ? '#0284c7' : '#0ea5e9'} className={isRecording ? 'pulse-blue-anim' : ''} />
                                            <span style={{ fontSize: '0.85rem', color: isRecording ? '#0284c7' : '#64748b', fontWeight: 600 }}>
                                                {isRecording ? 'Recording... Tap to stop' : 'Tap to record voice evidence'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Location Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Location</h3>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                            <input
                                                type="text"
                                                name="locationName"
                                                placeholder="Search Location"
                                                value={formData.locationName}
                                                onChange={handleInputChange}
                                                required
                                                autoComplete="off"
                                                style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', color: '#0f172a', outline: 'none' }}
                                            />
                                            <Target size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#0284c7' }} />
                                            
                                            {/* Suggestions Dropdown */}
                                            {locationSuggestions.length > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    background: '#fff',
                                                    border: '1px solid #cbd5e1',
                                                    borderRadius: '8px',
                                                    marginTop: '4px',
                                                    zIndex: 1000,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    maxHeight: '200px',
                                                    overflowY: 'auto'
                                                }}>
                                                    {locationSuggestions.map((suggestion, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleSuggestionClick(suggestion)}
                                                            style={{
                                                                padding: '12px 16px',
                                                                fontSize: '0.85rem',
                                                                color: '#0f172a',
                                                                cursor: 'pointer',
                                                                borderBottom: index === locationSuggestions.length - 1 ? 'none' : '1px solid #f1f5f9',
                                                                transition: 'background 0.2s'
                                                            }}
                                                        >
                                                            {suggestion.display_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {isSearchingLocation && (
                                                <div style={{ position: 'absolute', right: '44px', top: '50%', transform: 'translateY(-50%)' }}>
                                                    <div className="spinner-small" style={{ width: '16px', height: '16px', border: '2px solid #cbd5e1', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            background: '#0284c7', // Blue theme submit
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            transition: 'background 0.2s',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <Send size={18} />
                                        {isSubmitting ? 'Submitting...' : 'Submit Report to Authorities'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: MY REPORTS (ACKNOWLEDGED) */}
                    <div style={{ 
                        flex: '0 0 35%', 
                        background: '#ffffff', 
                        borderRadius: '12px', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
                        display: 'flex', 
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '8px', color: '#0284c7' }}>
                                    <History size={20} />
                                </div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>My Reports</h2>
                            </div>
                            <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {displayedReports.length} Acknowledged
                            </span>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {displayedReports.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                                    <History size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                                    <p style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>No reports available.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <AnimatePresence>
                                        {displayedReports.map((report) => (
                                            <motion.div
                                                key={report.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '10px',
                                                    padding: '16px',
                                                    background: '#f8fafc',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: report.status === 'Action Taken' ? '#22c55e' : report.status === 'Investigating' ? '#f59e0b' : '#0284c7' }} />
                                                
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                    <div style={{ paddingLeft: '8px' }}>
                                                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                                                            {report.activityType}
                                                        </h4>
                                                    </div>
                                                    <span style={{ 
                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                        background: report.status === 'Action Taken' ? '#dcfce7' : report.status === 'Investigating' ? '#fef3c7' : '#e0f2fe',
                                                        color: report.status === 'Action Taken' ? '#166534' : report.status === 'Investigating' ? '#92400e' : '#0284c7',
                                                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600
                                                    }}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                
                                                <div style={{ paddingLeft: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                        <Ship size={14} /> {report.vesselType}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <MapPin size={14} /> {report.locationName || 'N/A'}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                        <Clock size={14} /> {report.timestamp?.toDate()?.toLocaleDateString() || 'Recently'}
                                                    </div>
                                                </div>

                                                <div style={{ paddingLeft: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                                                        <strong>Authority Update:</strong> {report.aiAnalysis?.summary || "Report reviewed. Area is under surveillance."}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                .pulse-blue-anim { animation: pulse-blue 1.5s infinite; }
                @keyframes pulse-blue {
                    0% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(2,132,199,0.3)); }
                    50% { transform: scale(1.1); filter: drop-shadow(0 0 8px rgba(2,132,199,0.8)); }
                    100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(2,132,199,0.3)); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .dashboard-premium-shell { background: transparent !important; }
            `}</style>
        </>
    );
}

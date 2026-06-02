import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    Camera,
    Search,
    Info,
    Play,
    Pause,
    Map
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, serverTimestamp, GeoPoint, orderBy, doc, updateDoc } from 'firebase/firestore';
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

const STATUS_OPTIONS = ['All', 'Pending', 'Reviewed', 'Action Taken', 'Dismissed'];
const CATEGORY_OPTIONS = [
    'All Activities',
    'Fishing in Banned Area',
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
const formatReportDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    if (typeof timestamp.toDate === 'function') {
        try {
            return timestamp.toDate().toLocaleString();
        } catch {
            // fallback
        }
    }
    if (timestamp instanceof Date) return timestamp.toLocaleString();
    try {
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) return d.toLocaleString();
    } catch {
        // ignore
    }
    return 'Recently';
};

const formatReportDateOnly = (timestamp) => {
    if (!timestamp) return 'Recently';
    if (typeof timestamp.toDate === 'function') {
        try {
            return timestamp.toDate().toLocaleDateString();
        } catch {
            // fallback
        }
    }
    if (timestamp instanceof Date) return timestamp.toLocaleDateString();
    try {
        const d = new Date(timestamp);
        if (!isNaN(d.getTime())) return d.toLocaleDateString();
    } catch {
        // ignore
    }
    return 'Recently';
};

const getReportImage = (report) => {
    if (!report) return null;
    const url = report.imageUrl || report.image || report.photoUrl || report.photo || report.evidenceImage || report.proofImageUrl;
    if (!url) return null;
    
    if (typeof url === 'string') {
        // Strip any potential whitespace/newlines from base64 strings
        if (url.startsWith('data:image')) {
            return url.replace(/\s/g, '');
        }
        if (!url.startsWith('http')) {
            const cleanBase64 = url.trim().replace(/\s/g, '');
            return `data:image/jpeg;base64,${cleanBase64}`;
        }
    }
    return url;
};

export default function IncidentReporting({ role, userLocation, user }) {
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
    const [loadError, setLoadError] = useState(null);
    
    // Media & Speech States
    const [imagePreview, setImagePreview] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioPreview, setAudioPreview] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Filter & Modal States for Authority
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Activities');
    const [selectedReport, setSelectedReport] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [showProofDialog, setShowProofDialog] = useState(false);
    const [proofText, setProofText] = useState('');
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    // Audio & Timer Cleanup
    useEffect(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

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
        const q = query(collection(db, 'complaints'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort locally to avoid requiring composite Firestore indexes
            docs.sort((a, b) => {
                const getMs = (timestamp) => {
                    if (!timestamp) return 0;
                    if (typeof timestamp.toDate === 'function') {
                        try {
                            return timestamp.toDate().getTime();
                        } catch {
                            // ignore
                        }
                    }
                    if (timestamp instanceof Date) return timestamp.getTime();
                    if (timestamp.seconds) return timestamp.seconds * 1000;
                    try {
                        const d = new Date(timestamp);
                        return isNaN(d.getTime()) ? 0 : d.getTime();
                    } catch {
                        return 0;
                    }
                };
                return getMs(b.timestamp) - getMs(a.timestamp);
            });
            setMyReports(docs);
            setLoadError(null);
        }, (error) => {
            console.error("Firestore onSnapshot error in IncidentReporting:", error);
            setLoadError(error.message || String(error));
        });
        return () => unsubscribe();
    }, []);


    const updateStatusInDb = async (reportId, status, proof = '', acknowledgement = '') => {
        try {
            const reportRef = doc(db, 'complaints', reportId);
            const updateData = { status };
            if (proof) {
                updateData.proofOfAction = proof;
                updateData.acknowledgementMessage = acknowledgement;
                updateData.statusUpdatedAt = serverTimestamp();
            }
            await updateDoc(reportRef, updateData);
            
            // Sync with local selectedReport state if currently opened
            setSelectedReport(prev => prev && prev.id === reportId ? { ...prev, ...updateData } : prev);
            
            alert(`Status successfully updated to ${status}`);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error updating status.");
        }
    };

    const handleStatusClick = (status) => {
        if (status === 'Action Taken' || status === 'Dismissed') {
            setStatusToUpdate(status);
            setProofText('');
            setShowProofDialog(true);
        } else {
            updateStatusInDb(selectedReport.id, status);
        }
    };

    const handleProofSubmit = async () => {
        if (!proofText.trim()) {
            alert("Proof or reason is required.");
            return;
        }
        
        const newStatus = statusToUpdate;
        const reporterName = selectedReport.originalFarmerName || selectedReport.reporterName || 'Citizen';
        const acknowledgementMessage = `Dear ${reporterName}, your complaint about ${selectedReport.activityType} has been marked as '${newStatus}'. Details: ${proofText.trim()} - Maritime Authority`;
        
        await updateStatusInDb(selectedReport.id, newStatus, proofText.trim(), acknowledgementMessage);
        
        setShowProofDialog(false);
        setStatusToUpdate(null);
        setSelectedReport(null); // Close the detail modal
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
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);
                    setImagePreview(compressedBase64);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // -- AUDIO RECORDING --
    const stopRecordingHelper = () => {
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const toggleAudioRecording = async () => {
        if (isRecording) {
            stopRecordingHelper();
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunksRef.current = [];
            
            let mediaRecorder;
            try {
                // Try initializing with low bitrate (16kbps) to fit within Firestore 1MB limits
                mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 16000 });
            } catch (err) {
                console.warn("Failed to initialize MediaRecorder with low bitrate, falling back to default options:", err);
                mediaRecorder = new MediaRecorder(stream);
            }

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    setAudioPreview(reader.result);
                };
                stream.getTracks().forEach(track => track.stop());
                
                // Clear state
                if (recordingTimerRef.current) {
                    clearInterval(recordingTimerRef.current);
                    recordingTimerRef.current = null;
                }
                setIsRecording(false);
            };

            setRecordingDuration(0);
            mediaRecorder.start();
            setIsRecording(true);

            // Start visual recording countdown
            const startTime = Date.now();
            recordingTimerRef.current = setInterval(() => {
                const elapsed = Math.round((Date.now() - startTime) / 1000);
                if (elapsed >= 30) {
                    stopRecordingHelper();
                } else {
                    setRecordingDuration(elapsed);
                }
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check browser permissions. (Microphone access requires a secure connection, e.g. localhost or HTTPS)");
        }
    };

    const detectCurrentLocation = async (e) => {
        if (e) e.preventDefault();
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await response.json();
                    const displayName = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
                    
                    setFormData(prev => ({
                        ...prev,
                        lat: lat,
                        lng: lng,
                        locationName: displayName
                    }));
                } catch (error) {
                    console.error("Error reverse geocoding:", error);
                    setFormData(prev => ({
                        ...prev,
                        lat: lat,
                        lng: lng,
                        locationName: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
                    }));
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                let message = "Unable to retrieve your location.";
                if (error.code === error.PERMISSION_DENIED) {
                    message = "Geolocation permission denied. Please allow location access in your browser settings.";
                }
                alert(message);
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const runAIAnalysis = async (data) => {
        try {
            const prompt = `
        You are an AI analyst for a Maritime and Pisciculture Authority. Analyze the following complaint and output a JSON response.
        
        Complaint Data:
        Activity Type: ${data.activityType}
        Vessel Type: ${data.vesselType}
        Description: ${data.description}
        Location: Lat ${data.lat}, Lng ${data.lng}
        
        Determine the following based on the maritime rules, illegal fishing context, and GIS context:
        1. priority: "High", "Medium", or "Low". Give High to illegal fishing in critical zones or large operations.
        2. category: Classify the issue strictly into one of these based on the data: "Illegal Fishing", "Sand Erosion", "Industrial Wastewater", or "Other".
        3. isHotspot: true or false. Determine if this sounds like a recurring hotspot violation.
        4. pfzProximity: "Inside PFZ", "Near PFZ", or "Outside PFZ" (estimate based on context, since exact geo-analysis requires pure DB, give a realistic guess based on description).
        5. crzViolation: true or false. Coastal Regulation Zone violation? (e.g. fishing too close to shore or mangroves).
        6. summary: A 1-2 sentence brief summary of the AI's assessment.
        
        Output exactly and ONLY in valid JSON format:
        {
          "priority": "High|Medium|Low",
          "category": "string",
          "isHotspot": boolean,
          "pfzProximity": "string",
          "crzViolation": boolean,
          "summary": "string"
        }
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().trim();
            if (text.startsWith('```json')) text = text.substring(7, text.length - 3).trim();
            return JSON.parse(text);
        } catch {
            return { 
                priority: "Medium", 
                category: data.activityType, 
                isHotspot: false, 
                pfzProximity: "Outside PFZ", 
                crzViolation: false, 
                summary: "Automated analysis pending." 
            };
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
                reporterName: formData.isAnonymous ? 'Anonymous' : (user ? user.email.split('@')[0] : 'Web User'),
                originalFarmerName: user ? user.email.split('@')[0] : 'Web User',
                hasImage: !!imagePreview,
                imageUrl: imagePreview || null,
                audioUrl: audioPreview || null,
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
            setAudioPreview(null);

            runAIAnalysis(formData).then(async (aiAnalysis) => {
                const reportRef = doc(db, 'complaints', docRef.id);
                await updateDoc(reportRef, { aiAnalysis });
            });

        } catch {
            alert("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter reports based on role: authority sees all; farmers see their own plus others that are Action Taken/Investigating
    const currentUser = user ? user.email.split('@')[0] : 'Web User';
    const displayedReports = role === 'authority' 
        ? myReports 
        : myReports.filter(r => 
            r.originalFarmerName === currentUser || 
            r.status === 'Action Taken' || 
            r.status === 'Investigating'
        );
    return (
        <>
            {role === 'authority' ? (
                <div style={{ 
                    height: '100%', 
                    width: '100%', 
                    padding: '0', 
                    background: 'transparent', 
                    fontFamily: "'Inter', sans-serif",
                    overflow: 'hidden', // Stop outer scrolling
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ 
                        maxWidth: '1400px',
                        width: '100%',
                        margin: '0 auto',
                        display: 'flex', 
                        flexDirection: 'column',
                        flex: 1, // Take up remaining height
                        overflow: 'hidden' // Stop inner wrapper scrolling
                    }}>
                        {/* Header Controls Block */}
                        <div style={{ 
                            flexShrink: 0, 
                            padding: '24px 30px', 
                            borderBottom: '1px solid rgba(255,255,255,0.08)', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '20px', 
                            background: 'rgba(0,12,17,0.5)', 
                            zIndex: 10, 
                            borderTopLeftRadius: '32px', 
                            borderTopRightRadius: '32px' 
                        }}>
                            
                            {/* Dynamic Stats Banner */}
                            <div className="authority-stats-grid">
                                <div className="stat-card">
                                    <span className="stat-title">Total</span>
                                    <span className="stat-value" style={{ color: '#fff' }}>{myReports.length}</span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-title">Pending</span>
                                    <span className="stat-value" style={{ color: '#f59e0b' }}>
                                        {myReports.filter(r => (r.status || 'Pending') === 'Pending').length}
                                    </span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-title">Reviewed</span>
                                    <span className="stat-value" style={{ color: '#3b82f6' }}>
                                        {myReports.filter(r => r.status === 'Reviewed').length}
                                    </span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-title">Action Taken</span>
                                    <span className="stat-value" style={{ color: '#10b981' }}>
                                        {myReports.filter(r => r.status === 'Action Taken').length}
                                    </span>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-title">Dismissed</span>
                                    <span className="stat-value" style={{ color: '#94a3b8' }}>
                                        {myReports.filter(r => r.status === 'Dismissed').length}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Search and Filters */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                                    <input 
                                        type="text"
                                        placeholder="Search by Activity, Vessel, or Reporter..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px 12px 48px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            background: 'rgba(0,0,0,0.3)',
                                            color: '#fff',
                                            fontSize: '0.9rem',
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                                    />
                                </div>
                                
                                {/* Status Filter Row */}
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                                    {STATUS_OPTIONS.map(status => {
                                        const isSelected = selectedFilter === status;
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => setSelectedFilter(status)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    border: isSelected ? '1px solid #0ea5e9' : '1px solid rgba(255,255,255,0.08)',
                                                    background: isSelected ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255,255,255,0.02)',
                                                    color: isSelected ? '#0ea5e9' : 'rgba(255,255,255,0.6)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Category Filter Row */}
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
                                    {CATEGORY_OPTIONS.map(category => {
                                        const isSelected = selectedCategoryFilter === category;
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => setSelectedCategoryFilter(category)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    border: isSelected ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.08)',
                                                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                                                    color: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.6)',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {category}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* List/Grid Scroll Area */}
                        <div style={{ padding: '30px 40px 40px', flex: 1, overflowY: 'auto' }}>
                            {loadError ? (
                                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#ff4d4d' }}>
                                    <AlertCircle size={48} style={{ opacity: 0.8, margin: '0 auto 16px' }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ff4d4d', letterSpacing: '1px' }}>Database Access Error</h3>
                                    <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                                        {loadError}
                                    </p>
                                </div>
                            ) : myReports.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '100px 20px', color: 'rgba(255,255,255,0.3)' }}>
                                    <History size={64} style={{ opacity: 0.5, margin: '0 auto 20px' }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>No reports recorded in the system.</h3>
                                </div>
                            ) : (
                                (() => {
                                    const filtered = myReports.filter(report => {
                                        const matchesFilter = selectedFilter === 'All' || (report.status || 'Pending') === selectedFilter;
                                        const matchesCategory = selectedCategoryFilter === 'All Activities' || 
                                            (report.activityType || '').includes(selectedCategoryFilter);
                                        const matchesSearch = searchQuery.trim() === '' || 
                                            (report.activityType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (report.vesselType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (report.reporterName || '').toLowerCase().includes(searchQuery.toLowerCase());
                                        return matchesFilter && matchesCategory && matchesSearch;
                                    });

                                    if (filtered.length === 0) {
                                        return (
                                            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                                                <History size={48} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>No reports match your search criteria.</h3>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
                                            {filtered.map((report) => (
                                                <motion.div
                                                    key={report.id}
                                                    initial={{ opacity: 0, y: 12 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    onClick={() => setSelectedReport(report)}
                                                    style={{
                                                        border: '1px solid rgba(255,255,255,0.06)',
                                                        borderRadius: '16px',
                                                        padding: '20px',
                                                        background: 'rgba(25, 39, 52, 0.3)',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.4)', border: '1px solid rgba(14, 165, 233, 0.3)' }}
                                                >
                                                    <div style={{ 
                                                        position: 'absolute', 
                                                        left: 0, 
                                                        top: 0, 
                                                        bottom: 0, 
                                                        width: '6px', 
                                                        borderTopLeftRadius: '16px', 
                                                        borderBottomLeftRadius: '16px', 
                                                        background: getStatusColor(report.status || 'Pending') 
                                                    }} />
                                                    
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '8px' }}>
                                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                                {report.aiAnalysis?.priority && (
                                                                    <span style={{
                                                                        background: `${getPriorityColor(report.aiAnalysis.priority)}15`,
                                                                        color: getPriorityColor(report.aiAnalysis.priority),
                                                                        border: `1px solid ${getPriorityColor(report.aiAnalysis.priority)}40`,
                                                                        padding: '2px 6px',
                                                                        borderRadius: '4px',
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 800,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.5px'
                                                                    }}>
                                                                        {report.aiAnalysis.priority}
                                                                    </span>
                                                                )}
                                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                    {report.vesselType}
                                                                </span>
                                                            </div>
                                                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                                                                {report.activityType}
                                                            </h4>
                                                        </div>
                                                        <span style={{ 
                                                            background: getStatusColorBg(report.status || 'Pending'),
                                                            color: getStatusColor(report.status || 'Pending'),
                                                            border: `1px solid ${getStatusColorBorder(report.status || 'Pending')}`,
                                                            padding: '4px 8px', 
                                                            borderRadius: '6px', 
                                                            fontSize: '0.7rem', 
                                                            fontWeight: 700, 
                                                            textTransform: 'uppercase',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {report.status || 'Pending'}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <User size={14} color="#0ea5e9" /> {report.reporterName || 'Anonymous'}
                                                        </div>
                                                        {report.phone && (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <Phone size={14} color="#0ea5e9" /> {report.phone}
                                                            </div>
                                                        )}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <Clock size={14} color="#0ea5e9" /> {formatReportDate(report.timestamp)}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    );
                                })()
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="incident-wrapper-responsive" style={{ background: 'transparent' }}>
                    
                    {/* LEFT SIDE: REPORT FORM */}
                    <div className="glass-deep incident-form-side">
                        {/* Header */}
                        <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: 'rgba(0, 242, 195, 0.1)', borderRadius: '8px', color: 'var(--seafoam)' }}>
                                <AlertCircle size={20} />
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>REPORT INCIDENT</h2>
                        </div>

                        {/* Form Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
                            {isSuccess ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <CheckCircle size={64} color="var(--seafoam)" style={{ margin: '0 auto 20px' }} />
                                    <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '10px' }}>Report Submitted Successfully</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>Your report has been sent to the maritime authorities.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    
                                    {/* Safety Alert */}
                                    <div style={{ background: 'rgba(0, 242, 195, 0.15)', border: '1px solid rgba(0, 242, 195, 0.3)', padding: '16px 20px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <Shield size={20} color="var(--seafoam)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#fff', lineHeight: 1.5, letterSpacing: '0.3px' }}>
                                            Your safety is our priority. If you feel threatened, please submit the report anonymously. Do not approach suspicious vessels directly.
                                        </p>
                                    </div>

                                    {/* Anonymous Toggle */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <Shield size={20} color="var(--text-secondary)" />
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Submit Anonymously</div>
                                                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Your name will be hidden from the authorities.</div>
                                            </div>
                                        </div>
                                        <label className="switch" style={{ margin: 0 }}>
                                            <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleInputChange} />
                                            <span className="slider round" style={{ background: formData.isAnonymous ? 'var(--seafoam)' : 'rgba(255,255,255,0.2)' }}></span>
                                        </label>
                                    </div>

                                    {/* Contact Number */}
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Contact Number"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.9rem', color: '#fff', outline: 'none', background: 'rgba(0,0,0,0.3)' }}
                                        />
                                    </div>

                                    {/* Vessel Information Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '1px' }}>VESSEL INFORMATION</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <Ship size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                                <select
                                                    name="vesselType"
                                                    value={formData.vesselType}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.9rem', color: '#fff', outline: 'none', appearance: 'none', background: 'rgba(0,0,0,0.3)' }}
                                                >
                                                    <option value="" style={{ color: '#000' }}>Vessel Type</option>
                                                    {VESSEL_TYPES.map(t => <option key={t} value={t} style={{ color: '#000' }}>{t}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <AlertTriangle size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                                <select
                                                    name="activityType"
                                                    value={formData.activityType}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.9rem', color: '#fff', outline: 'none', appearance: 'none', background: 'rgba(0,0,0,0.3)' }}
                                                >
                                                    <option value="" style={{ color: '#000' }}>Type of Suspicious Activity</option>
                                                    {ACTIVITY_TYPES.map(t => <option key={t} value={t} style={{ color: '#000' }}>{t}</option>)}
                                                </select>
                                            </div>
                                            <textarea
                                                name="description"
                                                placeholder="Additional Details / Description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                style={{ width: '100%', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.9rem', color: '#fff', outline: 'none', minHeight: '120px', resize: 'vertical', background: 'rgba(0,0,0,0.3)' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Evidence Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '1px' }}>EVIDENCE</h3>
                                        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
                                        <div 
                                            onClick={handleImageClick}
                                            style={{ 
                                                width: '100%', 
                                                border: '1px dashed rgba(255,255,255,0.2)', 
                                                background: 'rgba(255,255,255,0.02)', 
                                                borderRadius: '12px', 
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
                                                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <img src={imagePreview} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button 
                                                        type="button" onClick={removeImage}
                                                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '6px', color: '#fff', cursor: 'pointer' }}
                                                    ><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <Camera size={32} color="var(--text-secondary)" style={{ marginBottom: '12px' }} />
                                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Tap to take a photo of the vessel</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Voice Evidence Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '1px' }}>VOICE EVIDENCE</h3>
                                        <div 
                                            onClick={toggleAudioRecording}
                                            style={{ 
                                                width: '100%', 
                                                border: `1px solid ${isRecording ? 'var(--seafoam)' : 'rgba(255,255,255,0.1)'}`, 
                                                background: isRecording ? 'rgba(0, 242, 195, 0.05)' : 'rgba(0,0,0,0.3)', 
                                                borderRadius: '12px', 
                                                padding: '16px 20px',
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                marginBottom: audioPreview ? '12px' : '0',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Mic size={20} color={isRecording ? 'var(--seafoam)' : 'var(--text-secondary)'} className={isRecording ? 'biolume-pulse' : ''} />
                                            <span style={{ fontSize: '0.85rem', color: isRecording ? 'var(--seafoam)' : 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                                                {isRecording ? `Recording... ${recordingDuration}s / 30s (Tap to stop)` : 'Tap to record voice evidence'}
                                            </span>
                                            {isRecording && (
                                                <div style={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    bottom: 0,
                                                    height: '3px',
                                                    background: 'var(--seafoam)',
                                                    width: `${(recordingDuration / 30) * 100}%`,
                                                    transition: 'width 1s linear',
                                                    boxShadow: '0 0 8px var(--seafoam)'
                                                }} />
                                            )}
                                        </div>
                                        {audioPreview && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <audio controls src={audioPreview} style={{ flex: 1, height: '36px' }} />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setAudioPreview(null)}
                                                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '50%', padding: '6px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Location Section */}
                                    <div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', letterSpacing: '1px' }}>LOCATION</h3>
                                        <div style={{ position: 'relative' }}>
                                            <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                            <input
                                                type="text"
                                                name="locationName"
                                                placeholder="Search Location"
                                                value={formData.locationName}
                                                onChange={handleInputChange}
                                                required
                                                autoComplete="off"
                                                style={{ 
                                                    width: '100%', 
                                                    padding: '14px 48px 14px 44px', 
                                                    border: '1px solid rgba(255,255,255,0.1)', 
                                                    borderRadius: '12px', 
                                                    fontSize: '0.9rem', 
                                                    color: '#fff', 
                                                    outline: 'none', 
                                                    background: 'rgba(0,0,0,0.3)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onFocus={(e) => e.target.style.border = '1px solid var(--seafoam)'}
                                                onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                                            />
                                            <button
                                                type="button"
                                                onClick={detectCurrentLocation}
                                                disabled={isLocating}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    padding: '8px',
                                                    cursor: isLocating ? 'not-allowed' : 'pointer',
                                                    color: isLocating ? 'var(--text-secondary)' : 'var(--seafoam)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s',
                                                    borderRadius: '50%',
                                                    outline: 'none'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isLocating) {
                                                        e.currentTarget.style.color = '#fff';
                                                        e.currentTarget.style.background = 'rgba(0, 242, 195, 0.15)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isLocating) {
                                                        e.currentTarget.style.color = 'var(--seafoam)';
                                                        e.currentTarget.style.background = 'transparent';
                                                    }
                                                }}
                                                title="Use current GPS location"
                                            >
                                                {isLocating ? (
                                                    <div className="spinner-small" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--seafoam)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                ) : (
                                                    <Target size={18} />
                                                )}
                                            </button>
                                            
                                            {/* Suggestions Dropdown */}
                                            {locationSuggestions.length > 0 && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    right: 0,
                                                    background: 'rgba(0, 12, 17, 0.95)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px',
                                                    marginTop: '4px',
                                                    zIndex: 1000,
                                                    backdropFilter: 'blur(10px)',
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
                                                                color: '#fff',
                                                                cursor: 'pointer',
                                                                borderBottom: index === locationSuggestions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            {suggestion.display_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {isSearchingLocation && (
                                                <div style={{ position: 'absolute', right: '48px', top: '50%', transform: 'translateY(-50%)' }}>
                                                    <div className="spinner-small" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--seafoam)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-premium"
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            fontWeight: 800,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            marginTop: '10px'
                                        }}
                                    >
                                        <Send size={18} />
                                        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT TO AUTHORITIES'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE: MY REPORTS (ACKNOWLEDGED) */}
                    <div className="glass-deep incident-reports-side">
                        <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', background: 'rgba(0, 242, 195, 0.1)', borderRadius: '8px', color: 'var(--seafoam)' }}>
                                    <History size={20} />
                                </div>
                                <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 700 }}>MY REPORTS</h2>
                            </div>
                            <span style={{ background: 'rgba(0, 242, 195, 0.1)', color: 'var(--seafoam)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                {displayedReports.length} Acknowledged
                            </span>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {displayedReports.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
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
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    borderRadius: '16px',
                                                    padding: '16px',
                                                    background: 'rgba(255,255,255,0.02)',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: report.status === 'Action Taken' ? '#22c55e' : report.status === 'Investigating' ? '#f59e0b' : 'var(--seafoam)' }} />
                                                
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                    <div style={{ paddingLeft: '8px' }}>
                                                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                                                            {report.activityType}
                                                        </h4>
                                                    </div>
                                                    <span style={{ 
                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                        background: report.status === 'Action Taken' ? 'rgba(34, 197, 94, 0.1)' : report.status === 'Investigating' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 242, 195, 0.1)',
                                                        color: report.status === 'Action Taken' ? '#22c55e' : report.status === 'Investigating' ? '#f59e0b' : 'var(--seafoam)',
                                                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600
                                                    }}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                                        <Ship size={14} /> {report.vesselType}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                                        <MapPin size={14} /> {report.locationName || 'Location Not Specified'}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                                        <Clock size={14} /> {formatReportDateOnly(report.timestamp)}
                                                    </div>
                                                </div>

                                                {report.description && (
                                                    <div style={{ paddingLeft: '8px', marginTop: '12px', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                                                        <strong style={{ display: 'block', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Report Details:</strong>
                                                        {report.description}
                                                    </div>
                                                )}

                                                {getReportImage(report) && (
                                                    <div style={{ marginLeft: '8px', marginTop: '12px', borderRadius: '12px', overflow: 'hidden', height: '140px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                                        <img src={getReportImage(report)} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                )}

                                                {report.audioUrl && (
                                                    <div style={{ marginLeft: '8px', marginTop: '12px' }}>
                                                        <audio controls src={report.audioUrl} style={{ width: '100%', height: '36px', borderRadius: '8px' }} />
                                                    </div>
                                                )}

                                                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                                                    <strong style={{ color: 'var(--seafoam)' }}>Authority Update:</strong> {report.aiAnalysis?.summary || "Automated analysis pending."}
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
            {/* Incident Details Modal Overlay */}
            {createPortal(
                <AnimatePresence>
                    {selectedReport && (
                        <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 12, 17, 0.85)',
                        backdropFilter: 'blur(16px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'rgba(0, 20, 27, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '700px',
                                maxHeight: '90vh',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                            }}
                        >
                            {/* Modal Header */}
                            <div style={{
                                padding: '20px 24px',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexShrink: 0
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>Incident Details</h3>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '6px',
                                        borderRadius: '50%',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div style={{
                                padding: '24px',
                                overflowY: 'auto',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px'
                            }} className="custom-scrollbar">
                                
                                {/* Evidence Image */}
                                {getReportImage(selectedReport) ? (
                                    <div 
                                        onClick={() => setLightboxImage(getReportImage(selectedReport))}
                                        style={{ 
                                            width: '100%', 
                                            height: '240px', 
                                            borderRadius: '16px', 
                                            overflow: 'hidden', 
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                    >
                                        <img src={getReportImage(selectedReport)} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            right: '12px',
                                            background: 'rgba(0,0,0,0.6)',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <ImageIcon size={14} /> Click to zoom
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '140px',
                                        borderRadius: '16px',
                                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(255, 255, 255, 0.01)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}>
                                        <Camera size={32} style={{ color: 'rgba(255, 255, 255, 0.2)' }} />
                                        <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                                            No photo provided for this report
                                        </span>
                                    </div>
                                )}

                                {/* Voice Evidence */}
                                {selectedReport.audioUrl && (
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Voice Evidence</span>
                                        <AudioPlayerWidget audioUrl={selectedReport.audioUrl} />
                                    </div>
                                )}

                                {/* Vessel & Activity */}
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Incident Type</span>
                                    <h4 style={{ margin: '4px 0 0', fontSize: '1.25rem', color: 'var(--seafoam)', fontWeight: 800 }}>{selectedReport.activityType}</h4>
                                    <div style={{ marginTop: '8px', fontSize: '0.9rem', color: '#fff' }}>
                                        Vessel Type: <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{selectedReport.vesselType}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</span>
                                    <p style={{ margin: '6px 0 0', fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>{selectedReport.description || 'No description provided.'}</p>
                                </div>



                                {/* AI & GIS Analysis */}
                                {selectedReport.aiAnalysis && (
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>AI & GIS Analysis</span>
                                        <div style={{
                                            marginTop: '8px',
                                            padding: '16px',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Priority:</span>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    fontWeight: 800,
                                                    color: getPriorityColor(selectedReport.aiAnalysis.priority),
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {selectedReport.aiAnalysis.priority || 'Medium'}
                                                </span>
                                            </div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Category:</span>
                                                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                                                    {selectedReport.aiAnalysis.category || selectedReport.activityType || 'N/A'}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Hotspot:</span>
                                                <span style={{ fontSize: '0.85rem', color: selectedReport.aiAnalysis.isHotspot ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                                                    {selectedReport.aiAnalysis.isHotspot ? 'Yes (Potential Repeat Offender)' : 'No'}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>PFZ Status:</span>
                                                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                                                    {selectedReport.aiAnalysis.pfzProximity || selectedReport.aiAnalysis.pfzStatus || 'N/A'}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>CRZ Violation:</span>
                                                <span style={{ fontSize: '0.85rem', color: selectedReport.aiAnalysis.crzViolation ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                                                    {selectedReport.aiAnalysis.crzViolation ? 'Yes (Violation Detected)' : 'No'}
                                                </span>
                                            </div>

                                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

                                            <div>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Summary:</span>
                                                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', lineHeight: 1.5 }}>
                                                    "{selectedReport.aiAnalysis.summary || 'AI Summary pending.'}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Update Status Choice Chips */}
                                <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>Update Status</span>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                        {['Pending', 'Reviewed', 'Action Taken', 'Dismissed'].map(status => {
                                            const isSelected = selectedReport.status === status;
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusClick(status)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        borderRadius: '8px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        border: isSelected ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.1)',
                                                        background: isSelected ? getStatusColor(status) : 'rgba(255, 255, 255, 0.02)',
                                                        color: isSelected ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {status}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Status Description Banner */}
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '12px 16px',
                                        background: getStatusColorBg(selectedReport.status || 'Pending'),
                                        border: `1px solid ${getStatusColorBorder(selectedReport.status || 'Pending')}`,
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px'
                                    }}>
                                        <Info size={16} style={{ color: getStatusColor(selectedReport.status || 'Pending'), flexShrink: 0, marginTop: '2px' }} />
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.4 }}>
                                            {getStatusDescription(selectedReport.status || 'Pending')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Proof of Action Dialog */}
            {createPortal(
                <AnimatePresence>
                    {showProofDialog && (
                        <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 12, 17, 0.9)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        padding: '20px'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{
                                background: 'rgba(0, 20, 27, 0.98)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                width: '100%',
                                maxWidth: '480px',
                                padding: '24px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>
                                Proof of {statusToUpdate}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                                Please provide details or proof of the action taken (or reason for dismissal) before updating the status:
                            </p>
                            <textarea
                                value={proofText}
                                onChange={e => setProofText(e.target.value)}
                                placeholder="Enter proof/reason here..."
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                    resize: 'vertical'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => {
                                        setShowProofDialog(false);
                                        setStatusToUpdate(null);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'transparent',
                                        color: 'rgba(255,255,255,0.6)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProofSubmit}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        border: 'none',
                                        background: getStatusColor(statusToUpdate),
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Update & Notify
                                </button>
                            </div>
                        </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Evidence Image Lightbox Zoom */}
            {createPortal(
                <AnimatePresence>
                    {lightboxImage && (
                        <div 
                            onClick={() => setLightboxImage(null)}
                            style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10001,
                            cursor: 'zoom-out'
                        }}
                    >
                        <motion.img 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            src={lightboxImage} 
                            alt="Evidence Zoom" 
                            style={{ 
                                maxWidth: '95vw', 
                                maxHeight: '95vh', 
                                objectFit: 'contain',
                                borderRadius: '8px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.8)' 
                            }} 
                        />
                        <button
                            onClick={() => setLightboxImage(null)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
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

                /* Custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                }

                /* Stats counter row styles */
                .authority-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 12px;
                    width: 100%;
                }
                .stat-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 12px;
                    padding: 10px 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .stat-card:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                .stat-title {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 4px;
                    text-align: center;
                }
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                /* Hide standard scrollbars on filter rows */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                @media (max-width: 991px) {
                    .authority-stats-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                @media (max-width: 480px) {
                    .authority-stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </>
    );
}

// Color/Status helpers for authority complaint cards & details
const getStatusColor = (status) => {
    switch (status) {
        case 'Pending': return '#f59e0b';
        case 'Reviewed': return '#3b82f6';
        case 'Action Taken': return '#10b981';
        case 'Dismissed': return '#94a3b8';
        default: return '#f59e0b';
    }
};

const getStatusColorBg = (status) => {
    switch (status) {
        case 'Pending': return 'rgba(245, 158, 11, 0.1)';
        case 'Reviewed': return 'rgba(59, 130, 246, 0.1)';
        case 'Action Taken': return 'rgba(16, 185, 129, 0.1)';
        case 'Dismissed': return 'rgba(148, 163, 184, 0.1)';
        default: return 'rgba(245, 158, 11, 0.1)';
    }
};

const getStatusColorBorder = (status) => {
    switch (status) {
        case 'Pending': return 'rgba(245, 158, 11, 0.3)';
        case 'Reviewed': return 'rgba(59, 130, 246, 0.3)';
        case 'Action Taken': return 'rgba(16, 185, 129, 0.3)';
        case 'Dismissed': return 'rgba(148, 163, 184, 0.3)';
        default: return 'rgba(245, 158, 11, 0.3)';
    }
};

const getPriorityColor = (priority) => {
    if (!priority) return '#94a3b8';
    switch (priority.toLowerCase()) {
        case 'high': return '#ef4444';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#94a3b8';
    }
};

const getStatusDescription = (status) => {
    switch (status) {
        case 'Pending':
            return 'This report has been received and is waiting for an initial review by the authorities.';
        case 'Reviewed':
            return 'This report has been reviewed. An investigation is currently being planned or is underway.';
        case 'Action Taken':
            return 'Authorities have investigated and taken necessary action regarding this report.';
        case 'Dismissed':
            return 'This report was reviewed but found to lack sufficient evidence or was a false alarm.';
        default:
            return 'Status unknown.';
    }
};

// Custom play/pause audio player widget for details modal
function AudioPlayerWidget({ audioUrl }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = (e) => {
        e.stopPropagation();
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => console.error("Error playing audio:", err));
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('ended', onEnded);
        };
    }, [audioUrl]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: '8px'
        }}>
            <audio ref={audioRef} src={audioUrl} />
            <button
                type="button"
                onClick={togglePlay}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(45, 212, 191, 0.1)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    color: 'var(--seafoam)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                }}
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--seafoam)' }}>
                    {isPlaying ? 'Playing Audio...' : 'Voice Evidence Attached'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Click to listen to the farmer\'s recording.
                </span>
            </div>
        </div>
    );
}

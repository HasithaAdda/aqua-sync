import React, { useState, useEffect } from 'react';
import {
    Send,
    User,
    MapPin,
    Image as ImageIcon,
    Mic,
    AlertCircle,
    History,
    Trash2,
    CheckCircle,
    Clock,
    Shield,
    ChevronRight
} from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, GeoPoint, orderBy } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// Gemini AI Setup - Explicitly using v1 to avoid v1beta 404 issues
const genAI = new GoogleGenerativeAI('AIzaSyANLBtNn6ynJCTdC6-TDkSXpS5ggpXCfxM', { apiVersion: 'v1' });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function IncidentReporting() {
    const [activeSubTab, setActiveSubTab] = useState('new');
    const [formData, setFormData] = useState({
        isAnonymous: false,
        phone: '',
        vesselType: '',
        activityType: '',
        description: '',
        locationName: '',
        lat: 15.4989,
        lng: 73.8278
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [myReports, setMyReports] = useState([]);

    // Fetch reports for current user (mocked for now)
    useEffect(() => {
        // In a real app, we'd use auth.currentUser.uid or email
        // For this clone, we'll fetch all reports to show the "Community" or "My" reports
        const q = query(collection(db, 'complaints'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyReports(docs);
        });
        return () => unsubscribe();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const runAIAnalysis = async (data) => {
        try {
            const prompt = `
        You are an AI analyst for a Maritime Authority. Analyze this incident:
        Activity: ${data.activityType}
        Vessel: ${data.vesselType}
        Description: ${data.description}
        Location: ${data.locationName}
        
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
            if (text.startsWith('```json')) text = text.substring(7, text.length - 3).trim();
            return JSON.parse(text);
        } catch (error) {
            console.error("AI Analysis failed", error);
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
            const aiAnalysis = await runAIAnalysis(formData);

            await addDoc(collection(db, 'complaints'), {
                ...formData,
                location: new GeoPoint(formData.lat, formData.lng),
                status: 'Pending',
                timestamp: serverTimestamp(),
                aiAnalysis,
                reporterName: formData.isAnonymous ? 'Anonymous' : 'Web User',
                originalFarmerName: 'Web User' // For filtering "My Reports"
            });

            setIsSuccess(true);
            setFormData({
                isAnonymous: false,
                phone: '',
                vesselType: '',
                activityType: '',
                description: '',
                locationName: '',
                lat: 15.4989,
                lng: 73.8278
            });
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to submit report. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            {/* Sub Tabs */}
            <div style={{ display: 'flex', padding: '16px 24px', borderBottom: 'var(--glass-border)', gap: '16px' }}>
                <button
                    className={`btn ${activeSubTab === 'new' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => { setActiveSubTab('new'); setIsSuccess(false); }}
                >
                    <AlertCircle size={18} /> New Report
                </button>
                <button
                    className={`btn ${activeSubTab === 'history' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveSubTab('history')}
                >
                    <History size={18} /> My Reports
                </button>
            </div>

            <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                {activeSubTab === 'new' ? (
                    isSuccess ? (
                        <div className="glass-card animate-fade-in" style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
                            <CheckCircle size={64} color="var(--success-color)" style={{ marginBottom: '24px' }} />
                            <h2 style={{ marginBottom: '12px' }}>Report Submitted Successfully</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                                Your report has been received and is being analyzed by our AI system.
                                Authorities will be notified if immediate action is required.
                            </p>
                            <button className="btn btn-primary" onClick={() => setIsSuccess(false)}>
                                Submit Another Report
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
                            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Shield size={20} color="var(--danger-color)" />
                                        Incident Details
                                    </h3>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                        <input
                                            type="checkbox"
                                            name="isAnonymous"
                                            checked={formData.isAnonymous}
                                            onChange={handleInputChange}
                                            style={{ accentColor: 'var(--primary-color)' }}
                                        />
                                        Submit Anonymously
                                    </label>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div className="input-group">
                                        <label className="input-label">Vessel Type</label>
                                        <select
                                            className="input-field"
                                            name="vesselType"
                                            value={formData.vesselType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select vessel type...</option>
                                            {VESSEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Activity Type</label>
                                        <select
                                            className="input-field"
                                            name="activityType"
                                            value={formData.activityType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select activity...</option>
                                            {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Location (Search Name)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className="input-field"
                                            style={{ width: '100%', paddingLeft: '40px' }}
                                            placeholder="Enter location name or landmark..."
                                            name="locationName"
                                            value={formData.locationName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Description / Evidence Details</label>
                                    <textarea
                                        className="input-field"
                                        style={{ minHeight: '120px', resize: 'vertical' }}
                                        placeholder="Describe what you observed..."
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button type="button" className="btn btn-ghost" style={{ border: 'var(--glass-border)', flex: 1 }}>
                                        <ImageIcon size={18} /> Add Photos
                                    </button>
                                    <button type="button" className="btn btn-ghost" style={{ border: 'var(--glass-border)', flex: 1 }}>
                                        <Mic size={18} /> Voice Record
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ padding: '16px', marginTop: '12px' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Analyzing & Submitting...' : (
                                        <>
                                            <Send size={18} /> Submit Formal Report
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )
                ) : (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {myReports.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                No reports found.
                            </div>
                        ) : (
                            myReports.map((report) => (
                                <div key={report.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: report.status === 'Action Taken' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: report.status === 'Action Taken' ? 'var(--success-color)' : 'var(--warning-color)'
                                        }}>
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <h4 style={{ margin: 0 }}>{report.activityType}</h4>
                                                {report.aiAnalysis?.priority && (
                                                    <span style={{
                                                        fontSize: '0.65rem',
                                                        padding: '2px 8px',
                                                        borderRadius: '10px',
                                                        background: report.aiAnalysis.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                        color: report.aiAnalysis.priority === 'High' ? 'var(--danger-color)' : 'var(--primary-color)',
                                                        border: `1px solid ${report.aiAnalysis.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                                                    }}>
                                                        {report.aiAnalysis.priority} Priority
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={12} /> {report.timestamp?.toDate().toLocaleDateString()}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={12} /> {report.locationName}
                                                </span>
                                            </div>
                                            {report.aiAnalysis?.summary && (
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', opacity: 0.8 }}>
                                                    " {report.aiAnalysis.summary} "
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span className={`badge ${report.status === 'Action Taken' ? 'badge-success' : 'badge-warning'}`}>
                                            {report.status}
                                        </span>
                                        <button className="btn btn-ghost" style={{ padding: '8px' }}>
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

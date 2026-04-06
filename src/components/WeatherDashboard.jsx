import React, { useState, useEffect } from 'react';
import {
    Cloud,
    Thermometer,
    Droplets,
    Wind,
    Waves,
    MapPin,
    RefreshCw,
    Sun,
    CloudRain,
    CloudLightning,
    Navigation,
    AlertCircle,
    Shield
} from 'lucide-react';

const WMO_CODES = {
    0: { label: 'Clear Sky', icon: Sun, color: '#f59e0b' },
    1: { label: 'Partly Cloudy', icon: Cloud, color: '#94a3b8' },
    2: { label: 'Partly Cloudy', icon: Cloud, color: '#94a3b8' },
    3: { label: 'Partly Cloudy', icon: Cloud, color: '#94a3b8' },
    45: { label: 'Foggy', icon: Cloud, color: '#64748b' },
    48: { label: 'Foggy', icon: Cloud, color: '#64748b' },
    51: { label: 'Drizzle', icon: CloudRain, color: '#38bdf8' },
    61: { label: 'Rain', icon: CloudRain, color: '#0ea5e9' },
    80: { label: 'Showers', icon: CloudRain, color: '#0ea5e9' },
    95: { label: 'Thunderstorm', icon: CloudLightning, color: '#ef4444' },
};

export default function WeatherDashboard() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeather = async (lat = 15.4989, lng = 73.8278) => {
        setLoading(true);
        try {
            const [weatherRes, marineRes, geoRes] = await Promise.all([
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh`),
                fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height`),
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
                    headers: { 'User-Agent': 'AquaWeb/1.0' }
                })
            ]);

            const weatherData = await weatherRes.json();
            const marineData = await marineRes.json();
            const geoData = await geoRes.json();

            if (!weatherData?.current) throw new Error("Weather data missing");

            const condition = WMO_CODES[weatherData.current.weather_code] || { label: 'Clear', icon: Sun, color: '#f59e0b' };

            setWeather({
                location: geoData?.address?.city || geoData?.address?.town || geoData?.address?.county || 'Coastal Zone',
                temp: weatherData.current.temperature_2m ?? 0,
                humidity: weatherData.current.relative_humidity_2m ?? 0,
                windSpeed: weatherData.current.wind_speed_10m ?? 0,
                waveHeight: marineData?.current?.wave_height ?? 0.4,
                condition: condition.label,
                ConditionIcon: condition.icon,
                color: condition.color,
                fullAddress: geoData?.display_name || 'Geographic Zone'
            });
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to sync with maritime satellites.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
            <RefreshCw className="animate-spin" size={32} color="var(--primary-color)" />
            <p style={{ color: 'var(--text-muted)' }}>Syncing with Maritime Data Centers...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <AlertCircle size={48} color="var(--danger-color)" style={{ marginBottom: '16px' }} />
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchWeather()} style={{ marginTop: '16px' }}>Retry Sync</button>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Info */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <MapPin size={18} color="var(--primary-color)" />
                        <h2 style={{ margin: 0 }}>{weather.location}</h2>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px' }}>{weather.fullAddress}</p>
                </div>
                <button className="btn btn-ghost" onClick={() => fetchWeather()}>
                    <RefreshCw size={16} /> Update
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {/* Main Temperature Card */}
                <div className="glass-card" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '-20px',
                        opacity: 0.1,
                        transform: 'scale(4)'
                    }}>
                        <weather.ConditionIcon size={120} color={weather.color} />
                    </div>

                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <weather.ConditionIcon size={48} color={weather.color} />
                    </div>

                    <div>
                        <div style={{ fontSize: '3.5rem', fontWeight: '800', fontFamily: 'Outfit', lineHeight: 1 }}>
                            {weather.temp}°<span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>C</span>
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: weather.color }}>{weather.condition}</div>
                    </div>
                </div>

                {/* Marine Data Detail Card */}
                <div className="glass-card" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '16px', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                            <Waves size={16} color="#0ea5e9" /> Wave Height
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{weather.waveHeight}m</div>
                        <div style={{ fontSize: '0.75rem', color: weather.waveHeight > 1.5 ? 'var(--warning-color)' : 'var(--success-color)' }}>
                            {weather.waveHeight > 1.5 ? 'Caution: Rough' : 'Safe for Crafts'}
                        </div>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                            <Wind size={16} color="#38bdf8" /> Wind Speed
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{weather.windSpeed} <span style={{ fontSize: '0.9rem' }}>km/h</span></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESE Direction</div>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                            <Droplets size={16} color="#10b981" /> Humidity
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{weather.humidity}%</div>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                            <Navigation size={16} color="#f59e0b" /> Pressure
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>1012 <span style={{ fontSize: '0.9rem' }}>hPa</span></div>
                    </div>
                </div>
            </div>

            {/* Fishermen Advisory */}
            <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.1) 0%, transparent 100%)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Shield size={20} color="var(--primary-color)" />
                    Maritime Advisory
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                    {weather.waveHeight > 1.5
                        ? "WARNING: Wave heights are elevated. Small fishing vessels are advised not to venture deep into the sea. High tide expected in 3 hours."
                        : "SAFE OPERATIONS: Current conditions are favorable for all aquaculture and fishing activities. Potential Fishing Zones (PFZ) are active near Chapora and Majorda."}
                </p>
            </div>
        </div>
    );
}

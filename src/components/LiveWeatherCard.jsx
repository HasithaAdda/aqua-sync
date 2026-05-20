import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  RefreshCw, 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  CloudLightning,
  Waves,
  Droplets
} from 'lucide-react';

const LiveWeatherCard = ({ userLocation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const getWeatherDescription = (code) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 82) return "Showers";
    return "Thunderstorm";
  };

  const getWeatherIcon = (code, isDay = 1, size = 48) => {
    const iconStyle = { filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.15))' };
    if (!isDay && code === 0) return <Moon style={{ ...iconStyle, color: '#FFD700' }} size={size} />;
    if (code === 0) return <Sun style={{ ...iconStyle, color: '#FFCC00' }} size={size} />;
    if (code <= 3) return <Cloud style={{ ...iconStyle, color: '#dfe5fb' }} size={size} />;
    if (code <= 67) return <CloudRain style={{ ...iconStyle, color: '#38bdf8' }} size={size} />;
    return <CloudLightning style={{ ...iconStyle, color: '#a855f7' }} size={size} />;
  };

  const fetchWeatherWithPressure = useCallback(async (lat, lon) => {
    setRefreshing(true);
    try {
      const [weatherRes, airRes, marineRes, geoRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&timezone=auto`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5`),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height`),
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
          headers: { 'User-Agent': 'AquaWeb/1.0' }
        }).then(r => r.json())
      ]);

      const weather = await weatherRes.json();
      const air = await airRes.json();
      const marine = await marineRes.json();
      const geo = geoRes;

      const cityName = geo?.address?.city || 
                       geo?.address?.town || 
                       geo?.address?.village || 
                       geo?.address?.suburb || 
                       geo?.address?.neighbourhood || 
                       "Goa Region";
      
      const stateName = geo?.address?.state || "Goa";

      const forecast = weather.daily.time.map((time, index) => ({
        date: time,
        dayName: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
        fullName: new Date(time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        code: weather.daily.weather_code[index],
        max: Math.round(weather.daily.temperature_2m_max[index]),
        min: Math.round(weather.daily.temperature_2m_min[index]),
        feelsLike: Math.round(weather.daily.apparent_temperature_max[index]),
        condition: getWeatherDescription(weather.daily.weather_code[index]),
      }));

      setData({
        location: cityName,
        region: stateName,
        temp: Math.round(weather.current.temperature_2m),
        feelsLike: Math.round(weather.current.apparent_temperature),
        condition: getWeatherDescription(weather.current.weather_code),
        isDay: weather.current.is_day,
        code: weather.current.weather_code,
        humidity: Math.round(weather.current.relative_humidity_2m),
        pressure: Math.round(weather.current.pressure_msl),
        aqi: air.current.us_aqi,
        waveHeight: (marine.current?.wave_height || 0.8).toFixed(1),
        forecast: forecast
      });
      setError(null);
    } catch (err) {
      setError("Satellite Link Fault");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const getLocationAndFetch = useCallback(async () => {
    if (userLocation?.lat && userLocation?.lng) {
      fetchWeatherWithPressure(userLocation.lat, userLocation.lng);
    }
  }, [fetchWeatherWithPressure, userLocation]);

  useEffect(() => {
    getLocationAndFetch();
    const weatherInterval = setInterval(() => { getLocationAndFetch(); }, 600000);
    return () => clearInterval(weatherInterval);
  }, [getLocationAndFetch]);

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', borderRadius: '16px', background: '#222333', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <RefreshCw className="animate-spin text-seafoam" size={24} style={{ marginBottom: '10px' }} />
        <p style={{ color: '#64748b', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px' }}>INITIALIZING PRECISION TELEMETRY</p>
      </div>
    );
  }

  const activeDay = selectedDayIdx === 0 ? data : data.forecast[selectedDayIdx];
  const isForecastMode = selectedDayIdx !== 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', background: '#222333', borderRadius: '16px', padding: '20px', color: '#fff', fontFamily: "'Inter', sans-serif", boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2dd4bf', marginBottom: '4px' }}>
            <MapPin size={10} />
            <span style={{ fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>{data?.location}, {data?.region}</span>
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>{isForecastMode ? `FORECAST: ${activeDay.dayName.toUpperCase()}` : 'CURRENT WEATHER'}</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {isForecastMode && <button onClick={() => setSelectedDayIdx(0)} style={{ background: 'rgba(45, 212, 191, 0.1)', border: '1px solid rgba(45, 212, 191, 0.2)', borderRadius: '6px', padding: '0 8px', fontSize: '0.6rem', fontWeight: '900', color: '#2dd4bf', cursor: 'pointer' }}>LIVE</button>}
          <motion.button whileHover={{ rotate: 180 }} onClick={getLocationAndFetch} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#2dd4bf' }}><RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /></motion.button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getWeatherIcon(activeDay.code, isForecastMode ? 1 : data.isDay, 50)}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '2.8rem', fontWeight: '600', lineHeight: 1 }}>{isForecastMode ? activeDay.max : data.temp}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '400', alignSelf: 'flex-start', marginTop: '4px' }}>°C</span>
          </div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>{activeDay.condition.toUpperCase()}</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>{isForecastMode ? 'Peak' : 'Feels'} <span style={{ color: '#fff' }}>{activeDay.feelsLike}°</span></p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
        <Metric label="AIR Q" value={isForecastMode ? '--' : data.aqi} />
        <Metric label="PRESSURE" value={isForecastMode ? '--' : `${data.pressure} hPa`} />
        <Metric label="WAVES" value={isForecastMode ? '--' : `${data.waveHeight}m`} />
        <Metric label="HUMIDITY" value={isForecastMode ? '--' : `${data.humidity}%`} />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {data?.forecast.map((day, idx) => {
            const isActive = selectedDayIdx === idx;
            return (
              <div key={idx} onClick={() => setSelectedDayIdx(idx)} style={{ background: isActive ? 'rgba(45, 212, 191, 0.1)' : 'transparent', padding: '8px 4px', borderRadius: '8px', textAlign: 'center', border: isActive ? '1px solid #2dd4bf' : '1px solid transparent', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.55rem', fontWeight: '900', color: isActive ? '#2dd4bf' : '#475569' }}>{idx === 0 ? 'TOD' : day.dayName.toUpperCase()}</span>
                <div style={{ margin: '4px 0', display: 'flex', justifyContent: 'center' }}>{getWeatherIcon(day.code, 1, 18)}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '900' }}>{day.max}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const Metric = ({ label, value }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '0.5rem', fontWeight: '900', color: '#475569', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '0.85rem', fontWeight: '900', color: value === '--' ? '#2d3748' : '#cbd5e1' }}>{value}</div>
  </div>
);

export default LiveWeatherCard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Navigation
} from 'lucide-react';

const WMO_CODES = {
  0: { label: 'CLEAR SKY', icon: Sun, color: '#ffcc00' },
  1: { label: 'PARTLY CLOUDY', icon: Cloud, color: '#ffffff' },
  2: { label: 'PARTLY CLOUDY', icon: Cloud, color: '#ffffff' },
  3: { label: 'PARTLY CLOUDY', icon: Cloud, color: '#ffffff' },
  45: { label: 'FOGGY', icon: Cloud, color: '#cbd5e1' },
  48: { label: 'FOGGY', icon: Cloud, color: '#cbd5e1' },
  51: { label: 'DRIZZLE', icon: CloudRain, color: '#38bdf8' },
  61: { label: 'RAIN', icon: CloudRain, color: '#0ea5e9' },
  80: { label: 'SHOWERS', icon: CloudRain, color: '#0ea5e9' },
  95: { label: 'THUNDERSTORM', icon: CloudLightning, color: '#ef4444' },
};

const WeatherWidget = ({ userLocation }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (lat, lng) => {
    setLoading(true);
    try {
      // Reverse Geocoding for accurate location name
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
        headers: { 'User-Agent': 'AquaWeb/1.0' }
      });
      const geoData = await geoRes.json();
      
      const locationName = geoData?.address?.neighbourhood || 
                           geoData?.address?.suburb || 
                           geoData?.address?.village || 
                           geoData?.address?.town || 
                           geoData?.address?.city || 
                           geoData?.address?.hamlet || 
                           'COASTAL HUB';
                           
      const regionName = geoData?.address?.state || 'GOA';

      const [weatherRes, marineRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=kmh`),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height`),
      ]);

      const weatherData = await weatherRes.json();
      const marineData = await marineRes.json();

      const condition = WMO_CODES[weatherData.current.weather_code] || { label: 'CLEAR', icon: Sun, color: '#ffcc00' };

      setWeather({
        location: `${locationName.toUpperCase()}, ${regionName.toUpperCase()}`,
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m.toFixed(1),
        waveHeight: (marineData?.current?.wave_height || 0.8).toFixed(1),
        condition: condition.label,
        ConditionIcon: condition.icon,
        iconColor: condition.color,
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      });
    } catch (err) {
      console.error("Weather Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchWeather(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  if (loading || !weather) return (
    <div className="glass-deep" style={{ width: '100%', height: '140px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(37, 99, 235, 0.1)' }}>
       <RefreshCw className="animate-spin" size={24} color="#3b82f6" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="weather-banner-premium"
      style={{ 
        width: '100%', 
        padding: '25px 40px', 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.1, zIndex: 1 }}>
         <weather.ConditionIcon size={180} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '50px', zIndex: 2, flex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MapPin size={18} />
            <span style={{ fontWeight: '900', letterSpacing: '2px', fontSize: '1.1rem' }}>{weather.location}</span>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: '500' }}>{weather.date}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <weather.ConditionIcon size={56} color={weather.iconColor} style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }} />
          <div>
            <div style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1, fontFamily: 'Outfit' }}>{weather.temp}°C</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', letterSpacing: '2px', opacity: 0.9 }}>{weather.condition}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 40px', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{weather.humidity}%</div>
            <div style={{ fontSize: '0.65rem', fontWeight: '800', opacity: 0.6, letterSpacing: '1px' }}>HUMIDITY</div>
          </div>
          <Droplets size={20} style={{ opacity: 0.8 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
           <RefreshCw 
             size={18} 
             style={{ cursor: 'pointer', opacity: 0.6 }} 
             onClick={() => fetchWeather()}
             className="hover-brighten"
           />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{weather.windSpeed} <span style={{ fontSize: '0.8rem' }}>km/h</span></div>
            <div style={{ fontSize: '0.65rem', fontWeight: '800', opacity: 0.6, letterSpacing: '1px' }}>WIND</div>
          </div>
          <Wind size={20} style={{ opacity: 0.8 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{weather.waveHeight} <span style={{ fontSize: '0.8rem' }}>m</span></div>
            <div style={{ fontSize: '0.65rem', fontWeight: '800', opacity: 0.6, letterSpacing: '1px' }}>WAVES</div>
          </div>
          <Waves size={20} style={{ opacity: 0.8 }} />
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;

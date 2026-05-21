import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, ShieldAlert, CheckCircle, Info, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

const Alerts = ({ sensorData }) => {
  const { temperature, ph, turbidity, salinity } = sensorData || { temperature: 28.4, ph: 7.5, turbidity: 12.0, salinity: 32.5 };

  const getAlerts = () => {
    const activeAlerts = [];

    // pH Alerts
    if (ph < 6.5) {
      activeAlerts.push({
        id: 'ph-low',
        title: 'Low pH Level Detected',
        severity: 'critical',
        parameter: 'pH Level',
        value: `${ph} pH`,
        limit: 'Safe: 6.5 - 8.5 pH',
        desc: 'pH is below the safe biological threshold. Acidic water can stress fish and damage gill membranes.',
        recs: [
          'Add Agricultural Lime (Calcium carbonate) to neutralize acidity.',
          'Introduce Dolomite slowly to buffer the water.',
          'Perform a partial water exchange (10-20%) with clean freshwater.'
        ]
      });
    } else if (ph > 8.5) {
      activeAlerts.push({
        id: 'ph-high',
        title: 'High pH Level Detected',
        severity: 'critical',
        parameter: 'pH Level',
        value: `${ph} pH`,
        limit: 'Safe: 6.5 - 8.5 pH',
        desc: 'pH is above the safe threshold. Highly alkaline water increases ammonia toxicity.',
        recs: [
          'Perform a partial water change (20-30%).',
          'Introduce organic buffers like cow dung compost or tamarind extracts (traditional buffer).',
          'Reduce excessive algal blooms which spike daytime pH through photosynthesis.',
          'Operate aerators to stabilize gas exchanges.'
        ]
      });
    }

    // Temp Alerts
    if (temperature < 24) {
      activeAlerts.push({
        id: 'temp-low',
        title: 'Low Water Temperature',
        severity: 'warning',
        parameter: 'Temperature',
        value: `${temperature}°C`,
        limit: 'Safe: 24°C - 30°C',
        desc: 'Water temperature has fallen below the optimal range. Fish metabolism and feed intake will slow down.',
        recs: [
          'Cover shallow pond margins with clear greenhouse plastic sheets.',
          'Increase water depth to stabilize bottom temperatures.',
          'Reduce feeding frequency to avoid unused feed decay.',
          'Run aerators during midday to mix warmer surface layers.'
        ]
      });
    } else if (temperature > 30) {
      activeAlerts.push({
        id: 'temp-high',
        title: 'High Water Temperature',
        severity: 'warning',
        parameter: 'Temperature',
        value: `${temperature}°C`,
        limit: 'Safe: 24°C - 30°C',
        desc: 'Water temperature exceeds optimal limits. Warm water holds significantly less dissolved oxygen.',
        recs: [
          'Run aerators continuously, especially at night and early morning.',
          'Install shade nets over high-exposure nursery zones.',
          'Add cooler freshwater if available.',
          'Ensure adequate water depth (minimum 1.2 to 1.5 meters).'
        ]
      });
    }

    // Turbidity Alerts
    if (turbidity < 2) {
      activeAlerts.push({
        id: 'turbidity-low',
        title: 'Low Water Turbidity',
        severity: 'info',
        parameter: 'Turbidity',
        value: `${turbidity} NTU`,
        limit: 'Safe: 2 - 30 NTU',
        desc: 'Water is too clear. Very low turbidity indicates lack of natural plankton, leaving fish vulnerable to predators.',
        recs: [
          'Apply organic fertilizers (composted cow dung) to stimulate phytoplankton growth.',
          'Add nitrogen-phosphorus fertilizers in controlled quantities.',
          'Monitor Secchi disk depth to maintain standard turbidity.'
        ]
      });
    } else if (turbidity > 30) {
      activeAlerts.push({
        id: 'turbidity-high',
        title: 'High Water Turbidity',
        severity: 'critical',
        parameter: 'Turbidity',
        value: `${turbidity} NTU`,
        limit: 'Safe: 2 - 30 NTU',
        desc: 'High particulate turbidity detected. Suspended clay or organic matter can clog fish gills and block sunlight.',
        recs: [
          'Apply Alum (Aluminum sulfate) at recommended rates to settle particles.',
          'Let runoff particles sediment naturally; avoid stirring pond bottom.',
          'Construct grass buffer strips around pond edges to filter incoming runoff.',
          'Limit feeding temporarily until turbidity normalizes.'
        ]
      });
    }

    // Salinity Alerts
    if (salinity < 15) {
      activeAlerts.push({
        id: 'salinity-low',
        title: 'Low Salinity Level',
        severity: salinity < 5 ? 'critical' : 'warning',
        parameter: 'Salinity',
        value: `${salinity} PPT`,
        limit: 'Safe: 15 - 30 PPT',
        desc: salinity < 5 
          ? 'Salinity has dropped to critical levels. Severe osmotic stress could lead to high fish mortality.'
          : 'Salinity is below the optimal range. Low salinity affects growth rates and increases stress.',
        recs: [
          'Reduce freshwater inflow to the pond.',
          'Introduce brackish/salt water or add commercial salt blocks if possible.',
          'Ensure drainage systems are active to divert excessive rainwater runoff.'
        ]
      });
    } else if (salinity > 30) {
      activeAlerts.push({
        id: 'salinity-high',
        title: 'High Salinity Level',
        severity: salinity > 35 ? 'critical' : 'warning',
        parameter: 'Salinity',
        value: `${salinity} PPT`,
        limit: 'Safe: 15 - 30 PPT',
        desc: salinity > 35
          ? 'Salinity is critically high. High salinity reduces oxygen solubility and dehydrates aquatic life.'
          : 'Salinity exceeds optimal threshold. Elevated salinity may slow down feed intake.',
        recs: [
          'Add freshwater to dilute salinity levels.',
          'Perform a partial water exchange with freshwater.',
          'Ensure aerators are fully running to assist with gas solubility.',
          'Add shading over critical zones to reduce evaporation.'
        ]
      });
    }

    return activeAlerts;
  };

  const activeAlerts = getAlerts();

  return (
    <div style={{ padding: '30px', color: '#fff', background: 'transparent' }}>
      {/* Header Widget */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>

        <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BellRing size={20} className={activeAlerts.length > 0 ? 'biolume-pulse' : ''} style={{ color: activeAlerts.length > 0 ? 'var(--seafoam)' : '#64748b' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px' }}>
            {activeAlerts.length} ACTIVE {activeAlerts.length === 1 ? 'ALERT' : 'ALERTS'}
          </span>
        </div>
      </div>

      {activeAlerts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-deep" 
          style={{ 
            padding: '50px', 
            borderRadius: '24px', 
            textAlign: 'center', 
            border: '1px solid rgba(34, 197, 94, 0.2)',
            background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.1), rgba(0, 12, 17, 0.6))'
          }}
        >
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 20px',
            border: '2px solid rgba(34, 197, 94, 0.3)'
          }}>
            <CheckCircle size={40} color="#22c55e" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: '0' }}>All parameters are in safe ranges ✅</h3>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {activeAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-deep"
              style={{
                borderRadius: '24px',
                borderLeft: `6px solid ${
                  alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f97316' : '#3b82f6'
                }`,
                padding: '25px',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '12px',
                    backgroundColor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.1)' : alert.severity === 'warning' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' : alert.severity === 'warning' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`
                  }}>
                    <ShieldAlert size={22} color={alert.severity === 'critical' ? '#ef4444' : alert.severity === 'warning' ? '#f97316' : '#3b82f6'} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{alert.title}</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: '900', 
                        padding: '3px 8px', 
                        borderRadius: '6px', 
                        textTransform: 'uppercase',
                        backgroundColor: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.2)' : alert.severity === 'warning' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                        color: alert.severity === 'critical' ? '#f87171' : alert.severity === 'warning' ? '#fb923c' : '#60a5fa',
                      }}>
                        {alert.severity}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>| Parameter: {alert.parameter}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: alert.severity === 'critical' ? '#f87171' : alert.severity === 'warning' ? '#fb923c' : '#60a5fa' }}>{alert.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', letterSpacing: '0.5px' }}>{alert.limit}</div>
                </div>
              </div>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: '1.5', margin: '0 0 20px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {alert.desc}
              </p>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--seafoam)', margin: '0 0 12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} /> RECOMMENDED ACTION PLAN
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {alert.recs.map((rec, index) => (
                    <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        marginTop: '4px',
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: 'var(--seafoam)', 
                        boxShadow: '0 0 8px var(--seafoam)',
                        flexShrink: 0
                      }}></div>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;

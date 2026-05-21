import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Coins, Award, Users2, ArrowRight, ExternalLink } from 'lucide-react';

const GovtSchemes = () => {
  const schemesList = [
    {
      id: 1,
      title: 'Financial Assistance for setting up of Crab Farming Unit',
      subsidy: '40% - 50% Subsidy',
      beneficiary: 'Individual Farmers / Self Help Groups',
      funding: 'Up to ₹2,00,000 assistance per hectare based on unit costs.',
      details: 'Aims to promote mud crab fattening and culture in brackish water ponds or ponds located in inter-tidal zones. Assistance covers pond construction, netting material, and initial stocking seeds.'
    },
    {
      id: 2,
      title: 'Financial Assistance to Brackish Water Aquaculture Farms',
      subsidy: '50% Govt Support',
      beneficiary: 'Coastal land owners / Registered Aquaculturists',
      funding: 'Subsidy on construction, aerators, and electricity connections.',
      details: 'Supports setting up modern brackish water ponds for Tiger Shrimp or Finfish culture. Extra incentives provided for implementing eco-friendly circular farming practices and waste sediment control.'
    },
    {
      id: 3,
      title: 'Financial Assistance to Fresh Water Aquaculture Farms',
      subsidy: '40% (General) / 60% (SC/ST/Women)',
      beneficiary: 'Fish farmers owning/leasing freshwater bodies',
      funding: 'Support for input costs (seed, feed) and pond renovation.',
      details: 'Supports stocking of Indian Major Carps (Catla, Rohu, Mrigal) and exotic carps in freshwater lakes, tanks, and ponds. Includes training and input support for the first crop cycle.'
    },
    {
      id: 4,
      title: 'Financial Assistance to Mussel Culture and Oyster Farming',
      subsidy: 'Up to 50% Capital Subsidy',
      beneficiary: 'Coastal community members / Estuarine lease holders',
      funding: 'Provides rafts, ropes, and bamboo framework materials.',
      details: 'Promotes hanging culture of green mussels and edible oysters in estuarine backwaters. Excellent livelihood scheme for local self-help groups requiring low capital investment.'
    },
    {
      id: 5,
      title: 'Financial Assistance for setting up of Ornamental Fish Units',
      subsidy: '40% Capital Subsidy',
      beneficiary: 'Hobbyists / Youth Entrepreneurs',
      funding: 'Support for aquariums, glass tanks, breeders, and aeration systems.',
      details: 'Encourages the breeding and rearing of freshwater and marine ornamental fish. Helps set up backyard breeding centers or commercial scale units to meet domestic and export demands.'
    }
  ];

  const officialLink = 'https://fisheries.goa.gov.in/schemes-services/aquaculture/';

  return (
    <div style={{ padding: '30px', color: '#fff', background: 'transparent' }}>
      {/* Header Widget */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <a 
          href={officialLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-premium"
          style={{ 
            padding: '12px 24px', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '0.8rem',
            fontWeight: '800',
          }}
        >
          GO TO OFFICIAL PORTAL <ExternalLink size={14} />
        </a>
      </div>

      {/* Schemes Grid Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {schemesList.map((scheme, idx) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-deep"
            style={{
              borderRadius: '20px',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(255, 255, 255, 0.01)',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Row Title & Subsidy Label */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(34, 197, 94, 0.15)',
                  flexShrink: 0
                }}>
                  <FileText size={20} color="var(--seafoam)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 5px' }}>{scheme.title}</h3>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: '900', 
                      backgroundColor: 'rgba(0, 242, 195, 0.15)', 
                      color: 'var(--seafoam)', 
                      padding: '3px 8px', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Coins size={12} /> {scheme.subsidy}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users2 size={12} /> Target: {scheme.beneficiary}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheme Details Description */}
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
              {scheme.details}
            </p>

            {/* Funding Assistance breakdown */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              backgroundColor: 'rgba(0, 242, 195, 0.03)', 
              padding: '12px 18px', 
              borderRadius: '12px',
              border: '1px solid rgba(0, 242, 195, 0.08)'
            }}>
              <Award size={16} color="var(--seafoam)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                <strong style={{ color: '#fff' }}>Financial Scope: </strong> {scheme.funding}
              </span>
            </div>

            {/* Read More button linking to external page */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
              <a 
                href={officialLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--seafoam)', 
                  textDecoration: 'none', 
                  fontSize: '0.8rem', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                View Guidelines & Apply <ArrowRight size={14} />
              </a>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GovtSchemes;

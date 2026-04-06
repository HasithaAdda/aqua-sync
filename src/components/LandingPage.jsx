import React from 'react';
import Navbar from './landing/Navbar';
import Hero from './landing/Hero';
import DashboardPreview from './landing/DashboardPreview';
import Services from './landing/Services';
import Footer from './landing/Footer';

const LandingPage = ({ user, onEnterApp }) => {
  return (
    <div className="landing-wrapper" style={{ backgroundColor: 'var(--ocean-dark)' }}>
      <Navbar user={user} onEnterApp={onEnterApp} />
      
      {/* 
        The Hero now internally contains the FeaturesGrid 
        to achieve the exact 'overlapping' overlay effect 
        seen in the reference mockup. 
      */}
       <Hero onEnterApp={onEnterApp} />
      
      <DashboardPreview />
      
      <Services />
      <Footer />
    </div>
  );
};

export default LandingPage;

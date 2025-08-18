import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import UtilityLocating from './pages/UtilityLocating';
import USTDetection from './pages/USTDetection';
import EnvironmentalRemediation from './pages/EnvironmentalRemediation';
import PreConstruction from './pages/PreConstruction';
import SensitiveSites from './pages/SensitiveSites';
import EmergencyLocates from './pages/EmergencyLocates';
import CommercialGPR from './pages/CommercialGPR';
import ResidentialGPR from './pages/ResidentialGPR';
import BookJob from './pages/BookJob';
import AdminBooking from './pages/AdminBooking';
import ModifyBooking from './pages/ModifyBooking';
import ModifySuccess from './pages/ModifySuccess';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services/utility-locating" element={<UtilityLocating />} />
            <Route path="/services/ust-detection" element={<USTDetection />} />
            <Route path="/services/environmental-remediation" element={<EnvironmentalRemediation />} />
            <Route path="/services/pre-construction" element={<PreConstruction />} />
            <Route path="/services/sensitive-sites" element={<SensitiveSites />} />
            <Route path="/services/emergency-locates" element={<EmergencyLocates />} />
            <Route path="/services/commercial-gpr" element={<CommercialGPR />} />
            <Route path="/services/residential-gpr" element={<ResidentialGPR />} />
            <Route path="/book" element={<BookJob />} />
            <Route path="/modify" element={<ModifyBooking />} />
            <Route path="/modify/success" element={<ModifySuccess />} />
            <Route path="/admin" element={<AdminBooking />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
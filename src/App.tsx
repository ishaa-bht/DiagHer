import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import TechnologySection from './components/TechnologySection';
import ImpactSection from './components/ImpactSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Navigation />
      <HeroSection scrollY={scrollY} />
      <ProblemSection scrollY={scrollY} />
      <SolutionSection scrollY={scrollY} />
      <TechnologySection scrollY={scrollY} />
      <ImpactSection scrollY={scrollY} />
      <CTASection scrollY={scrollY} />
      <Footer />
    </div>
  );
}


export default App;
import React from 'react';
import { ChevronDown} from 'lucide-react';

interface HeroSectionProps {
  scrollY: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollY }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Parallax Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-rose-800 to-gray-900">
        {/* Main Background Image Frame */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-[120%] bg-cover bg-center"
            style={{
              backgroundImage: `URL('src/assets/bg.jpg')`,
              transform: `translateY(${scrollY * 0.5}px)`,
              filter: 'brightness(0.3) contrast(1.1)'
            }}
          ></div>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/90 via-rose-800/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 to-transparent"></div>
        
        {/* Floating Elements */}
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gray-600/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.4}px)`
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div 
          className="space-y-8"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        >
          {/* <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/20 shadow-2xl">
            <Sparkles className="w-5 h-5 text-rose-300" />
            <span className="text-sm font-medium"></span>
          </div>
           */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Meet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-200 to-rose-100 drop-shadow-lg">
              DiagHer
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            AI-Powered Gender-Aware Healthcare
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="bg-gradient-to-r from-rose-800 to-rose-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-rose-900 hover:to-rose-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-rose-500/25">
              See How It Works
            </button>
            <button className="border-2 border-white/80 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-rose-900 transition-all duration-300 backdrop-blur-sm shadow-xl">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/70 drop-shadow-lg" />
      </div>
    </section>
  );
};

export default HeroSection;
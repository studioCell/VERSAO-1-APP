import React from 'react';
import { Smartphone, Paintbrush, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-studio-blue flex flex-col items-center justify-center relative overflow-hidden text-center p-6">
      
      {/* Decorative Splash Elements mimicking the paint splashes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-studio-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>

      {/* Main Content */}
      <div className="z-10 max-w-4xl flex flex-col items-center">
        
        {/* Main Title */}
        <h1 className="font-poppins font-black text-white text-6xl md:text-8xl tracking-tighter leading-none mb-2 drop-shadow-lg">
          STUDIO <span className="text-studio-yellow">PHONE</span>
        </h1>
        
        {/* Subtitle */}
        <h2 className="font-poppins font-bold text-white text-xl md:text-3xl tracking-wide mb-12 uppercase max-w-2xl">
          Mostre seus produtos ao mundo <br/>
          <span className="text-studio-yellow">em segundos!</span>
        </h2>

        {/* Visual Composition (Phone + Paint) */}
        <div className="relative mb-16 group cursor-pointer" onClick={onStart}>
          <div className="absolute inset-0 bg-studio-yellow blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-full"></div>
          <div className="relative transform group-hover:-translate-y-2 transition-transform duration-500">
            <Smartphone className="w-48 h-48 md:w-64 md:h-64 text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" strokeWidth={1} />
            
            {/* Paintbrush Icon Overlay */}
            <div className="absolute -bottom-4 -right-8 transform -rotate-12">
               <Paintbrush className="w-24 h-24 text-studio-yellow drop-shadow-lg fill-studio-yellow" />
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden font-poppins font-black text-studio-blue bg-white rounded-full shadow-2xl hover:bg-studio-yellow transition-all duration-300 transform hover:scale-105"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          <span className="relative flex items-center gap-3 text-2xl uppercase tracking-wider">
            <Zap className="w-6 h-6 fill-current" />
            Começar a Criar
          </span>
        </button>

        {/* Footer Text */}
        <div className="mt-16 text-white font-poppins font-medium tracking-widest text-sm opacity-80 uppercase">
          Ferramenta Nova no Mercado
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
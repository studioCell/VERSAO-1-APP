import React, { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import FlyerPreview from './components/FlyerPreview';
import LandingPage from './components/LandingPage';
import { FlyerState, INITIAL_STATE } from './types';
import { Smartphone, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [flyerState, setFlyerState] = useState<FlyerState>(INITIAL_STATE);

  const handleStateChange = (newState: Partial<FlyerState>) => {
    setFlyerState(prev => ({ ...prev, ...newState }));
  };

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen bg-studio-blue flex flex-col">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setStarted(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
              title="Voltar ao Início"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Smartphone className="w-8 h-8 text-studio-yellow" />
              <h1 className="text-2xl font-black tracking-tight text-white font-poppins">
                STUDIO <span className="text-studio-yellow">PHONE</span>
              </h1>
            </div>
          </div>
          <div className="text-sm font-medium text-white/80 hidden sm:block bg-white/10 px-3 py-1 rounded-full">
            Criador de Ofertas Premium
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls (Scrollable on desktop) */}
        <div className="lg:col-span-4 h-full">
           <ControlPanel 
             state={flyerState} 
             onChange={handleStateChange}
             previewId="flyer-preview-container" 
            />
        </div>

        {/* Right Column: Preview (Sticky on desktop) */}
        <div className="lg:col-span-8 flex flex-col items-center pt-4 lg:pt-10">
           <div className="sticky top-24">
              <div className="mb-6 text-center lg:text-left text-white">
                <h2 className="text-2xl font-bold">Visualização em Tempo Real</h2>
                <p className="text-white/60 text-sm">O design final será exportado em alta qualidade.</p>
              </div>
              
              <FlyerPreview 
                data={flyerState}
                previewId="flyer-preview-container" 
              />
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
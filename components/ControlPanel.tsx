import React, { useState } from 'react';
import { FlyerState, Brand, ThemeType } from '../types';
import { PHONE_MODELS, PAYMENT_CONDITIONS, CTA_OPTIONS } from '../constants';
import { Wand2, Copy, Download, Share2, Upload, MapPin } from 'lucide-react';
import { generateMarketingCaption, generateTechSpecs } from '../services/geminiService';
import html2canvas from 'html2canvas';

interface ControlPanelProps {
  state: FlyerState;
  onChange: (newState: Partial<FlyerState>) => void;
  previewId: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, previewId }) => {
  const [aiLoading, setAiLoading] = useState<'caption' | 'specs' | null>(null);
  const [generatedText, setGeneratedText] = useState<{caption: string, specs: string}>({ caption: '', specs: '' });

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value as Brand;
    onChange({ brand: newBrand, model: '', memory: '' });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelKey = e.target.value;
    if (modelKey && PHONE_MODELS[state.brand][modelKey]) {
      const modelData = PHONE_MODELS[state.brand][modelKey];
      onChange({ 
        model: modelData.name, 
        memory: modelData.memorias[0] 
      });
    } else {
      onChange({ model: '', memory: '' });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ customProductImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Handlers
  const handleGenerateCaption = async () => {
    setAiLoading('caption');
    const text = await generateMarketingCaption(state.model, `R$ ${state.price}`, state.customCta || state.ctaText);
    setGeneratedText(prev => ({ ...prev, caption: text }));
    setAiLoading(null);
  };

  const handleGenerateSpecs = async () => {
    setAiLoading('specs');
    const text = await generateTechSpecs(state.model);
    setGeneratedText(prev => ({ ...prev, specs: text }));
    setAiLoading(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado!');
  };

  const handleExport = async () => {
    const element = document.getElementById(previewId);
    if (!element) return;
    
    // Temporarily disable animations for clean screenshot
    const wasAnimated = state.enableAnimations;
    if (wasAnimated) onChange({ enableAnimations: false });

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(element, { 
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          backgroundColor: null 
        });
        const link = document.createElement('a');
        link.download = `studio-phone-oferta.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Export failed", err);
        alert("Erro ao exportar imagem.");
      } finally {
        if (wasAnimated) onChange({ enableAnimations: true });
      }
    }, 100);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* SECTION: Theme & Product */}
      <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-studio-blue/10 transition-colors">
        <h3 className="font-poppins font-bold text-lg mb-4 text-studio-blue flex items-center gap-2">
          <span className="bg-studio-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          Produto e Tema
        </h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tema Visual</label>
            <select 
              value={state.theme} 
              onChange={(e) => onChange({ theme: e.target.value as ThemeType })}
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring focus:ring-studio-blue/20 transition-all"
            >
              <option value={ThemeType.BLACK_FRIDAY}>⚫ Black Friday</option>
              <option value={ThemeType.CHRISTMAS}>🎅 Natal</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Marca</label>
              <select 
                value={state.brand} 
                onChange={handleBrandChange}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20"
              >
                {Object.values(Brand).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Modelo</label>
              <select 
                value={state.model} 
                onChange={handleModelChange}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20"
              >
                <option value="">Selecione...</option>
                {Object.keys(PHONE_MODELS[state.brand]).map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 items-center">
             <label className="block text-sm font-bold text-gray-700 w-1/3">Foto Personalizada</label>
             <div className="relative flex-1 flex gap-2">
                <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" id="product-upload" />
                <label htmlFor="product-upload" className="flex-1 flex items-center justify-center gap-2 w-full p-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-studio-blue transition-colors text-sm text-gray-600 font-medium">
                  <Upload size={16} /> 
                  {state.customProductImage ? 'Alterar Foto' : 'Carregar Foto'}
                </label>
                 {state.customProductImage && (
                    <button 
                      onClick={() => onChange({ customProductImage: null })}
                      className="p-2 text-red-500 hover:bg-red-50 border border-red-200 rounded-lg"
                      title="Remover foto"
                    >
                      ✕
                    </button>
                 )}
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Memória</label>
             <select
               value={state.memory}
               onChange={(e) => onChange({ memory: e.target.value })}
               className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20"
               disabled={!state.model}
             >
                {!state.model && <option>Selecione um modelo primeiro</option>}
                {state.model && PHONE_MODELS[state.brand][state.model]?.memorias.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      {/* SECTION: Pricing */}
      <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-studio-blue/10 transition-colors">
        <h3 className="font-poppins font-bold text-lg mb-4 text-studio-blue flex items-center gap-2">
           <span className="bg-studio-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
           Preço e Pagamento
        </h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Valor À Vista (R$)</label>
            <input 
              type="number" 
              value={state.price}
              onChange={(e) => onChange({ price: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20 font-mono text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Condição</label>
            <select 
              value={state.paymentCondition}
              onChange={(e) => onChange({ paymentCondition: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20"
            >
              {PAYMENT_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {(state.paymentCondition.includes('CARTÃO') || state.paymentCondition.includes('BOLETO')) && (
            <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
               <div>
                 <label className="block text-xs font-bold text-studio-blue mb-1">Parcelas</label>
                 <select 
                    value={state.installments}
                    onChange={(e) => onChange({ installments: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1.5 border text-sm"
                 >
                   {[...Array(17)].map((_, i) => i + 2).map(n => <option key={n} value={n}>{n}x</option>)}
                 </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-studio-blue mb-1">Total a Prazo (R$)</label>
                  <input 
                    type="number"
                    value={state.totalWithInterest}
                    onChange={(e) => onChange({ totalWithInterest: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1.5 border text-sm"
                  />
               </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION: Info & Toggles */}
      <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-studio-blue/10 transition-colors">
        <h3 className="font-poppins font-bold text-lg mb-4 text-studio-blue flex items-center gap-2">
           <span className="bg-studio-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
           Detalhes e Visual
        </h3>
        <div className="space-y-4">
          
          {/* Instagram */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Instagram</label>
            <input 
              type="text" placeholder="@SuaLoja.imports" 
              value={state.instagram} onChange={(e) => onChange({ instagram: e.target.value })}
              className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20 text-sm"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">WhatsApp</label>
            <input 
              type="text" placeholder="(11) 99999-9999" 
              value={state.whatsapp} onChange={(e) => onChange({ whatsapp: e.target.value })}
              className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20 text-sm"
            />
          </div>

          {/* Address Input */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
              <MapPin size={12} /> Endereço
            </label>
            <input 
              type="text" placeholder="Rua Exemplo, 123" 
              value={state.address} onChange={(e) => onChange({ address: e.target.value })}
              className="block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm p-2.5 border focus:border-studio-blue focus:ring-studio-blue/20 text-sm"
            />
          </div>

          {/* Logo Upload */}
          <div className="flex gap-2 items-center">
             <label className="block text-sm font-bold text-gray-700 w-1/3">Logo Loja</label>
             <div className="relative flex-1">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload" className="flex items-center justify-center gap-2 w-full p-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-studio-blue transition-colors text-sm text-gray-600 font-medium">
                  <Upload size={16} /> Carregar Imagem
                </label>
             </div>
          </div>

          <hr className="border-gray-100" />
          
          {/* Toggles Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
             <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50"><input type="checkbox" className="rounded text-studio-blue focus:ring-studio-blue" checked={state.showPrice} onChange={(e) => onChange({ showPrice: e.target.checked })} /> Mostrar Preço</label>
             <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50"><input type="checkbox" className="rounded text-studio-blue focus:ring-studio-blue" checked={state.showContact} onChange={(e) => onChange({ showContact: e.target.checked })} /> Mostrar WhatsApp</label>
             <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50"><input type="checkbox" className="rounded text-studio-blue focus:ring-studio-blue" checked={state.showAddress} onChange={(e) => onChange({ showAddress: e.target.checked })} /> Mostrar Endereço</label>
             <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50"><input type="checkbox" className="rounded text-studio-blue focus:ring-studio-blue" checked={state.showCta} onChange={(e) => onChange({ showCta: e.target.checked })} /> Mostrar CTA</label>
             <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50 font-bold text-studio-blue"><input type="checkbox" className="rounded text-studio-blue focus:ring-studio-blue" checked={state.enableAnimations} onChange={(e) => onChange({ enableAnimations: e.target.checked })} /> 🎬 Animar (Preview)</label>
          </div>
        </div>
      </div>

      {/* SECTION: AI Generation */}
      <div className="bg-gradient-to-br from-gray-900 to-studio-blue p-5 rounded-xl shadow-lg border border-white/10 text-white">
        <h3 className="font-poppins font-bold text-lg mb-4 flex items-center gap-2 text-studio-yellow">
          <Wand2 className="w-5 h-5" /> Assistente IA
        </h3>
        
        <div className="space-y-4">
           {/* Caption Generator */}
           <div>
             <button 
                onClick={handleGenerateCaption}
                disabled={!state.model || aiLoading === 'caption'}
                className="w-full flex items-center justify-center gap-2 bg-white text-studio-blue hover:bg-studio-yellow hover:text-studio-blue font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50 shadow-md"
             >
                {aiLoading === 'caption' ? 'Criando Mágica...' : 'Gerar Legenda Vendedora'}
             </button>
             {generatedText.caption && (
               <div className="mt-2 relative">
                 <textarea readOnly value={generatedText.caption} className="w-full text-xs p-3 rounded-lg border-none h-20 bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-studio-yellow" />
                 <button onClick={() => copyToClipboard(generatedText.caption)} className="absolute top-2 right-2 p-1.5 bg-white/20 rounded hover:bg-white/30 text-white transition-colors">
                   <Copy size={14} />
                 </button>
               </div>
             )}
           </div>

           {/* Specs Generator */}
           <div>
             <button 
                onClick={handleGenerateSpecs}
                disabled={!state.model || aiLoading === 'specs'}
                className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-50"
             >
                {aiLoading === 'specs' ? 'Pesquisando...' : 'Gerar Ficha Técnica'}
             </button>
             {generatedText.specs && (
               <div className="mt-2 relative">
                 <textarea readOnly value={generatedText.specs} className="w-full text-xs p-3 rounded-lg border-none h-20 bg-white/10 text-white placeholder-white/50 focus:ring-1 focus:ring-studio-yellow" />
                 <button onClick={() => copyToClipboard(generatedText.specs)} className="absolute top-2 right-2 p-1.5 bg-white/20 rounded hover:bg-white/30 text-white transition-colors">
                   <Copy size={14} />
                 </button>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Primary Action */}
      <button 
        onClick={handleExport}
        className="w-full bg-studio-yellow hover:bg-yellow-300 text-studio-blue font-black font-poppins py-4 px-6 rounded-xl shadow-[0_5px_0_rgb(200,180,0)] hover:shadow-[0_2px_0_rgb(200,180,0)] hover:translate-y-[3px] flex items-center justify-center gap-3 text-xl transition-all"
      >
        <Download className="w-7 h-7" /> BAIXAR IMAGEM
      </button>

    </div>
  );
};

export default ControlPanel;
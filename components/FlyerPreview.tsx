import React, { useState, useEffect } from 'react';
import { FlyerState, ThemeType } from '../types';
import { THEME_LOGOS, PHONE_MODELS } from '../constants';
import { CheckCircle, Phone, MapPin, Loader2 } from 'lucide-react';

interface FlyerPreviewProps {
  data: FlyerState;
  previewId: string;
}

const FlyerPreview: React.FC<FlyerPreviewProps> = ({ data, previewId }) => {
  const isChristmas = data.theme === ThemeType.CHRISTMAS;
  const isPriceHidden = !data.showPrice;
  const logoUrl = data.logo || null;

  // Resolve Phone Image
  const phoneImage = data.customProductImage || PHONE_MODELS[data.brand]?.[data.model]?.img || '';

  // Image Loading States
  const [isProductImageLoaded, setIsProductImageLoaded] = useState(false);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  // Reset loading state when image source changes
  useEffect(() => {
    setIsProductImageLoaded(false);
  }, [phoneImage]);

  useEffect(() => {
    setIsLogoLoaded(false);
  }, [logoUrl]);

  // Dynamic Styles
  const bgStyle = isChristmas 
    ? { backgroundImage: "url('https://i.ibb.co/LDpntyXv/Design-sem-nome-2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: '#000000' };

  const borderColor = isChristmas ? 'border-yellow-400' : 'border-[#DC143C]';
  const accentColorText = isChristmas ? 'text-yellow-400' : 'text-[#DC143C]';
  const priceColor = 'text-[#FFD700]'; // Gold

  // Animation classes
  const floatClass = data.enableAnimations ? 'animate-float' : '';
  const pulseClass = data.enableAnimations ? 'animate-pulse-fast' : '';

  // Values Calculation
  const isInstallment = data.paymentCondition.includes('CARTÃO') || data.paymentCondition.includes('BOLETO');
  
  const displayPrice = isInstallment
    ? (data.totalWithInterest / data.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const displayTotal = data.totalWithInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // --- LOGIC FOR HIDDEN PRICE MODE ---
  // Product Name Styles
  const productNameClasses = isPriceHidden
    ? `font-black uppercase tracking-tighter text-center leading-none mt-4
       text-5xl md:text-6xl
       ${isChristmas 
          ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
          : 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-[0_2px_2px_rgba(255,255,255,0.1)]'
       }`
    : `font-bold text-white text-3xl md:text-4xl text-center leading-tight drop-shadow-lg max-w-xs uppercase tracking-tight`;

  // CTA Container Position
  const ctaContainerClasses = isPriceHidden
    ? 'absolute bottom-32 right-6 flex justify-end pointer-events-none' // Corner position
    : 'absolute bottom-20 w-full flex justify-center pointer-events-none'; // Center position

  // CTA Button Styles
  const ctaButtonClasses = isPriceHidden
    ? `text-sm px-4 py-2 rotate-[-6deg] shadow-lg
       ${isChristmas ? 'bg-red-600 text-white border-white' : 'bg-bf-text text-black border-white'}`
    : `${pulseClass} transform translate-y-2 
       text-xl text-bf-orange rotate-[-3deg] bg-black/80 px-4 py-1 rounded-lg border border-bf-orange/50
       font-luckiest uppercase tracking-wide drop-shadow-[2px_2px_0_rgba(0,0,0,1)]`;

  return (
    <div className="flex justify-center items-center p-4 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
      {/* 
        Container Phone Screen (375x667)
      */}
      <div 
        id={previewId}
        style={{ width: '375px', height: '667px', ...bgStyle }}
        className={`relative flex flex-col border-[6px] ${borderColor} shadow-2xl overflow-hidden shrink-0 transition-all duration-300 select-none font-poppins`}
      >
        {/* === CAMADA DE FUNDO (Texto Decorativo) === */}
        {!isChristmas && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
            <span className="font-luckiest text-9xl text-white -rotate-12 whitespace-nowrap">BLACK FRIDAY</span>
          </div>
        )}

        {/* === CABEÇALHO (Relativo - Garante que nada suba em cima dele) === */}
        {/* REVERTIDO: -mt-10 para colar no topo novamente */}
        <div className="relative w-full z-50 flex flex-col items-center shrink-0 -mt-10">
           {/* Logo do Tema */}
           <img 
            src={THEME_LOGOS[data.theme]} 
            alt="Theme Logo" 
            crossOrigin="anonymous"
            className={`
              drop-shadow-lg transition-all duration-500 
              ${!isPriceHidden ? floatClass : ''} 
              w-64 max-h-28
              object-contain
            `}
          />
           
           {/* Badge do Instagram */}
           <div className="flex items-center gap-1 text-white drop-shadow-md bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm -mt-5 relative z-10">
            <CheckCircle className="w-4 h-4 text-blue-400 fill-blue-400 bg-white rounded-full" />
            <span className="font-semibold text-xs">{data.instagram}</span>
          </div>
        </div>

        {/* === CONTEÚDO PRINCIPAL (Flex Column) === */}
        <div className="flex-1 flex flex-col w-full z-10 pt-2 pb-24 px-4 min-h-0">
          
          {/* 1. ÁREA DA IMAGEM E NOME */}
          <div className={`flex-1 flex flex-col items-center relative w-full transition-all duration-300 overflow-hidden min-h-0 ${isPriceHidden ? 'justify-start mt-4' : 'justify-end'}`}>
             
             {/* Tag de Memória */}
             {data.showMemory && data.memory && (
               <span className={`shrink-0 z-20 px-3 py-1 bg-bf-orange border-2 border-yellow-400 rounded text-black font-bold text-sm shadow-lg mb-2 transform hover:scale-110 transition-transform ${data.enableAnimations ? 'animate-pulse' : ''}`}>
                 {data.memory}
               </span>
             )}

             {/* Imagem do Produto Wrapper */}
             <div className={`relative w-full flex-1 min-h-0 flex flex-col items-center transition-all duration-500 ${isPriceHidden ? 'justify-start' : 'justify-end'}`}>
               {phoneImage ? (
                  <>
                   {/* Loader Spinner */}
                   {!isProductImageLoaded && (
                     <div className="absolute inset-0 flex items-center justify-center z-0">
                       <Loader2 className="w-10 h-10 text-white animate-spin opacity-50" />
                     </div>
                   )}
                   <img 
                     src={phoneImage}
                     alt="Product"
                     crossOrigin="anonymous"
                     loading="lazy"
                     onLoad={() => setIsProductImageLoaded(true)}
                     className={`object-contain drop-shadow-2xl w-auto origin-bottom transition-opacity duration-700 ease-in-out
                       ${isProductImageLoaded ? 'opacity-100' : 'opacity-0'}
                       ${isPriceHidden 
                          ? 'max-h-[85%] scale-105' 
                          : 'max-h-[60%] scale-90 pb-4'
                       }`}
                   />
                  </>
               ) : (
                  <div className="w-full h-full max-h-48 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center text-white/50 border-2 border-dashed border-white/20">
                      Sem Imagem
                    </div>
                  </div>
               )}
             </div>

             {/* Nome do Produto */}
             <h2 className={`${productNameClasses} shrink-0 z-10 pb-1`}>
               {data.model || "MODELO"}
             </h2>
          </div>

          {/* 2. ÁREA DE PREÇO */}
          {!isPriceHidden && (
            <div className="mt-1 flex flex-col items-center justify-end w-full shrink-0">
              
              {/* Condição de Pagamento */}
              <div className={`
                mb-1 px-4 py-1 rounded text-center uppercase tracking-wide backdrop-blur-md shadow-lg border border-white/10
                ${accentColorText} bg-black/60 font-black text-xl md:text-2xl w-full max-w-[90%]
              `}>
                {data.paymentCondition}
              </div>

              {/* Linha de Preço */}
              <div className="flex items-baseline justify-center gap-2 drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
                
                {/* Parcelas */}
                {isInstallment && (
                  <span className="text-bf-orange font-bold text-3xl md:text-4xl tracking-tighter">
                    {data.installments}x
                  </span>
                )}

                {/* Símbolo R$ */}
                <span className={`text-2xl font-bold ${priceColor}`}>R$</span>
                
                {/* Valor Principal */}
                <span className={`font-bold ${priceColor} text-5xl md:text-6xl leading-none`}>
                  {displayPrice}
                </span>
              </div>

              {/* Valor Total */}
              {isInstallment && (
                <div className="mt-1 font-semibold text-white text-sm md:text-base opacity-90 bg-black/40 px-3 py-0.5 rounded-full">
                  Total: R$ {displayTotal}
                </div>
              )}
            </div>
          )}
        </div>

        {/* === CTA (Chamada de Ação) === */}
        {data.showCta && (
          <div className={`${ctaContainerClasses} transition-all duration-500 z-30`}>
             <div className={`${ctaButtonClasses} pointer-events-auto rounded-xl font-luckiest uppercase tracking-wide border-2`}>
                {data.customCta || data.ctaText}
             </div>
          </div>
        )}

        {/* === RODAPÉ (Endereço e Contato) === */}
        <div className="absolute bottom-0 w-full z-30 bg-gradient-to-t from-black via-black/90 to-transparent pt-10 pb-3 px-4 flex flex-col justify-end">
          
          <div className="flex justify-between items-end w-full">
            {/* Logo Personalizada (Esquerda) - AJUSTE DE POSIÇÃO */}
            <div className="shrink-0 -ml-4 -mb-[30px] w-32 h-32 relative z-40 flex items-center justify-center">
               {data.showLogo && logoUrl ? (
                <>
                  {!isLogoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                    </div>
                  )}
                  <img 
                    src={logoUrl} 
                    alt="Store Logo" 
                    loading="lazy"
                    onLoad={() => setIsLogoLoaded(true)}
                    className={`max-w-full max-h-full object-contain drop-shadow-md transition-opacity duration-500 ${isLogoLoaded ? 'opacity-100' : 'opacity-0'}`} 
                  />
                </>
              ) : <div className="w-full h-full"></div>}
            </div>

            {/* Informações de Contato (Direita/Centro) */}
            <div className="flex flex-col items-end gap-1.5 max-w-[70%] mb-1">
              
              {/* WhatsApp */}
              {data.showContact && (
                 <div className="flex items-center gap-2 bg-green-600/90 text-white px-3 py-1.5 rounded-lg shadow-lg border border-green-400/30 backdrop-blur-sm">
                   <Phone className="w-3.5 h-3.5 fill-current" />
                   <span className="font-bold text-xs tracking-wide">{data.whatsapp}</span>
                 </div>
               )}

              {/* Endereço */}
              {data.showAddress && data.address && (
                 <div className="flex items-start justify-end gap-1.5 text-right bg-black/50 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                   <span className="text-gray-200 text-[10px] font-medium leading-tight max-w-[150px]">
                     {data.address}
                   </span>
                   <MapPin className="w-3 h-3 text-bf-orange shrink-0 mt-0.5" />
                 </div>
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlyerPreview;
import { Brand, PhoneModelData } from './types';

export const PHONE_MODELS: Record<Brand, Record<string, PhoneModelData>> = {
  [Brand.XIAOMI]: {
    'Poco X6 Pro': { 
      name: 'Poco X6 Pro',
      img: 'https://i.ibb.co/PZ37ZQBh/56b51295abe5648063dfa24601641213-removebg-preview.png', 
      memorias: ['256GB / 8GB RAM', '512GB / 12GB RAM'] 
    },
    'Redmi Note 13': { 
      name: 'Redmi Note 13',
      img: 'https://i.ibb.co/svwXmyXJ/1491f8f70ec78d5d5c35087c0fdb56c6-removebg-preview.png', 
      memorias: ['128GB / 6GB RAM', '256GB / 8GB RAM'] 
    },
  },
  [Brand.APPLE]: {
    'iPhone 13': { 
      name: 'iPhone 13',
      img: 'https://i.ibb.co/Jqj927L/iphone-13-blue-select-2021-removebg-preview.png', 
      memorias: ['128GB', '256GB'] 
    },
    'iPhone 15 Pro': { 
      name: 'iPhone 15 Pro',
      img: 'https://i.ibb.co/hWHPzXj/iphone-15-pro-finish-select-202309-natural-titanium-removebg-preview.png', 
      memorias: ['128GB', '256GB', '512GB'] 
    },
  }
};

export const THEME_LOGOS = {
  black_friday: "https://i.ibb.co/RG4YVHqL/TECMAUTAS-Black-Friday-removebg-preview.png",
  christmas: "https://i.ibb.co/cc00HZNv/Adobe-Express-file-6.png"
};

export const PAYMENT_CONDITIONS = [
  'À VISTA', 
  'NO PIX', 
  'NO BOLETO', 
  'EM ATÉ 12X NO CARTÃO'
];

export const CTA_OPTIONS = [
  'Imperdível!',
  'Estoque Limitado!',
  'Compre Agora!',
  'Chame no Zap!',
  'Personalizado'
];
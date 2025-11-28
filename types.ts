export enum ThemeType {
  BLACK_FRIDAY = 'black_friday',
  CHRISTMAS = 'christmas',
}

export enum Brand {
  XIAOMI = 'Xiaomi',
  APPLE = 'Apple',
}

export interface PhoneModelData {
  name: string;
  img: string;
  memorias: string[];
}

export interface FlyerState {
  theme: ThemeType;
  brand: Brand;
  model: string;
  memory: string;
  price: number;
  paymentCondition: string;
  installments: number;
  totalWithInterest: number;
  instagram: string;
  whatsapp: string;
  address: string;
  ctaText: string;
  customCta: string;
  logo: string | null; // Base64 or URL
  customProductImage: string | null; // Base64 or URL
  
  // Toggles
  showPrice: boolean;
  showContact: boolean;
  showAddress: boolean;
  showCta: boolean;
  showLogo: boolean;
  showMemory: boolean;
  enableAnimations: boolean;
}

export const INITIAL_STATE: FlyerState = {
  theme: ThemeType.BLACK_FRIDAY,
  brand: Brand.XIAOMI,
  model: '',
  memory: '',
  price: 1999.99,
  paymentCondition: 'À VISTA',
  installments: 12,
  totalWithInterest: 2200.00,
  instagram: '@SuaLoja.imports',
  whatsapp: '(11) 99999-9999',
  address: 'Rua das Ofertas, 123',
  ctaText: 'Imperdível!',
  customCta: '',
  logo: null,
  customProductImage: null,
  showPrice: true,
  showContact: true,
  showAddress: true,
  showCta: true,
  showLogo: true,
  showMemory: true,
  enableAnimations: false,
};
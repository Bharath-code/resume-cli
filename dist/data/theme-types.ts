// Theme and customization types for the resume CLI tool

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface FontConfiguration {
  heading: {
    family: string;
    weight: number;
    size: {
      h1: string;
      h2: string;
      h3: string;
    };
  };
  body: {
    family: string;
    weight: number;
    size: string;
    lineHeight: string;
  };
  code: {
    family: string;
    size: string;
  };
}

export interface BrandKit {
  logo?: {
    url: string;
    width?: string;
    height?: string;
    position: 'top-left' | 'top-right' | 'center' | 'bottom';
  };
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    primary: string;
    secondary?: string;
  };
}

export interface ThemeMode {
  mode: 'light' | 'dark' | 'auto';
  autoSwitchTime?: {
    lightStart: string; // HH:MM format
    darkStart: string;  // HH:MM format
  };
}

export interface ResumeTheme {
  id: string;
  name: string;
  description: string;
  industry?: string;
  colors: {
    light: ColorPalette;
    dark: ColorPalette;
  };
  fonts: FontConfiguration;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  layout: {
    maxWidth: string;
    padding: string;
    sectionSpacing: string;
  };
}

export interface ThemeConfiguration {
  activeTheme: string;
  mode: ThemeMode;
  customizations?: {
    colors?: Partial<ColorPalette>;
    fonts?: Partial<FontConfiguration>;
    brandKit?: BrandKit;
  };
  previewMode?: boolean;
}

export type Industry = 
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'creative'
  | 'consulting'
  | 'marketing'
  | 'engineering'
  | 'sales'
  | 'legal'
  | 'nonprofit'
  | 'startup'
  | 'corporate'
  | 'freelance';

export interface ColorSchemeRequest {
  industry: Industry;
  personality: 'professional' | 'creative' | 'modern' | 'classic' | 'bold';
  preferences?: {
    favoriteColors?: string[];
    avoidColors?: string[];
    accessibility?: boolean;
  };
}

export interface GeneratedColorScheme {
  name: string;
  description: string;
  reasoning: string;
  palette: ColorPalette;
  confidence: number;
  accessibility: {
    contrastRatio: number;
    wcagLevel: 'AA' | 'AAA' | 'fail';
  };
}

export interface FontPairing {
  name: string;
  description: string;
  heading: string;
  body: string;
  code?: string;
  category: 'classic' | 'modern' | 'creative' | 'technical';
  googleFonts: boolean;
  fallbacks: string[];
}

export interface ThemePreview {
  format: 'html' | 'pdf' | 'image';
  sections: string[];
  outputPath?: string;
}

export interface ThemeValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}
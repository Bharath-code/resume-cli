import { ColorPalette, ColorSchemeRequest, GeneratedColorScheme, Industry } from '../data/theme-types';

// Industry-specific color psychology and recommendations
const INDUSTRY_COLOR_PROFILES = {
  technology: {
    primary: ['#2563eb', '#3b82f6', '#1e40af', '#0ea5e9'],
    personality: 'Modern, innovative, trustworthy',
    avoid: ['#dc2626', '#f59e0b']
  },
  finance: {
    primary: ['#1e40af', '#059669', '#0f172a', '#374151'],
    personality: 'Professional, stable, trustworthy',
    avoid: ['#ef4444', '#f97316']
  },
  healthcare: {
    primary: ['#059669', '#0ea5e9', '#6366f1', '#8b5cf6'],
    personality: 'Caring, professional, clean',
    avoid: ['#dc2626', '#000000']
  },
  education: {
    primary: ['#0ea5e9', '#059669', '#7c3aed', '#2563eb'],
    personality: 'Approachable, knowledgeable, inspiring',
    avoid: ['#dc2626', '#0f172a']
  },
  creative: {
    primary: ['#7c3aed', '#ec4899', '#f59e0b', '#10b981'],
    personality: 'Bold, artistic, expressive',
    avoid: ['#374151', '#6b7280']
  },
  consulting: {
    primary: ['#374151', '#1e40af', '#059669', '#0f172a'],
    personality: 'Professional, analytical, strategic',
    avoid: ['#ef4444', '#ec4899']
  },
  marketing: {
    primary: ['#ec4899', '#f59e0b', '#8b5cf6', '#10b981'],
    personality: 'Dynamic, creative, engaging',
    avoid: ['#6b7280', '#0f172a']
  },
  engineering: {
    primary: ['#374151', '#2563eb', '#059669', '#0ea5e9'],
    personality: 'Precise, reliable, technical',
    avoid: ['#ec4899', '#f59e0b']
  },
  sales: {
    primary: ['#10b981', '#f59e0b', '#2563eb', '#ec4899'],
    personality: 'Energetic, persuasive, results-driven',
    avoid: ['#6b7280', '#0f172a']
  },
  legal: {
    primary: ['#0f172a', '#374151', '#1e40af', '#059669'],
    personality: 'Authoritative, professional, trustworthy',
    avoid: ['#ef4444', '#ec4899']
  },
  nonprofit: {
    primary: ['#059669', '#0ea5e9', '#7c3aed', '#10b981'],
    personality: 'Compassionate, hopeful, community-focused',
    avoid: ['#dc2626', '#0f172a']
  },
  startup: {
    primary: ['#7c3aed', '#2563eb', '#10b981', '#f59e0b'],
    personality: 'Innovative, agile, disruptive',
    avoid: ['#6b7280', '#374151']
  },
  corporate: {
    primary: ['#1e40af', '#374151', '#059669', '#0f172a'],
    personality: 'Established, professional, reliable',
    avoid: ['#ec4899', '#7c3aed']
  },
  freelance: {
    primary: ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899'],
    personality: 'Independent, versatile, creative',
    avoid: ['#0f172a', '#6b7280']
  }
};

// Predefined color palettes for different personalities
const PERSONALITY_PALETTES = {
  professional: {
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    text: { primary: '#0f172a', secondary: '#475569', muted: '#64748b' }
  },
  creative: {
    background: '#fefefe',
    surface: '#faf5ff',
    border: '#e879f9',
    text: { primary: '#581c87', secondary: '#7c3aed', muted: '#a855f7' }
  },
  modern: {
    background: '#ffffff',
    surface: '#f1f5f9',
    border: '#cbd5e1',
    text: { primary: '#1e293b', secondary: '#334155', muted: '#64748b' }
  },
  classic: {
    background: '#fffef7',
    surface: '#fefce8',
    border: '#d4d4aa',
    text: { primary: '#365314', secondary: '#4d7c0f', muted: '#65a30d' }
  },
  bold: {
    background: '#ffffff',
    surface: '#fef2f2',
    border: '#fca5a5',
    text: { primary: '#7f1d1d', secondary: '#dc2626', muted: '#ef4444' }
  }
};

export class ColorPaletteGenerator {
  /**
   * Generate AI-suggested color schemes based on industry and preferences
   */
  static generateColorScheme(request: ColorSchemeRequest): GeneratedColorScheme[] {
    const industryProfile = INDUSTRY_COLOR_PROFILES[request.industry];
    const personalityBase = PERSONALITY_PALETTES[request.personality];
    
    const schemes: GeneratedColorScheme[] = [];
    
    // Generate 3 different schemes
    for (let i = 0; i < 3; i++) {
      const primaryColor = this.selectPrimaryColor(industryProfile, request, i);
      const palette = this.buildPalette(primaryColor, personalityBase, request);
      const accessibility = this.calculateAccessibility(palette);
      
      schemes.push({
        name: `${request.industry} ${request.personality} ${i + 1}`,
        description: this.generateDescription(request.industry, request.personality, i),
        reasoning: this.generateReasoning(industryProfile, request.personality, primaryColor),
        palette,
        confidence: this.calculateConfidence(request, palette),
        accessibility
      });
    }
    
    return schemes.sort((a, b) => b.confidence - a.confidence);
  }
  
  /**
   * Generate color variations for a base color
   */
  static generateColorVariations(baseColor: string): string[] {
    const variations = [];
    const hsl = this.hexToHsl(baseColor);
    
    // Generate lighter and darker variations
    for (let i = -40; i <= 40; i += 10) {
      if (i === 0) continue;
      const newLightness = Math.max(0, Math.min(100, hsl.l + i));
      variations.push(this.hslToHex(hsl.h, hsl.s, newLightness));
    }
    
    return variations;
  }
  
  /**
   * Check color accessibility and contrast ratios
   */
  static checkAccessibility(foreground: string, background: string): {
    ratio: number;
    level: 'AA' | 'AAA' | 'fail';
  } {
    const ratio = this.calculateContrastRatio(foreground, background);
    
    let level: 'AA' | 'AAA' | 'fail';
    if (ratio >= 7) level = 'AAA';
    else if (ratio >= 4.5) level = 'AA';
    else level = 'fail';
    
    return { ratio, level };
  }
  
  private static selectPrimaryColor(industryProfile: any, request: ColorSchemeRequest, index: number): string {
    let candidates = [...industryProfile.primary];
    
    // Filter out avoided colors
    if (request.preferences?.avoidColors) {
      candidates = candidates.filter(color => 
        !request.preferences!.avoidColors!.some(avoid => 
          this.colorDistance(color, avoid) < 50
        )
      );
    }
    
    // Prioritize favorite colors
    if (request.preferences?.favoriteColors) {
      const favoriteMatches = candidates.filter(color =>
        request.preferences!.favoriteColors!.some(fav =>
          this.colorDistance(color, fav) < 30
        )
      );
      if (favoriteMatches.length > 0) {
        candidates = favoriteMatches;
      }
    }
    
    return candidates[index % candidates.length] || industryProfile.primary[0];
  }
  
  private static buildPalette(primaryColor: string, personalityBase: any, request: ColorSchemeRequest): ColorPalette {
    const hsl = this.hexToHsl(primaryColor);
    
    // Generate secondary color (complementary or analogous)
    const secondaryHue = (hsl.h + 180) % 360;
    const secondary = this.hslToHex(secondaryHue, hsl.s * 0.8, hsl.l);
    
    // Generate accent color (triadic)
    const accentHue = (hsl.h + 120) % 360;
    const accent = this.hslToHex(accentHue, hsl.s, Math.min(hsl.l + 10, 90));
    
    return {
      primary: primaryColor,
      secondary,
      accent,
      background: personalityBase.background,
      surface: personalityBase.surface,
      text: personalityBase.text,
      border: personalityBase.border,
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };
  }
  
  private static calculateAccessibility(palette: ColorPalette): {
    contrastRatio: number;
    wcagLevel: 'AA' | 'AAA' | 'fail';
  } {
    const primaryContrast = this.calculateContrastRatio(palette.text.primary, palette.background);
    const secondaryContrast = this.calculateContrastRatio(palette.text.secondary, palette.background);
    
    const minRatio = Math.min(primaryContrast, secondaryContrast);
    
    let wcagLevel: 'AA' | 'AAA' | 'fail';
    if (minRatio >= 7) wcagLevel = 'AAA';
    else if (minRatio >= 4.5) wcagLevel = 'AA';
    else wcagLevel = 'fail';
    
    return {
      contrastRatio: minRatio,
      wcagLevel
    };
  }
  
  private static generateDescription(industry: Industry, personality: string, index: number): string {
    const descriptions = {
      0: `A ${personality} color scheme optimized for ${industry} professionals`,
      1: `An alternative ${personality} palette with enhanced visual appeal for ${industry}`,
      2: `A bold ${personality} approach perfect for standing out in ${industry}`
    };
    return descriptions[index as keyof typeof descriptions];
  }
  
  private static generateReasoning(industryProfile: any, personality: string, primaryColor: string): string {
    return `Selected based on ${personality} personality traits and ${industryProfile.personality} industry standards. Primary color ${primaryColor} conveys professionalism while maintaining visual interest.`;
  }
  
  private static calculateConfidence(request: ColorSchemeRequest, palette: ColorPalette): number {
    let confidence = 0.7; // Base confidence
    
    // Boost confidence for accessibility
    const accessibility = this.calculateAccessibility(palette);
    if (accessibility.wcagLevel === 'AAA') confidence += 0.2;
    else if (accessibility.wcagLevel === 'AA') confidence += 0.1;
    
    // Boost for preference matching
    if (request.preferences?.favoriteColors) {
      const hasMatch = request.preferences.favoriteColors.some(fav =>
        this.colorDistance(palette.primary, fav) < 50
      );
      if (hasMatch) confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
  
  // Color utility functions
  private static hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  
  private static hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  
  private static calculateContrastRatio(color1: string, color2: string): number {
    const getLuminance = (hex: string) => {
      const rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
        .map(x => {
          const val = parseInt(x, 16) / 255;
          return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }
  
  private static colorDistance(color1: string, color2: string): number {
    const rgb1 = [color1.slice(1, 3), color1.slice(3, 5), color1.slice(5, 7)].map(x => parseInt(x, 16));
    const rgb2 = [color2.slice(1, 3), color2.slice(3, 5), color2.slice(5, 7)].map(x => parseInt(x, 16));
    
    return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    );
  }
}
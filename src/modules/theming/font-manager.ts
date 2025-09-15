import { FontConfiguration, FontPairing } from '../../data/theme-types.js';

// Curated font pairings for different styles and use cases
const FONT_PAIRINGS: FontPairing[] = [
  {
    name: 'Professional Classic',
    description: 'Timeless combination perfect for corporate and traditional industries',
    heading: 'Playfair Display',
    body: 'Source Sans Pro',
    code: 'Source Code Pro',
    category: 'classic',
    googleFonts: true,
    fallbacks: ['Georgia', 'serif', 'Arial', 'sans-serif']
  },
  {
    name: 'Modern Tech',
    description: 'Clean, geometric fonts ideal for technology and startup resumes',
    heading: 'Inter',
    body: 'Inter',
    code: 'JetBrains Mono',
    category: 'modern',
    googleFonts: true,
    fallbacks: ['Helvetica', 'Arial', 'sans-serif']
  },
  {
    name: 'Creative Bold',
    description: 'Distinctive fonts for creative professionals and designers',
    heading: 'Montserrat',
    body: 'Open Sans',
    code: 'Fira Code',
    category: 'creative',
    googleFonts: true,
    fallbacks: ['Arial', 'sans-serif']
  },
  {
    name: 'Academic Serif',
    description: 'Traditional serif combination for academic and research positions',
    heading: 'Crimson Text',
    body: 'Crimson Text',
    code: 'Inconsolata',
    category: 'classic',
    googleFonts: true,
    fallbacks: ['Times New Roman', 'serif']
  },
  {
    name: 'Minimal Sans',
    description: 'Ultra-clean sans-serif for minimalist and modern designs',
    heading: 'Poppins',
    body: 'Nunito Sans',
    code: 'Roboto Mono',
    category: 'modern',
    googleFonts: true,
    fallbacks: ['Helvetica', 'Arial', 'sans-serif']
  },
  {
    name: 'Editorial Style',
    description: 'Magazine-inspired fonts for media and publishing professionals',
    heading: 'Libre Baskerville',
    body: 'Lato',
    code: 'Ubuntu Mono',
    category: 'classic',
    googleFonts: true,
    fallbacks: ['Georgia', 'serif', 'Arial', 'sans-serif']
  },
  {
    name: 'Tech Startup',
    description: 'Modern, approachable fonts for startup and tech company resumes',
    heading: 'Work Sans',
    body: 'Work Sans',
    code: 'Space Mono',
    category: 'modern',
    googleFonts: true,
    fallbacks: ['Helvetica', 'Arial', 'sans-serif']
  },
  {
    name: 'Artistic Flair',
    description: 'Expressive fonts for artists, designers, and creative directors',
    heading: 'Oswald',
    body: 'Merriweather',
    code: 'Courier Prime',
    category: 'creative',
    googleFonts: true,
    fallbacks: ['Arial', 'sans-serif', 'Georgia', 'serif']
  },
  {
    name: 'Corporate Executive',
    description: 'Authoritative fonts for senior management and executive positions',
    heading: 'Roboto Slab',
    body: 'Roboto',
    code: 'Roboto Mono',
    category: 'classic',
    googleFonts: true,
    fallbacks: ['Georgia', 'serif', 'Arial', 'sans-serif']
  },
  {
    name: 'Consultant Pro',
    description: 'Professional fonts that convey expertise and trustworthiness',
    heading: 'Merriweather',
    body: 'Source Sans Pro',
    code: 'Source Code Pro',
    category: 'classic',
    googleFonts: true,
    fallbacks: ['Georgia', 'serif', 'Arial', 'sans-serif']
  }
];

// System fonts for fallback and offline use
const SYSTEM_FONTS = {
  serif: ['Georgia', 'Times New Roman', 'Times', 'serif'],
  sansSerif: ['Helvetica', 'Arial', 'sans-serif'],
  monospace: ['Monaco', 'Menlo', 'Consolas', 'monospace']
};

// Font size scales for different resume formats
const FONT_SCALES = {
  compact: {
    h1: '1.5rem',
    h2: '1.25rem',
    h3: '1.125rem',
    body: '0.875rem',
    small: '0.75rem'
  },
  standard: {
    h1: '1.875rem',
    h2: '1.5rem',
    h3: '1.25rem',
    body: '1rem',
    small: '0.875rem'
  },
  large: {
    h1: '2.25rem',
    h2: '1.875rem',
    h3: '1.5rem',
    body: '1.125rem',
    small: '1rem'
  }
};

export class FontManager {
  /**
   * Get all available font pairings
   */
  static getAllPairings(): FontPairing[] {
    return FONT_PAIRINGS;
  }
  
  /**
   * Get font pairings by category
   */
  static getPairingsByCategory(category: 'classic' | 'modern' | 'creative' | 'technical'): FontPairing[] {
    return FONT_PAIRINGS.filter(pairing => pairing.category === category);
  }
  
  /**
   * Find font pairing by name
   */
  static getPairingByName(name: string): FontPairing | undefined {
    return FONT_PAIRINGS.find(pairing => 
      pairing.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  /**
   * Suggest font pairings based on industry and style preferences
   */
  static suggestPairings(industry: string, style: 'professional' | 'creative' | 'modern' | 'classic'): FontPairing[] {
    const industryMapping = {
      technology: ['modern', 'technical'],
      finance: ['classic', 'modern'],
      healthcare: ['classic', 'modern'],
      education: ['classic', 'modern'],
      creative: ['creative', 'modern'],
      consulting: ['classic', 'modern'],
      marketing: ['creative', 'modern'],
      engineering: ['technical', 'modern'],
      sales: ['modern', 'creative'],
      legal: ['classic'],
      nonprofit: ['classic', 'modern'],
      startup: ['modern', 'creative'],
      corporate: ['classic', 'modern'],
      freelance: ['creative', 'modern']
    };
    
    const preferredCategories = industryMapping[industry as keyof typeof industryMapping] || ['modern'];
    
    // Get pairings that match preferred categories
    let suggestions = FONT_PAIRINGS.filter(pairing => 
      preferredCategories.includes(pairing.category)
    );
    
    // If style is specified, prioritize matching styles
    if (style === 'classic') {
      suggestions = suggestions.filter(p => p.category === 'classic').concat(
        suggestions.filter(p => p.category !== 'classic')
      );
    } else if (style === 'creative') {
      suggestions = suggestions.filter(p => p.category === 'creative').concat(
        suggestions.filter(p => p.category !== 'creative')
      );
    } else if (style === 'modern') {
      suggestions = suggestions.filter(p => p.category === 'modern').concat(
        suggestions.filter(p => p.category !== 'modern')
      );
    }
    
    return suggestions.slice(0, 5); // Return top 5 suggestions
  }
  
  /**
   * Create font configuration from a pairing
   */
  static createConfiguration(pairing: FontPairing, scale: 'compact' | 'standard' | 'large' = 'standard'): FontConfiguration {
    const sizes = FONT_SCALES[scale];
    
    return {
      heading: {
        family: pairing.heading,
        weight: this.getOptimalWeight(pairing.heading, 'heading'),
        size: {
          h1: sizes.h1,
          h2: sizes.h2,
          h3: sizes.h3
        }
      },
      body: {
        family: pairing.body,
        weight: this.getOptimalWeight(pairing.body, 'body'),
        size: sizes.body,
        lineHeight: this.getOptimalLineHeight(pairing.body)
      },
      code: {
        family: pairing.code || 'monospace',
        size: sizes.small
      }
    };
  }
  
  /**
   * Generate CSS for font configuration
   */
  static generateCSS(config: FontConfiguration, includeGoogleFonts: boolean = true): string {
    let css = '';
    
    // Google Fonts import
    if (includeGoogleFonts) {
      const fonts = new Set([
        config.heading.family,
        config.body.family,
        config.code.family
      ]);
      
      const googleFontsUrl = this.generateGoogleFontsUrl(Array.from(fonts));
      if (googleFontsUrl) {
        css += `@import url('${googleFontsUrl}');\n\n`;
      }
    }
    
    // CSS custom properties
    css += `:root {\n`;
    css += `  --font-heading: '${config.heading.family}', ${this.getFallbacks(config.heading.family)};\n`;
    css += `  --font-body: '${config.body.family}', ${this.getFallbacks(config.body.family)};\n`;
    css += `  --font-code: '${config.code.family}', ${this.getFallbacks(config.code.family)};\n`;
    css += `  --font-weight-heading: ${config.heading.weight};\n`;
    css += `  --font-weight-body: ${config.body.weight};\n`;
    css += `  --font-size-h1: ${config.heading.size.h1};\n`;
    css += `  --font-size-h2: ${config.heading.size.h2};\n`;
    css += `  --font-size-h3: ${config.heading.size.h3};\n`;
    css += `  --font-size-body: ${config.body.size};\n`;
    css += `  --font-size-code: ${config.code.size};\n`;
    css += `  --line-height-body: ${config.body.lineHeight};\n`;
    css += `}\n\n`;
    
    // Base typography styles
    css += `body {\n`;
    css += `  font-family: var(--font-body);\n`;
    css += `  font-weight: var(--font-weight-body);\n`;
    css += `  font-size: var(--font-size-body);\n`;
    css += `  line-height: var(--line-height-body);\n`;
    css += `}\n\n`;
    
    css += `h1, h2, h3, h4, h5, h6 {\n`;
    css += `  font-family: var(--font-heading);\n`;
    css += `  font-weight: var(--font-weight-heading);\n`;
    css += `}\n\n`;
    
    css += `h1 { font-size: var(--font-size-h1); }\n`;
    css += `h2 { font-size: var(--font-size-h2); }\n`;
    css += `h3 { font-size: var(--font-size-h3); }\n\n`;
    
    css += `code, pre {\n`;
    css += `  font-family: var(--font-code);\n`;
    css += `  font-size: var(--font-size-code);\n`;
    css += `}\n`;
    
    return css;
  }
  
  /**
   * Validate font availability
   */
  static async validateFont(fontFamily: string): Promise<boolean> {
    // This would typically use the CSS Font Loading API
    // For now, we'll check against known Google Fonts
    const googleFonts = [
      'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
      'Playfair Display', 'Merriweather', 'Crimson Text', 'Libre Baskerville',
      'Work Sans', 'Poppins', 'Nunito Sans', 'Oswald', 'Roboto Slab',
      'Source Code Pro', 'JetBrains Mono', 'Fira Code', 'Inconsolata',
      'Space Mono', 'Ubuntu Mono', 'Courier Prime', 'Roboto Mono'
    ];
    
    return googleFonts.includes(fontFamily) || SYSTEM_FONTS.serif.includes(fontFamily) ||
           SYSTEM_FONTS.sansSerif.includes(fontFamily) || SYSTEM_FONTS.monospace.includes(fontFamily);
  }
  
  /**
   * Get optimal font weight for different use cases
   */
  private static getOptimalWeight(fontFamily: string, usage: 'heading' | 'body'): number {
    const weightMap = {
      heading: {
        'Playfair Display': 700,
        'Montserrat': 600,
        'Oswald': 500,
        'Roboto Slab': 700,
        'Work Sans': 600,
        default: 600
      },
      body: {
        'Inter': 400,
        'Open Sans': 400,
        'Source Sans Pro': 400,
        'Lato': 400,
        'Nunito Sans': 400,
        'Crimson Text': 400,
        'Merriweather': 400,
        default: 400
      }
    };
    
    return weightMap[usage][fontFamily as keyof typeof weightMap[typeof usage]] || weightMap[usage].default;
  }
  
  /**
   * Get optimal line height for readability
   */
  private static getOptimalLineHeight(fontFamily: string): string {
    const lineHeightMap: { [key: string]: string } = {
      'Inter': '1.5',
      'Open Sans': '1.6',
      'Source Sans Pro': '1.6',
      'Lato': '1.6',
      'Merriweather': '1.7',
      'Crimson Text': '1.7',
      'Libre Baskerville': '1.7'
    };
    
    return lineHeightMap[fontFamily] || '1.6';
  }
  
  /**
   * Generate Google Fonts URL
   */
  private static generateGoogleFontsUrl(fonts: string[]): string | null {
    const googleFonts = fonts.filter(font => 
      !SYSTEM_FONTS.serif.includes(font) &&
      !SYSTEM_FONTS.sansSerif.includes(font) &&
      !SYSTEM_FONTS.monospace.includes(font)
    );
    
    if (googleFonts.length === 0) return null;
    
    const fontParams = googleFonts.map(font => {
      const weights = this.getFontWeights(font);
      return `${font.replace(/ /g, '+')}:wght@${weights.join(';')}`;
    }).join('&family=');
    
    return `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap`;
  }
  
  /**
   * Get appropriate font weights for a font family
   */
  private static getFontWeights(fontFamily: string): number[] {
    const weightMap: { [key: string]: number[] } = {
      'Inter': [400, 500, 600, 700],
      'Roboto': [300, 400, 500, 700],
      'Open Sans': [400, 600, 700],
      'Montserrat': [400, 500, 600, 700],
      'Playfair Display': [400, 700],
      'Merriweather': [300, 400, 700],
      'Work Sans': [400, 500, 600]
    };
    
    return weightMap[fontFamily] || [400, 600, 700];
  }
  
  /**
   * Get fallback fonts for a given font family
   */
  private static getFallbacks(fontFamily: string): string {
    // Determine if the font is serif, sans-serif, or monospace
    const serifFonts = ['Playfair Display', 'Merriweather', 'Crimson Text', 'Libre Baskerville', 'Roboto Slab'];
    const monospaceFonts = ['Source Code Pro', 'JetBrains Mono', 'Fira Code', 'Inconsolata', 'Space Mono', 'Ubuntu Mono', 'Courier Prime', 'Roboto Mono'];
    
    if (serifFonts.includes(fontFamily)) {
      return SYSTEM_FONTS.serif.join(', ');
    } else if (monospaceFonts.includes(fontFamily)) {
      return SYSTEM_FONTS.monospace.join(', ');
    } else {
      return SYSTEM_FONTS.sansSerif.join(', ');
    }
  }
}
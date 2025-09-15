import { ColorPaletteGenerator } from './color-generator.js';
import { FontManager } from './font-manager.js';
// Popular company brand colors for reference
const COMPANY_BRAND_COLORS = {
    // Tech Companies
    google: { primary: '#4285f4', secondary: '#ea4335', accent: '#fbbc05' },
    microsoft: { primary: '#0078d4', secondary: '#00bcf2', accent: '#40e0d0' },
    apple: { primary: '#007aff', secondary: '#5856d6', accent: '#ff9500' },
    meta: { primary: '#1877f2', secondary: '#42a5f5', accent: '#e91e63' },
    amazon: { primary: '#ff9900', secondary: '#232f3e', accent: '#146eb4' },
    netflix: { primary: '#e50914', secondary: '#221f1f', accent: '#f5f5f1' },
    spotify: { primary: '#1db954', secondary: '#191414', accent: '#1ed760' },
    // Financial
    jpmorgan: { primary: '#0066b2', secondary: '#5a5a5a', accent: '#00a651' },
    goldman: { primary: '#0066cc', secondary: '#003d7a', accent: '#4d94ff' },
    visa: { primary: '#1a1f71', secondary: '#faa61a', accent: '#ee4036' },
    mastercard: { primary: '#eb001b', secondary: '#ff5f00', accent: '#f79e1b' },
    // Consulting
    mckinsey: { primary: '#0066cc', secondary: '#003d7a', accent: '#4d94ff' },
    bcg: { primary: '#0073e6', secondary: '#004d99', accent: '#3399ff' },
    bain: { primary: '#c41e3a', secondary: '#8b0000', accent: '#ff6b6b' },
    // Healthcare
    pfizer: { primary: '#0093d0', secondary: '#005eb8', accent: '#00b4d8' },
    jnj: { primary: '#cc0000', secondary: '#990000', accent: '#ff3333' },
    // Other
    nike: { primary: '#000000', secondary: '#ff6600', accent: '#ffffff' },
    cocacola: { primary: '#f40009', secondary: '#000000', accent: '#ffffff' },
    starbucks: { primary: '#00704a', secondary: '#d4af37', accent: '#f1f8e9' }
};
// Brand personality mappings
const BRAND_PERSONALITIES = {
    innovative: {
        colors: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'],
        fonts: ['Inter', 'Work Sans', 'Poppins'],
        style: 'modern'
    },
    trustworthy: {
        colors: ['#1e40af', '#059669', '#374151', '#0f172a'],
        fonts: ['Source Sans Pro', 'Roboto', 'Merriweather'],
        style: 'classic'
    },
    creative: {
        colors: ['#ec4899', '#f59e0b', '#8b5cf6', '#ef4444'],
        fonts: ['Montserrat', 'Oswald', 'Playfair Display'],
        style: 'creative'
    },
    professional: {
        colors: ['#374151', '#1e40af', '#059669', '#6b7280'],
        fonts: ['Roboto Slab', 'Source Sans Pro', 'Crimson Text'],
        style: 'classic'
    },
    energetic: {
        colors: ['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'],
        fonts: ['Work Sans', 'Montserrat', 'Open Sans'],
        style: 'modern'
    }
};
export class BrandKitManager {
    /**
     * Create a brand kit from company information
     */
    static createBrandKit(companyName, customColors) {
        const normalizedName = companyName.toLowerCase().replace(/[^a-z]/g, '');
        const companyColors = COMPANY_BRAND_COLORS[normalizedName];
        return {
            colors: customColors || companyColors || {
                primary: '#2563eb',
                secondary: '#64748b',
                accent: '#10b981'
            },
            fonts: this.suggestBrandFonts(companyName)
        };
    }
    /**
     * Apply brand kit to existing color palette
     */
    static applyBrandColors(palette, brandKit) {
        return {
            ...palette,
            primary: brandKit.colors.primary,
            secondary: brandKit.colors.secondary || palette.secondary,
            accent: brandKit.colors.accent || palette.accent,
            // Adjust other colors to harmonize with brand colors
            border: this.generateHarmoniousColor(brandKit.colors.primary, 'border'),
            surface: this.generateHarmoniousColor(brandKit.colors.primary, 'surface')
        };
    }
    /**
     * Generate brand-consistent theme
     */
    static generateBrandTheme(brandKit, personality = 'professional') {
        const personalityProfile = BRAND_PERSONALITIES[personality];
        // Create base palette using brand colors
        const basePalette = {
            primary: brandKit.colors.primary,
            secondary: brandKit.colors.secondary || personalityProfile.colors[1],
            accent: brandKit.colors.accent || personalityProfile.colors[2],
            background: '#ffffff',
            surface: this.generateHarmoniousColor(brandKit.colors.primary, 'surface'),
            text: {
                primary: this.getOptimalTextColor(brandKit.colors.primary),
                secondary: '#64748b',
                muted: '#94a3b8'
            },
            border: this.generateHarmoniousColor(brandKit.colors.primary, 'border'),
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        // Create font configuration
        const fontFamily = brandKit.fonts?.primary || personalityProfile.fonts[0];
        const fontPairing = FontManager.getPairingByName(this.findBestFontPairing(fontFamily));
        const fonts = fontPairing ? FontManager.createConfiguration(fontPairing) : this.createDefaultFontConfig();
        return { colors: basePalette, fonts };
    }
    /**
     * Validate brand kit compliance
     */
    static validateBrandKit(brandKit) {
        const issues = [];
        const suggestions = [];
        // Check color contrast
        if (brandKit.colors.primary && brandKit.colors.secondary) {
            const contrast = ColorPaletteGenerator.checkAccessibility(brandKit.colors.primary, brandKit.colors.secondary);
            if (contrast.level === 'fail') {
                issues.push('Primary and secondary colors have insufficient contrast');
                suggestions.push('Consider adjusting color lightness or choosing different colors');
            }
        }
        // Check color validity
        const colors = [brandKit.colors.primary, brandKit.colors.secondary, brandKit.colors.accent].filter(Boolean);
        for (const color of colors) {
            if (!this.isValidHexColor(color)) {
                issues.push(`Invalid color format: ${color}`);
                suggestions.push('Use valid hex color format (e.g., #ff0000)');
            }
        }
        // Check font availability
        if (brandKit.fonts?.primary) {
            // This would typically check font availability
            suggestions.push('Ensure custom fonts are properly loaded');
        }
        // Check logo configuration
        if (brandKit.logo) {
            if (!brandKit.logo.url) {
                issues.push('Logo URL is required when logo is specified');
            }
            if (brandKit.logo.url && !this.isValidUrl(brandKit.logo.url)) {
                issues.push('Invalid logo URL format');
                suggestions.push('Provide a valid URL to the logo image');
            }
        }
        return {
            isValid: issues.length === 0,
            issues,
            suggestions
        };
    }
    /**
     * Generate logo CSS for different positions
     */
    static generateLogoCSS(logo) {
        if (!logo)
            return '';
        const width = logo.width || 'auto';
        const height = logo.height || '40px';
        let css = `.resume-logo {\n`;
        css += `  background-image: url('${logo.url}');\n`;
        css += `  background-size: contain;\n`;
        css += `  background-repeat: no-repeat;\n`;
        css += `  width: ${width};\n`;
        css += `  height: ${height};\n`;
        css += `  display: inline-block;\n`;
        switch (logo.position) {
            case 'top-left':
                css += `  float: left;\n`;
                css += `  margin: 0 1rem 1rem 0;\n`;
                break;
            case 'top-right':
                css += `  float: right;\n`;
                css += `  margin: 0 0 1rem 1rem;\n`;
                break;
            case 'center':
                css += `  display: block;\n`;
                css += `  margin: 0 auto 1rem auto;\n`;
                break;
            case 'bottom':
                css += `  display: block;\n`;
                css += `  margin: 1rem auto 0 auto;\n`;
                break;
        }
        css += `}\n`;
        return css;
    }
    /**
     * Extract brand colors from logo image (placeholder for future implementation)
     */
    static async extractColorsFromLogo(logoUrl) {
        // This would typically use image processing to extract dominant colors
        // For now, return a default set
        console.log(`Color extraction from ${logoUrl} would be implemented here`);
        return {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#10b981'
        };
    }
    /**
     * Suggest fonts based on company/brand name
     */
    static suggestBrandFonts(companyName) {
        const name = companyName.toLowerCase();
        // Tech companies - modern sans-serif
        if (name.includes('tech') || name.includes('software') || name.includes('digital')) {
            return { primary: 'Inter', secondary: 'JetBrains Mono' };
        }
        // Financial - classic, trustworthy
        if (name.includes('bank') || name.includes('financial') || name.includes('capital')) {
            return { primary: 'Source Sans Pro', secondary: 'Roboto Slab' };
        }
        // Creative agencies - expressive
        if (name.includes('creative') || name.includes('design') || name.includes('agency')) {
            return { primary: 'Montserrat', secondary: 'Playfair Display' };
        }
        // Consulting - professional
        if (name.includes('consulting') || name.includes('advisory')) {
            return { primary: 'Merriweather', secondary: 'Source Sans Pro' };
        }
        // Default
        return { primary: 'Inter', secondary: 'Source Sans Pro' };
    }
    /**
     * Generate harmonious colors based on brand primary
     */
    static generateHarmoniousColor(primaryColor, type) {
        // Convert hex to HSL, adjust lightness
        const hsl = this.hexToHsl(primaryColor);
        switch (type) {
            case 'surface':
                return this.hslToHex(hsl.h, Math.max(hsl.s - 80, 5), Math.min(hsl.l + 45, 95));
            case 'border':
                return this.hslToHex(hsl.h, Math.max(hsl.s - 60, 10), Math.min(hsl.l + 30, 85));
            default:
                return primaryColor;
        }
    }
    /**
     * Get optimal text color for readability against brand color
     */
    static getOptimalTextColor(backgroundColor) {
        const contrast = ColorPaletteGenerator.checkAccessibility('#000000', backgroundColor);
        return contrast.level !== 'fail' ? '#000000' : '#ffffff';
    }
    /**
     * Find best font pairing that includes the specified font
     */
    static findBestFontPairing(fontFamily) {
        const pairings = FontManager.getAllPairings();
        const match = pairings.find(p => p.heading.includes(fontFamily) || p.body.includes(fontFamily));
        return match?.name || 'Professional Classic';
    }
    /**
     * Create default font configuration
     */
    static createDefaultFontConfig() {
        return {
            heading: {
                family: 'Inter',
                weight: 600,
                size: { h1: '1.875rem', h2: '1.5rem', h3: '1.25rem' }
            },
            body: {
                family: 'Inter',
                weight: 400,
                size: '1rem',
                lineHeight: '1.6'
            },
            code: {
                family: 'JetBrains Mono',
                size: '0.875rem'
            }
        };
    }
    /**
     * Validate hex color format
     */
    static isValidHexColor(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
    /**
     * Validate URL format
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    // Color utility functions (simplified versions)
    static hexToHsl(hex) {
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
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    static hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        const hue2rgb = (p, q, t) => {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        }
        else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
}
//# sourceMappingURL=brand-kit.js.map
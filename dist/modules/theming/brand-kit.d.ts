import { BrandKit, ColorPalette, FontConfiguration } from '../../data/theme-types.js';
declare const BRAND_PERSONALITIES: {
    innovative: {
        colors: string[];
        fonts: string[];
        style: string;
    };
    trustworthy: {
        colors: string[];
        fonts: string[];
        style: string;
    };
    creative: {
        colors: string[];
        fonts: string[];
        style: string;
    };
    professional: {
        colors: string[];
        fonts: string[];
        style: string;
    };
    energetic: {
        colors: string[];
        fonts: string[];
        style: string;
    };
};
export declare class BrandKitManager {
    /**
     * Create a brand kit from company information
     */
    static createBrandKit(companyName: string, customColors?: {
        primary: string;
        secondary?: string;
        accent?: string;
    }): BrandKit;
    /**
     * Apply brand kit to existing color palette
     */
    static applyBrandColors(palette: ColorPalette, brandKit: BrandKit): ColorPalette;
    /**
     * Generate brand-consistent theme
     */
    static generateBrandTheme(brandKit: BrandKit, personality?: keyof typeof BRAND_PERSONALITIES): {
        colors: ColorPalette;
        fonts: FontConfiguration;
    };
    /**
     * Validate brand kit compliance
     */
    static validateBrandKit(brandKit: BrandKit): {
        isValid: boolean;
        issues: string[];
        suggestions: string[];
    };
    /**
     * Generate logo CSS for different positions
     */
    static generateLogoCSS(logo: BrandKit['logo']): string;
    /**
     * Extract brand colors from logo image (placeholder for future implementation)
     */
    static extractColorsFromLogo(logoUrl: string): Promise<{
        primary: string;
        secondary: string;
        accent: string;
    }>;
    /**
     * Suggest fonts based on company/brand name
     */
    private static suggestBrandFonts;
    /**
     * Generate harmonious colors based on brand primary
     */
    private static generateHarmoniousColor;
    /**
     * Get optimal text color for readability against brand color
     */
    private static getOptimalTextColor;
    /**
     * Find best font pairing that includes the specified font
     */
    private static findBestFontPairing;
    /**
     * Create default font configuration
     */
    private static createDefaultFontConfig;
    /**
     * Validate hex color format
     */
    private static isValidHexColor;
    /**
     * Validate URL format
     */
    private static isValidUrl;
    private static hexToHsl;
    private static hslToHex;
}
export {};
//# sourceMappingURL=brand-kit.d.ts.map
import { FontConfiguration, FontPairing } from '../../data/theme-types.js';
export declare class FontManager {
    /**
     * Get all available font pairings
     */
    static getAllPairings(): FontPairing[];
    /**
     * Get font pairings by category
     */
    static getPairingsByCategory(category: 'classic' | 'modern' | 'creative' | 'technical'): FontPairing[];
    /**
     * Find font pairing by name
     */
    static getPairingByName(name: string): FontPairing | undefined;
    /**
     * Suggest font pairings based on industry and style preferences
     */
    static suggestPairings(industry: string, style: 'professional' | 'creative' | 'modern' | 'classic'): FontPairing[];
    /**
     * Create font configuration from a pairing
     */
    static createConfiguration(pairing: FontPairing, scale?: 'compact' | 'standard' | 'large'): FontConfiguration;
    /**
     * Generate CSS for font configuration
     */
    static generateCSS(config: FontConfiguration, includeGoogleFonts?: boolean): string;
    /**
     * Validate font availability
     */
    static validateFont(fontFamily: string): Promise<boolean>;
    /**
     * Get optimal font weight for different use cases
     */
    private static getOptimalWeight;
    /**
     * Get optimal line height for readability
     */
    private static getOptimalLineHeight;
    /**
     * Generate Google Fonts URL
     */
    private static generateGoogleFontsUrl;
    /**
     * Get appropriate font weights for a font family
     */
    private static getFontWeights;
    /**
     * Get fallback fonts for a given font family
     */
    private static getFallbacks;
}
//# sourceMappingURL=font-manager.d.ts.map
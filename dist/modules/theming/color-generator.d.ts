import { ColorSchemeRequest, GeneratedColorScheme } from '../../data/theme-types.js';
export declare class ColorPaletteGenerator {
    /**
     * Generate AI-suggested color schemes based on industry and preferences
     */
    static generateColorScheme(request: ColorSchemeRequest): GeneratedColorScheme[];
    /**
     * Generate color variations for a base color
     */
    static generateColorVariations(baseColor: string): string[];
    /**
     * Check color accessibility and contrast ratios
     */
    static checkAccessibility(foreground: string, background: string): {
        ratio: number;
        level: 'AA' | 'AAA' | 'fail';
    };
    private static selectPrimaryColor;
    private static buildPalette;
    private static calculateAccessibility;
    private static generateDescription;
    private static generateReasoning;
    private static calculateConfidence;
    private static hexToHsl;
    private static hslToHex;
    private static calculateContrastRatio;
    private static colorDistance;
}
//# sourceMappingURL=color-generator.d.ts.map
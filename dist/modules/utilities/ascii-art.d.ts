import { ThemeColors } from '../../data/types.js';
type FigletFont = 'Big' | 'Standard' | 'Small' | 'Slant' | 'Speed' | 'Starwars' | 'Cyberlarge' | 'Cybermedium' | 'Cybersmall' | 'Digital' | 'Doh' | 'Doom' | 'Epic' | 'Fuzzy' | 'Graffiti' | 'Isometric1' | 'Larry3d' | 'Nancyj' | 'Ogre' | 'Rectangles' | 'Roman' | 'Rounded' | 'Rowancap' | 'Shadow' | 'Slscript' | 'Smslant' | 'Stampatello' | 'Stop' | 'Straight' | 'Tanja' | 'Thick' | 'Thin' | 'Threepoint' | 'Twopoint' | 'Weird';
/**
 * ASCII Art Generator for resume CLI
 */
export declare class ASCIIArtGenerator {
    /**
     * Generate ASCII art banner for name
     */
    static generateNameBanner(name: string, font?: FigletFont, colors?: ThemeColors): Promise<string>;
    /**
     * Generate ASCII art for company logos (simplified)
     */
    static generateCompanyLogo(companyName: string): string;
    /**
     * Generate skill level bars using ASCII
     */
    static generateSkillBar(skillName: string, level: number, maxLevel?: number): string;
    /**
     * Generate decorative borders
     */
    static generateBorder(width?: number, style?: 'single' | 'double' | 'rounded'): string;
    /**
     * Generate ASCII progress indicator
     */
    static generateProgressIndicator(current: number, total: number): string;
    /**
     * Get available figlet fonts
     */
    static getAvailableFonts(): FigletFont[];
}
/**
 * ASCII Art themes for different styles
 */
export declare const ASCIIThemes: {
    matrix: {
        colors: string[];
        chars: string[];
        font: FigletFont;
    };
    retro: {
        colors: string[];
        chars: string[];
        font: FigletFont;
    };
    minimalist: {
        colors: string[];
        chars: string[];
        font: FigletFont;
    };
    cyberpunk: {
        colors: string[];
        chars: string[];
        font: FigletFont;
    };
};
export {};
//# sourceMappingURL=ascii-art.d.ts.map
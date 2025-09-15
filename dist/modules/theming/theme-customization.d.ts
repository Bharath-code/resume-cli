import { ResumeTheme } from '../../data/theme-types.js';
import { UserConfig } from '../../data/types.js';
export interface CustomizationOptions {
    baseTheme: string;
    colorScheme?: 'custom' | 'ai-generated' | 'preset';
    asciiStyle?: string;
    fontPairing?: string;
    layout?: 'compact' | 'spacious' | 'minimal';
    effects?: {
        gradients: boolean;
        shadows: boolean;
        animations: boolean;
    };
}
export declare class ThemeCustomizationInterface {
    private static currentTheme;
    private static customizationOptions;
    /**
     * Start interactive theme customization
     */
    static startCustomization(config: UserConfig): Promise<ResumeTheme | null>;
    /**
     * Select base theme
     */
    private static selectBaseTheme;
    /**
     * Customize colors
     */
    private static customizeColors;
    /**
     * Generate AI colors
     */
    private static generateAIColors;
    /**
     * Manual color selection
     */
    private static manualColorSelection;
    /**
     * Select preset colors
     */
    private static selectPresetColors;
    /**
     * Select ASCII style
     */
    private static selectASCIIStyle;
    /**
     * Customize fonts
     */
    private static customizeFonts;
    /**
     * Customize layout
     */
    private static customizeLayout;
    /**
     * Customize effects
     */
    private static customizeEffects;
    /**
     * Preview and finalize theme
     */
    private static previewAndFinalize;
    /**
     * Show theme preview
     */
    private static showThemePreview;
    /**
     * Quick theme customization (simplified version)
     */
    static quickCustomization(): Promise<ResumeTheme | null>;
}
export default ThemeCustomizationInterface;
//# sourceMappingURL=theme-customization.d.ts.map
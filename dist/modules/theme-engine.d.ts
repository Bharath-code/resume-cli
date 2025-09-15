import { ResumeTheme, ThemeConfiguration, ColorSchemeRequest, ThemePreview, ThemeValidation, BrandKit } from '../data/theme-types';
export declare class ThemeEngine {
    private static currentTheme;
    private static configuration;
    /**
     * Initialize theme configuration
     */
    static initializeConfiguration(): ThemeConfiguration;
    /**
     * Load configuration
     */
    static loadConfiguration(): ThemeConfiguration | null;
    /**
     * Create theme from template
     */
    static createFromTemplate(templateId: string, customizations?: Partial<ThemeConfiguration>): ResumeTheme;
    /**
     * Create custom theme
     */
    static createCustomTheme(request: ColorSchemeRequest, fontPairing?: string): ResumeTheme;
    /**
     * Create theme from brand kit
     */
    static createFromBrandKit(brandKit: BrandKit, personality?: 'innovative' | 'trustworthy' | 'creative' | 'professional' | 'energetic'): ResumeTheme;
    /**
     * Generate CSS for theme
     */
    static generateCSS(theme: ResumeTheme, mode?: 'light' | 'dark'): string;
    /**
     * Generate theme preview
     */
    static generatePreview(theme: ResumeTheme, sections?: string[]): ThemePreview;
    /**
     * Validate theme
     */
    static validateTheme(theme: ResumeTheme): ThemeValidation;
    /**
     * Apply theme to HTML
     */
    static applyThemeToHTML(html: string, theme: ResumeTheme, mode?: 'light' | 'dark'): string;
    /**
     * Get all available themes
     */
    static getAllThemes(): ResumeTheme[];
    /**
     * Get theme by ID
     */
    static getThemeById(id: string): ResumeTheme | undefined;
    private static getDefaultSpacing;
    private static getDefaultBorderRadius;
    private static getDefaultShadows;
    private static getDefaultLayout;
    private static generateFontImports;
    /**
     * Adjust color for dark mode
     */
    private static adjustColorForDarkMode;
}
//# sourceMappingURL=theme-engine.d.ts.map
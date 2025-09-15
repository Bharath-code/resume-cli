import { ResumeTheme } from '../../data/theme-types.js';
export interface ASCIIThemeConfig {
    id: string;
    name: string;
    description: string;
    colors: string[];
    chars: string[];
    font: string;
    effects: {
        gradient: boolean;
        glow: boolean;
        animation: boolean;
    };
}
export declare class ASCIIThemeManager {
    private static themes;
    /**
     * Initialize ASCII themes
     */
    private static initializeThemes;
    /**
     * Get all available ASCII themes
     */
    static getAllThemes(): ASCIIThemeConfig[];
    /**
     * Get ASCII theme by ID
     */
    static getTheme(id: string): ASCIIThemeConfig | undefined;
    /**
     * Apply ASCII styling to text
     */
    static applyASCIIStyle(text: string, themeId: string): string;
    /**
     * Generate ASCII border using theme characters
     */
    static generateBorder(themeId: string, width?: number): string;
    /**
     * Generate ASCII section divider
     */
    static generateSectionDivider(themeId: string, title: string, width?: number): string;
    /**
     * Generate ASCII progress bar
     */
    static generateProgressBar(themeId: string, progress: number, total?: number, width?: number): string;
    /**
     * Generate ASCII skill visualization
     */
    static generateSkillVisualization(themeId: string, skillName: string, level: number, maxLevel?: number): string;
    /**
     * Create ASCII art header
     */
    static createHeader(themeId: string, name: string, title: string): string;
    /**
     * Generate animated text effect (for supported themes)
     */
    static generateAnimatedText(themeId: string, text: string): string;
    /**
     * Integrate ASCII theme with resume theme
     */
    static integrateWithResumeTheme(resumeTheme: ResumeTheme, asciiThemeId: string): ResumeTheme;
    /**
     * Helper method to adjust color opacity
     */
    private static adjustColorOpacity;
    /**
     * Preview ASCII theme
     */
    static previewTheme(themeId: string): string;
}
export default ASCIIThemeManager;
//# sourceMappingURL=ascii-theme-manager.d.ts.map
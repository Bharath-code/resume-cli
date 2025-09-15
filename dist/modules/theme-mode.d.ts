import { ThemeMode, ColorPalette, ResumeTheme } from '../data/theme-types';
type ThemeModeValue = 'light' | 'dark' | 'auto';
/**
 * Theme Mode Manager
 * Handles dark/light mode switching and theme application
 */
export declare class ThemeModeManager {
    private static currentMode;
    private static mediaQuery;
    /**
     * Initialize theme mode manager
     */
    static initialize(defaultMode?: ThemeModeValue): void;
    /**
     * Set theme mode
     */
    static setMode(mode: ThemeModeValue): void;
    /**
     * Get current effective mode (resolves 'auto' to actual mode)
     */
    static getEffectiveMode(): 'light' | 'dark';
    /**
     * Get system color scheme preference
     */
    static getSystemPreference(): 'light' | 'dark';
    /**
     * Toggle between light and dark modes
     */
    static toggle(): void;
    /**
     * Handle system theme changes
     */
    private static handleSystemThemeChange;
    /**
     * Get stored theme preference
     */
    static getStoredPreference(): ThemeModeValue | null;
    /**
     * Check if a string is a valid theme mode
     */
    private static isValidThemeMode;
    /**
     * Convert light colors to dark mode
     */
    static convertToDarkMode(lightColors: ColorPalette): ColorPalette;
    /**
     * Convert dark colors to light mode
     */
    static convertToLightMode(darkColors: ColorPalette): ColorPalette;
    /**
     * Apply theme to HTML content
     */
    static applyThemeToHTML(html: string, theme: ResumeTheme, mode: ThemeMode): string;
    /**
     * Generate CSS for theme
     */
    static generateThemeCSS(colors: ColorPalette, fonts: any, mode: 'light' | 'dark'): string;
    /**
     * Create theme toggle button
     */
    static createToggleButton(): any;
    /**
     * Adjust color for dark mode
     */
    private static adjustColorForDarkMode;
    /**
     * Adjust color for light mode
     */
    private static adjustColorForLightMode;
    /**
     * Enable automatic theme switching based on time
     */
    static enableAutoSwitch(lightTime?: string, darkTime?: string): void;
    /**
     * Get current theme mode
     */
    static getCurrentMode(): ThemeModeValue;
    /**
     * Check if dark mode is active
     */
    static isDarkMode(): boolean;
    /**
     * Check if light mode is active
     */
    static isLightMode(): boolean;
    /**
     * Convert ThemeMode interface to simple mode value
     */
    static extractModeValue(themeMode: ThemeMode | ThemeModeValue): ThemeModeValue;
    /**
     * Create ThemeMode interface from mode value
     */
    static createThemeMode(mode: ThemeModeValue, autoSwitchTime?: {
        lightStart: string;
        darkStart: string;
    }): ThemeMode;
}
export default ThemeModeManager;
//# sourceMappingURL=theme-mode.d.ts.map
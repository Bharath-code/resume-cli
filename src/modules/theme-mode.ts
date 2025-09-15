import { ThemeMode, ColorPalette, ResumeTheme } from '../data/theme-types';

// Type declarations for browser environment
declare const window: any;
declare const document: any;
declare const localStorage: any;
declare const setInterval: any;

// Browser environment type guards
const isBrowser = typeof window !== 'undefined' && 
  typeof document !== 'undefined';

// Dark mode color adjustments
const DARK_MODE_ADJUSTMENTS = {
  backgroundLighten: 0.1,
  textDarken: 0.2,
  borderLighten: 0.15
};

// System theme query
const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

// Theme mode type for internal use
type ThemeModeValue = 'light' | 'dark' | 'auto';

/**
 * Theme Mode Manager
 * Handles dark/light mode switching and theme application
 */
export class ThemeModeManager {
  private static currentMode: ThemeModeValue = 'auto';
  private static mediaQuery: any = null;

  /**
   * Initialize theme mode manager
   */
  static initialize(defaultMode: ThemeModeValue = 'auto'): void {
    if (!isBrowser) return;
    
    this.mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    
    this.setMode(defaultMode);
  }

  /**
   * Set theme mode
   */
  static setMode(mode: ThemeModeValue): void {
    this.currentMode = mode;
    const effectiveMode = this.getEffectiveMode();
    
    // Apply theme to document if in browser
    if (isBrowser) {
      document.documentElement.setAttribute('data-theme', effectiveMode);
      document.documentElement.classList.toggle('dark', effectiveMode === 'dark');
      document.documentElement.classList.toggle('light', effectiveMode === 'light');
      
      // Store preference if not auto
      if (mode !== 'auto') {
        localStorage.setItem('theme-mode', mode);
      }
    }
  }

  /**
   * Get current effective mode (resolves 'auto' to actual mode)
   */
  static getEffectiveMode(): 'light' | 'dark' {
    if (this.currentMode === 'auto') {
      return this.getSystemPreference();
    }
    return this.currentMode === 'light' ? 'light' : 'dark';
  }

  /**
   * Get system color scheme preference
   */
  static getSystemPreference(): 'light' | 'dark' {
    if (isBrowser && this.mediaQuery) {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return 'light'; // Default fallback
  }

  /**
   * Toggle between light and dark modes
   */
  static toggle(): void {
    const currentEffective = this.getEffectiveMode();
    this.setMode(currentEffective === 'light' ? 'dark' : 'light');
  }

  /**
   * Handle system theme changes
   */
  private static handleSystemThemeChange(): void {
    if (this.currentMode === 'auto') {
      const effectiveMode = this.getEffectiveMode();
      
      if (isBrowser) {
        document.documentElement.setAttribute('data-theme', effectiveMode);
        document.documentElement.classList.toggle('dark', effectiveMode === 'dark');
        document.documentElement.classList.toggle('light', effectiveMode === 'light');
      }
    }
  }

  /**
   * Get stored theme preference
   */
  static getStoredPreference(): ThemeModeValue | null {
    if (!isBrowser) return null;
    
    const stored = localStorage.getItem('theme-mode');
    if (stored && this.isValidThemeMode(stored)) {
      return stored as ThemeModeValue;
    }
    return null;
  }

  /**
   * Check if a string is a valid theme mode
   */
  private static isValidThemeMode(mode: string): boolean {
    return mode === 'light' || mode === 'dark' || mode === 'auto';
  }

  /**
   * Convert light colors to dark mode
   */
  static convertToDarkMode(lightColors: ColorPalette): ColorPalette {
    return {
      primary: this.adjustColorForDarkMode(lightColors.primary),
      secondary: this.adjustColorForDarkMode(lightColors.secondary),
      accent: lightColors.accent, // Keep accent color vibrant
      background: '#0f0f0f',
      surface: '#1a1a1a',
      text: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        muted: '#a0a0a0'
      },
      border: '#333333',
      success: '#4ade80',
      warning: '#fbbf24',
      error: '#f87171'
    };
  }

  /**
   * Convert dark colors to light mode
   */
  static convertToLightMode(darkColors: ColorPalette): ColorPalette {
    return {
      primary: this.adjustColorForLightMode(darkColors.primary),
      secondary: this.adjustColorForLightMode(darkColors.secondary),
      accent: darkColors.accent, // Keep accent color vibrant
      background: '#ffffff',
      surface: '#f8f9fa',
      text: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        muted: '#6a6a6a'
      },
      border: '#e0e0e0',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626'
    };
  }

  /**
   * Apply theme to HTML content
   */
  static applyThemeToHTML(html: string, theme: ResumeTheme, mode: ThemeMode): string {
    const modeValue = typeof mode === 'object' ? mode.mode : mode as ThemeModeValue;
    const effectiveMode = modeValue === 'auto' ? this.getEffectiveMode() : (modeValue === 'light' ? 'light' : 'dark');
    const colors = effectiveMode === 'dark' ? theme.colors.dark : theme.colors.light;
    const css = this.generateThemeCSS(colors, theme.fonts, effectiveMode);
    
    // Inject CSS into HTML
    const cssTag = `<style id="theme-styles">${css}</style>`;
    
    if (html.includes('</head>')) {
      return html.replace('</head>', `${cssTag}</head>`);
    } else {
      return `${cssTag}${html}`;
    }
  }

  /**
   * Generate CSS for theme
   */
  static generateThemeCSS(colors: ColorPalette, fonts: any, mode: 'light' | 'dark'): string {
    return `
      :root {
        /* Color Variables */
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-surface: ${colors.surface};
        --color-text-primary: ${colors.text.primary};
        --color-text-secondary: ${colors.text.secondary};
        --color-text-muted: ${colors.text.muted};
        --color-border: ${colors.border};
        --color-success: ${colors.success};
        --color-warning: ${colors.warning};
        --color-error: ${colors.error};
        
        /* Font Variables */
        --font-heading: ${fonts.heading?.family || 'system-ui'};
        --font-body: ${fonts.body?.family || 'system-ui'};
        --font-code: ${fonts.code?.family || 'monospace'};
      }
      
      body {
        background-color: var(--color-background);
        color: var(--color-text-primary);
        font-family: var(--font-body);
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
        color: var(--color-text-primary);
      }
      
      .surface {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
      }
      
      .text-muted {
        color: var(--color-text-muted);
      }
      
      .text-secondary {
        color: var(--color-text-secondary);
      }
      
      .btn-primary {
        background-color: var(--color-primary);
        color: white;
        border: none;
      }
      
      .btn-secondary {
        background-color: var(--color-secondary);
        color: white;
        border: none;
      }
      
      .accent {
        color: var(--color-accent);
      }
      
      .success {
        color: var(--color-success);
      }
      
      .warning {
        color: var(--color-warning);
      }
      
      .error {
        color: var(--color-error);
      }
    `;
  }

  /**
   * Create theme toggle button
   */
  static createToggleButton(): any {
    if (!isBrowser) {
      // Return a mock button for server-side rendering
      return {};
    }

    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    
    const updateButton = () => {
      const mode = this.getEffectiveMode();
      button.textContent = mode === 'dark' ? '☀️' : '🌙';
      button.title = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    };
    
    button.addEventListener('click', () => {
      this.toggle();
      updateButton();
    });
    
    updateButton();
    return button;
  }

  /**
   * Adjust color for dark mode
   */
  private static adjustColorForDarkMode(color: string): string {
    // Simple color adjustment - in a real implementation, you'd use a color library
    if (color.startsWith('#')) {
      // Convert hex to RGB, adjust, and convert back
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // Darken the color for dark mode
      const newR = Math.max(0, Math.floor(r * 0.8));
      const newG = Math.max(0, Math.floor(g * 0.8));
      const newB = Math.max(0, Math.floor(b * 0.8));
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  /**
   * Adjust color for light mode
   */
  private static adjustColorForLightMode(color: string): string {
    // Simple color adjustment - in a real implementation, you'd use a color library
    if (color.startsWith('#')) {
      // Convert hex to RGB, adjust, and convert back
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      // Lighten the color for light mode
      const newR = Math.min(255, Math.floor(r * 1.2));
      const newG = Math.min(255, Math.floor(g * 1.2));
      const newB = Math.min(255, Math.floor(b * 1.2));
      
      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    return color;
  }

  /**
   * Enable automatic theme switching based on time
   */
  static enableAutoSwitch(lightTime: string = '06:00', darkTime: string = '18:00'): void {
    if (!isBrowser) return;
    
    const checkTime = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const [lightHour, lightMin] = lightTime.split(':').map(Number);
      const [darkHour, darkMin] = darkTime.split(':').map(Number);
      
      const lightMinutes = lightHour * 60 + lightMin;
      const darkMinutes = darkHour * 60 + darkMin;
      
      const shouldBeDark = currentTime >= darkMinutes || currentTime < lightMinutes;
      this.setMode(shouldBeDark ? 'dark' : 'light');
    };
    
    // Check immediately
    checkTime();
    
    // Set up automatic switching
    setInterval(checkTime, 60000); // Check every minute
  }

  /**
   * Get current theme mode
   */
  static getCurrentMode(): ThemeModeValue {
    return this.currentMode;
  }

  /**
   * Check if dark mode is active
   */
  static isDarkMode(): boolean {
    return this.getEffectiveMode() === 'dark';
  }

  /**
   * Check if light mode is active
   */
  static isLightMode(): boolean {
    return this.getEffectiveMode() === 'light';
  }

  /**
   * Convert ThemeMode interface to simple mode value
   */
  static extractModeValue(themeMode: ThemeMode | ThemeModeValue): ThemeModeValue {
    if (typeof themeMode === 'object') {
      return themeMode.mode;
    }
    return themeMode;
  }

  /**
   * Create ThemeMode interface from mode value
   */
  static createThemeMode(mode: ThemeModeValue, autoSwitchTime?: { lightStart: string; darkStart: string }): ThemeMode {
    return {
      mode,
      autoSwitchTime
    };
  }
}

// Auto-initialize if in browser
if (isBrowser) {
  // Initialize with stored preference or auto
  const stored = ThemeModeManager.getStoredPreference();
  ThemeModeManager.initialize(stored || 'auto');
}

export default ThemeModeManager;
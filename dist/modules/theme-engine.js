import { ColorPaletteGenerator } from './color-generator';
import { FontManager } from './font-manager';
import { BrandKitManager } from './brand-kit';
// Predefined theme templates
const PREDEFINED_THEMES = [
    {
        id: 'modern-professional',
        name: 'Modern Professional',
        description: 'Clean, modern design perfect for tech and business professionals',
        industry: 'technology',
        colors: {
            light: {
                primary: '#3b82f6',
                secondary: '#64748b',
                accent: '#10b981',
                background: '#ffffff',
                surface: '#f8fafc',
                text: {
                    primary: '#0f172a',
                    secondary: '#475569',
                    muted: '#64748b'
                },
                border: '#e2e8f0',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444'
            },
            dark: {
                primary: '#60a5fa',
                secondary: '#94a3b8',
                accent: '#34d399',
                background: '#0f172a',
                surface: '#1e293b',
                text: {
                    primary: '#f1f5f9',
                    secondary: '#cbd5e1',
                    muted: '#94a3b8'
                },
                border: '#334155',
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171'
            }
        },
        fonts: {
            heading: {
                family: 'Inter',
                weight: 600,
                size: {
                    h1: '1.875rem',
                    h2: '1.5rem',
                    h3: '1.25rem'
                }
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
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem'
        },
        borderRadius: {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem'
        },
        shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        layout: {
            maxWidth: '8.5in',
            padding: '0.75in',
            sectionSpacing: '1.5rem'
        }
    },
    {
        id: 'classic-executive',
        name: 'Classic Executive',
        description: 'Traditional, authoritative design for senior professionals',
        industry: 'finance',
        colors: {
            light: {
                primary: '#1e40af',
                secondary: '#374151',
                accent: '#059669',
                background: '#ffffff',
                surface: '#f9fafb',
                text: {
                    primary: '#111827',
                    secondary: '#4b5563',
                    muted: '#6b7280'
                },
                border: '#d1d5db',
                success: '#059669',
                warning: '#d97706',
                error: '#dc2626'
            },
            dark: {
                primary: '#3b82f6',
                secondary: '#6b7280',
                accent: '#10b981',
                background: '#111827',
                surface: '#1f2937',
                text: {
                    primary: '#f9fafb',
                    secondary: '#d1d5db',
                    muted: '#9ca3af'
                },
                border: '#374151',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444'
            }
        },
        fonts: {
            heading: {
                family: 'Merriweather',
                weight: 700,
                size: {
                    h1: '1.875rem',
                    h2: '1.5rem',
                    h3: '1.25rem'
                }
            },
            body: {
                family: 'Source Sans Pro',
                weight: 400,
                size: '1rem',
                lineHeight: '1.6'
            },
            code: {
                family: 'Source Code Pro',
                size: '0.875rem'
            }
        },
        spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem'
        },
        borderRadius: {
            sm: '0.125rem',
            md: '0.25rem',
            lg: '0.5rem'
        },
        shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        },
        layout: {
            maxWidth: '8.5in',
            padding: '1in',
            sectionSpacing: '2rem'
        }
    }
];
export class ThemeEngine {
    /**
     * Initialize theme configuration
     */
    static initializeConfiguration() {
        return {
            activeTheme: 'modern-professional',
            mode: { mode: 'auto' },
            previewMode: false
        };
    }
    /**
     * Load configuration
     */
    static loadConfiguration() {
        const config = this.configuration;
        if (!config) {
            return this.initializeConfiguration();
        }
        return config;
    }
    /**
     * Create theme from template
     */
    static createFromTemplate(templateId, customizations) {
        const template = PREDEFINED_THEMES.find(t => t.id === templateId);
        if (!template) {
            throw new Error(`Theme template '${templateId}' not found`);
        }
        const theme = { ...template };
        if (customizations?.customizations?.colors) {
            theme.colors.light = { ...theme.colors.light, ...customizations.customizations.colors };
            theme.colors.dark = { ...theme.colors.dark, ...customizations.customizations.colors };
        }
        if (customizations?.customizations?.fonts) {
            theme.fonts = { ...theme.fonts, ...customizations.customizations.fonts };
        }
        return theme;
    }
    /**
     * Create custom theme
     */
    static createCustomTheme(request, fontPairing) {
        const colorSchemes = ColorPaletteGenerator.generateColorScheme(request);
        const selectedScheme = colorSchemes[0]; // Use the first generated scheme
        const pairing = fontPairing
            ? FontManager.getPairingByName(fontPairing)
            : FontManager.getAllPairings()[0];
        const fontConfig = pairing
            ? FontManager.createConfiguration(pairing)
            : FontManager.createConfiguration(FontManager.getAllPairings()[0]);
        const lightColors = selectedScheme.palette;
        const darkColors = {
            primary: this.adjustColorForDarkMode(lightColors.primary),
            secondary: this.adjustColorForDarkMode(lightColors.secondary),
            accent: this.adjustColorForDarkMode(lightColors.accent),
            background: '#0f172a',
            surface: '#1e293b',
            text: {
                primary: '#f1f5f9',
                secondary: '#cbd5e1',
                muted: '#94a3b8'
            },
            border: '#334155',
            success: this.adjustColorForDarkMode(lightColors.success),
            warning: this.adjustColorForDarkMode(lightColors.warning),
            error: this.adjustColorForDarkMode(lightColors.error)
        };
        return {
            id: `custom-${Date.now()}`,
            name: `Custom ${request.industry} Theme`,
            description: selectedScheme.description,
            industry: request.industry,
            colors: {
                light: lightColors,
                dark: darkColors
            },
            fonts: fontConfig,
            spacing: this.getDefaultSpacing(),
            borderRadius: this.getDefaultBorderRadius(),
            shadows: this.getDefaultShadows(),
            layout: this.getDefaultLayout()
        };
    }
    /**
     * Create theme from brand kit
     */
    static createFromBrandKit(brandKit, personality = 'professional') {
        const brandTheme = BrandKitManager.generateBrandTheme(brandKit, personality);
        const darkColors = {
            primary: this.adjustColorForDarkMode(brandTheme.colors.primary),
            secondary: this.adjustColorForDarkMode(brandTheme.colors.secondary),
            accent: this.adjustColorForDarkMode(brandTheme.colors.accent),
            background: '#0f172a',
            surface: '#1e293b',
            text: {
                primary: '#f1f5f9',
                secondary: '#cbd5e1',
                muted: '#94a3b8'
            },
            border: '#334155',
            success: this.adjustColorForDarkMode(brandTheme.colors.success),
            warning: this.adjustColorForDarkMode(brandTheme.colors.warning),
            error: this.adjustColorForDarkMode(brandTheme.colors.error)
        };
        return {
            id: `brand-${Date.now()}`,
            name: `Brand Theme`,
            description: `Custom theme based on brand colors`,
            colors: {
                light: brandTheme.colors,
                dark: darkColors
            },
            fonts: brandTheme.fonts,
            spacing: this.getDefaultSpacing(),
            borderRadius: this.getDefaultBorderRadius(),
            shadows: this.getDefaultShadows(),
            layout: this.getDefaultLayout()
        };
    }
    /**
     * Generate CSS for theme
     */
    static generateCSS(theme, mode = 'light') {
        const colors = theme.colors[mode];
        const fonts = theme.fonts;
        return `
      :root {
        /* Colors */
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
        
        /* Fonts */
        --font-heading: '${fonts.heading.family}', sans-serif;
        --font-body: '${fonts.body.family}', sans-serif;
        --font-code: '${fonts.code.family}', monospace;
        
        /* Spacing */
        --spacing-xs: ${theme.spacing.xs};
        --spacing-sm: ${theme.spacing.sm};
        --spacing-md: ${theme.spacing.md};
        --spacing-lg: ${theme.spacing.lg};
        --spacing-xl: ${theme.spacing.xl};
        
        /* Border Radius */
        --radius-sm: ${theme.borderRadius.sm};
        --radius-md: ${theme.borderRadius.md};
        --radius-lg: ${theme.borderRadius.lg};
        
        /* Shadows */
        --shadow-sm: ${theme.shadows.sm};
        --shadow-md: ${theme.shadows.md};
        --shadow-lg: ${theme.shadows.lg};
      }
    `;
    }
    /**
     * Generate theme preview
     */
    static generatePreview(theme, sections = ['header', 'experience', 'skills']) {
        return {
            format: 'html',
            sections,
            outputPath: `preview-${theme.id}.html`
        };
    }
    /**
     * Validate theme
     */
    static validateTheme(theme) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        // Check color contrast
        const lightColors = theme.colors.light;
        const contrast = ColorPaletteGenerator.checkAccessibility(lightColors.text.primary, lightColors.background);
        if (contrast.level === 'fail') {
            errors.push('Text color does not meet accessibility standards');
        }
        else if (contrast.level === 'AA') {
            warnings.push('Consider improving color contrast for better accessibility');
        }
        // Check font availability
        if (!theme.fonts.heading.family) {
            errors.push('Heading font family is required');
        }
        if (!theme.fonts.body.family) {
            errors.push('Body font family is required');
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            suggestions
        };
    }
    /**
     * Apply theme to HTML
     */
    static applyThemeToHTML(html, theme, mode = 'light') {
        const css = this.generateCSS(theme, mode);
        const fontImports = this.generateFontImports(theme.fonts);
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Resume - ${theme.name}</title>
        ${fontImports}
        <style>
          ${css}
          body {
            font-family: var(--font-body);
            color: var(--color-text-primary);
            background-color: var(--color-background);
            line-height: 1.6;
            margin: 0;
            padding: var(--spacing-lg);
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            color: var(--color-primary);
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;
    }
    /**
     * Get all available themes
     */
    static getAllThemes() {
        return PREDEFINED_THEMES;
    }
    /**
     * Get theme by ID
     */
    static getThemeById(id) {
        return PREDEFINED_THEMES.find(theme => theme.id === id);
    }
    // Helper methods
    static getDefaultSpacing() {
        return {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem'
        };
    }
    static getDefaultBorderRadius() {
        return {
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem'
        };
    }
    static getDefaultShadows() {
        return {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        };
    }
    static getDefaultLayout() {
        return {
            maxWidth: '8.5in',
            padding: '0.75in',
            sectionSpacing: '1.5rem'
        };
    }
    static generateFontImports(fonts) {
        const fontFamilies = [
            fonts.heading.family,
            fonts.body.family,
            fonts.code.family
        ].filter((font, index, arr) => arr.indexOf(font) === index); // Remove duplicates
        const googleFonts = fontFamilies
            .filter(font => !['Arial', 'Helvetica', 'Times', 'Georgia', 'Courier'].includes(font))
            .map(font => font.replace(' ', '+'))
            .join('|');
        if (googleFonts) {
            return `<link href="https://fonts.googleapis.com/css2?family=${googleFonts}:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
        }
        return '';
    }
    /**
     * Adjust color for dark mode
     */
    static adjustColorForDarkMode(color) {
        // Simple color adjustment for dark mode
        // In a real implementation, you might use a color manipulation library
        return color; // For now, return the same color
    }
}
ThemeEngine.currentTheme = null;
ThemeEngine.configuration = null;
//# sourceMappingURL=theme-engine.js.map
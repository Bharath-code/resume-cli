import chalk from 'chalk';
import inquirer from 'inquirer';
import { ThemeEngine } from './theme-engine.js';
import { ASCIIThemeManager } from './ascii-theme-manager.js';
import { ColorPaletteGenerator } from './color-generator.js';
import { FontManager } from './font-manager.js';
import { AnimatedLoadingManager } from '../utilities/animated-loading.js';
export class ThemeCustomizationInterface {
    /**
     * Start interactive theme customization
     */
    static async startCustomization(config) {
        console.log(chalk.cyan.bold('\n🎨 Theme Customization Studio\n'));
        console.log(chalk.gray('Create your perfect resume theme with advanced customization options\n'));
        try {
            // Step 1: Choose base theme
            const baseTheme = await this.selectBaseTheme();
            if (!baseTheme)
                return null;
            // Step 2: Customize colors
            const colorCustomization = await this.customizeColors(baseTheme);
            // Step 3: Choose ASCII style (optional)
            const asciiStyle = await this.selectASCIIStyle();
            // Step 4: Font customization
            const fontCustomization = await this.customizeFonts(baseTheme);
            // Step 5: Layout and spacing
            const layoutCustomization = await this.customizeLayout(baseTheme);
            // Step 6: Effects and animations
            const effectsCustomization = await this.customizeEffects();
            // Step 7: Preview and finalize
            const finalTheme = await this.previewAndFinalize(baseTheme, colorCustomization, asciiStyle, fontCustomization, layoutCustomization, effectsCustomization);
            return finalTheme;
        }
        catch (error) {
            console.log(chalk.red('\n❌ Customization cancelled\n'));
            return null;
        }
    }
    /**
     * Select base theme
     */
    static async selectBaseTheme() {
        const themes = ThemeEngine.getAllThemes();
        const { selectedThemeId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedThemeId',
                message: 'Choose a base theme to customize:',
                choices: [
                    ...themes.map(theme => ({
                        name: `${theme.name} - ${theme.description}`,
                        value: theme.id
                    })),
                    { name: '🔙 Back to main menu', value: 'back' }
                ]
            }
        ]);
        if (selectedThemeId === 'back')
            return null;
        const theme = ThemeEngine.getThemeById(selectedThemeId);
        if (theme) {
            console.log(chalk.green(`\n✅ Selected base theme: ${theme.name}\n`));
            this.currentTheme = { ...theme };
        }
        return theme || null;
    }
    /**
     * Customize colors
     */
    static async customizeColors(baseTheme) {
        const { colorOption } = await inquirer.prompt([
            {
                type: 'list',
                name: 'colorOption',
                message: 'How would you like to customize colors?',
                choices: [
                    { name: '🤖 AI-Generated Color Scheme', value: 'ai' },
                    { name: '🎨 Manual Color Selection', value: 'manual' },
                    { name: '📋 Preset Color Palettes', value: 'preset' },
                    { name: '⏭️ Skip color customization', value: 'skip' }
                ]
            }
        ]);
        switch (colorOption) {
            case 'ai':
                return await this.generateAIColors();
            case 'manual':
                return await this.manualColorSelection(baseTheme);
            case 'preset':
                return await this.selectPresetColors();
            default:
                return null;
        }
    }
    /**
     * Generate AI colors
     */
    static async generateAIColors() {
        const { industry, personality, baseColor } = await inquirer.prompt([
            {
                type: 'list',
                name: 'industry',
                message: 'What industry are you in?',
                choices: [
                    'technology', 'finance', 'healthcare', 'education', 'creative',
                    'consulting', 'marketing', 'engineering', 'sales', 'legal'
                ]
            },
            {
                type: 'list',
                name: 'personality',
                message: 'What personality should your resume convey?',
                choices: ['professional', 'creative', 'modern', 'classic', 'bold']
            },
            {
                type: 'input',
                name: 'baseColor',
                message: 'Enter a base color (hex code, optional):',
                validate: (input) => {
                    if (!input)
                        return true;
                    return /^#[0-9A-F]{6}$/i.test(input) || 'Please enter a valid hex color (e.g., #3b82f6)';
                }
            }
        ]);
        const spinnerId = AnimatedLoadingManager.createAndStartSpinner('building', { text: 'Generating AI color schemes...' });
        try {
            const request = {
                industry: industry,
                personality,
                preferences: baseColor ? { favoriteColors: [baseColor] } : undefined
            };
            const colorSchemes = ColorPaletteGenerator.generateColorScheme(request);
            AnimatedLoadingManager.stopSpinner(spinnerId);
            const { selectedScheme } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedScheme',
                    message: 'Choose a generated color scheme:',
                    choices: colorSchemes.map((scheme, index) => ({
                        name: `${scheme.description}`,
                        value: index
                    }))
                }
            ]);
            return { palette: colorSchemes[selectedScheme].palette };
        }
        catch (error) {
            AnimatedLoadingManager.stopSpinner(spinnerId);
            console.log(chalk.red('Failed to generate AI colors. Using default colors.'));
            return null;
        }
    }
    /**
     * Manual color selection
     */
    static async manualColorSelection(baseTheme) {
        const colors = await inquirer.prompt([
            {
                type: 'input',
                name: 'primary',
                message: 'Primary color (hex):',
                default: baseTheme.colors.light.primary,
                validate: (input) => /^#[0-9A-F]{6}$/i.test(input) || 'Please enter a valid hex color'
            },
            {
                type: 'input',
                name: 'secondary',
                message: 'Secondary color (hex):',
                default: baseTheme.colors.light.secondary,
                validate: (input) => /^#[0-9A-F]{6}$/i.test(input) || 'Please enter a valid hex color'
            },
            {
                type: 'input',
                name: 'accent',
                message: 'Accent color (hex):',
                default: baseTheme.colors.light.accent,
                validate: (input) => /^#[0-9A-F]{6}$/i.test(input) || 'Please enter a valid hex color'
            }
        ]);
        return { palette: colors };
    }
    /**
     * Select preset colors
     */
    static async selectPresetColors() {
        const presets = [
            { name: 'Ocean Blue', colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8' } },
            { name: 'Forest Green', colors: { primary: '#059669', secondary: '#047857', accent: '#10b981' } },
            { name: 'Sunset Orange', colors: { primary: '#ea580c', secondary: '#c2410c', accent: '#fb923c' } },
            { name: 'Royal Purple', colors: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a855f7' } },
            { name: 'Cherry Red', colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444' } }
        ];
        const { selectedPreset } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedPreset',
                message: 'Choose a color preset:',
                choices: presets.map((preset, index) => ({
                    name: preset.name,
                    value: index
                }))
            }
        ]);
        return { palette: presets[selectedPreset].colors };
    }
    /**
     * Select ASCII style
     */
    static async selectASCIIStyle() {
        const asciiThemes = ASCIIThemeManager.getAllThemes();
        const { useASCII } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'useASCII',
                message: 'Would you like to add ASCII art styling?',
                default: false
            }
        ]);
        if (!useASCII)
            return null;
        const { selectedASCII } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedASCII',
                message: 'Choose an ASCII art style:',
                choices: [
                    ...asciiThemes.map(theme => ({
                        name: `${theme.name} - ${theme.description}`,
                        value: theme.id
                    })),
                    { name: '❌ No ASCII styling', value: null }
                ]
            }
        ]);
        if (selectedASCII) {
            // Show preview
            console.log(chalk.cyan('\n📋 ASCII Style Preview:'));
            console.log(ASCIIThemeManager.previewTheme(selectedASCII));
            console.log('');
        }
        return selectedASCII;
    }
    /**
     * Customize fonts
     */
    static async customizeFonts(baseTheme) {
        const { customizeFonts } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'customizeFonts',
                message: 'Would you like to customize fonts?',
                default: false
            }
        ]);
        if (!customizeFonts)
            return null;
        const fontPairings = FontManager.getAllPairings();
        const { selectedPairing } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedPairing',
                message: 'Choose a font pairing:',
                choices: fontPairings.map(pairing => ({
                    name: `${pairing.name} - ${pairing.description}`,
                    value: pairing.name
                }))
            }
        ]);
        const pairing = FontManager.getPairingByName(selectedPairing);
        return pairing ? FontManager.createConfiguration(pairing) : null;
    }
    /**
     * Customize layout
     */
    static async customizeLayout(baseTheme) {
        const { layoutStyle, spacing } = await inquirer.prompt([
            {
                type: 'list',
                name: 'layoutStyle',
                message: 'Choose a layout style:',
                choices: [
                    { name: 'Compact - Dense information layout', value: 'compact' },
                    { name: 'Spacious - Generous whitespace', value: 'spacious' },
                    { name: 'Minimal - Ultra-clean design', value: 'minimal' },
                    { name: 'Standard - Balanced layout', value: 'standard' }
                ]
            },
            {
                type: 'list',
                name: 'spacing',
                message: 'Section spacing preference:',
                choices: [
                    { name: 'Tight - 1rem spacing', value: '1rem' },
                    { name: 'Normal - 1.5rem spacing', value: '1.5rem' },
                    { name: 'Loose - 2rem spacing', value: '2rem' },
                    { name: 'Extra Loose - 3rem spacing', value: '3rem' }
                ]
            }
        ]);
        return { layoutStyle, spacing };
    }
    /**
     * Customize effects
     */
    static async customizeEffects() {
        const effects = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedEffects',
                message: 'Choose visual effects to enable:',
                choices: [
                    { name: 'Gradient backgrounds', value: 'gradients' },
                    { name: 'Drop shadows', value: 'shadows' },
                    { name: 'Subtle animations', value: 'animations' },
                    { name: 'Glow effects', value: 'glow' },
                    { name: 'Border radius', value: 'borderRadius' }
                ]
            }
        ]);
        return {
            gradients: effects.selectedEffects.includes('gradients'),
            shadows: effects.selectedEffects.includes('shadows'),
            animations: effects.selectedEffects.includes('animations'),
            glow: effects.selectedEffects.includes('glow'),
            borderRadius: effects.selectedEffects.includes('borderRadius')
        };
    }
    /**
     * Preview and finalize theme
     */
    static async previewAndFinalize(baseTheme, colorCustomization, asciiStyle, fontCustomization, layoutCustomization, effectsCustomization) {
        // Create final theme
        let finalTheme = { ...baseTheme };
        // Apply customizations
        if (colorCustomization?.palette) {
            finalTheme.colors.light = {
                ...finalTheme.colors.light,
                ...colorCustomization.palette
            };
            finalTheme.colors.dark = {
                ...finalTheme.colors.dark,
                ...colorCustomization.palette
            };
        }
        if (fontCustomization) {
            finalTheme.fonts = fontCustomization;
        }
        if (layoutCustomization) {
            if (layoutCustomization.spacing) {
                finalTheme.layout.sectionSpacing = layoutCustomization.spacing;
            }
        }
        // Apply ASCII styling if selected
        if (asciiStyle) {
            finalTheme = ASCIIThemeManager.integrateWithResumeTheme(finalTheme, asciiStyle);
        }
        // Update theme metadata
        finalTheme.id = `custom-${Date.now()}`;
        finalTheme.name = `Custom ${baseTheme.name}`;
        finalTheme.description = `Customized version of ${baseTheme.name}`;
        // Show preview
        console.log(chalk.cyan.bold('\n🔍 Theme Preview:\n'));
        this.showThemePreview(finalTheme, asciiStyle);
        const { confirmTheme } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmTheme',
                message: 'Are you satisfied with this theme?',
                default: true
            }
        ]);
        if (confirmTheme) {
            const { themeName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'themeName',
                    message: 'Give your custom theme a name:',
                    default: finalTheme.name
                }
            ]);
            finalTheme.name = themeName;
            console.log(chalk.green(`\n✅ Custom theme "${themeName}" created successfully!\n`));
            return finalTheme;
        }
        return null;
    }
    /**
     * Show theme preview
     */
    static showThemePreview(theme, asciiStyle) {
        const colors = theme.colors.light;
        // Header preview
        console.log(chalk.hex(colors.primary).bold('JOHN DOE'));
        console.log(chalk.hex(colors.secondary)('Software Engineer'));
        console.log(chalk.hex(colors.border)('─'.repeat(40)));
        // Section preview
        console.log(chalk.hex(colors.accent).bold('\nEXPERIENCE'));
        console.log(chalk.hex(colors.text.primary)('Senior Developer @ Tech Corp'));
        console.log(chalk.hex(colors.text.secondary)('2020 - Present'));
        // Skills preview
        console.log(chalk.hex(colors.accent).bold('\nSKILLS'));
        console.log(chalk.hex(colors.text.primary)('JavaScript ') + chalk.hex(colors.success)('████████░░'));
        console.log(chalk.hex(colors.text.primary)('Python    ') + chalk.hex(colors.success)('███████░░░'));
        // ASCII preview if applicable
        if (asciiStyle) {
            console.log(chalk.cyan('\nASCII Styling:'));
            console.log(ASCIIThemeManager.generateBorder(asciiStyle, 30));
        }
        console.log('');
    }
    /**
     * Quick theme customization (simplified version)
     */
    static async quickCustomization() {
        console.log(chalk.cyan.bold('\n⚡ Quick Theme Customization\n'));
        const { quickOptions } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'quickOptions',
                message: 'Select quick customization options:',
                choices: [
                    { name: '🎨 Change primary color', value: 'color' },
                    { name: '🔤 Change font style', value: 'font' },
                    { name: '🎭 Add ASCII styling', value: 'ascii' },
                    { name: '📐 Adjust spacing', value: 'spacing' }
                ]
            }
        ]);
        if (quickOptions.length === 0) {
            console.log(chalk.yellow('No customizations selected.'));
            return null;
        }
        // Apply quick customizations...
        // Implementation would be similar but simplified
        return null;
    }
}
ThemeCustomizationInterface.currentTheme = null;
ThemeCustomizationInterface.customizationOptions = null;
export default ThemeCustomizationInterface;
//# sourceMappingURL=theme-customization.js.map
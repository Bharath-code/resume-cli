var _a;
import chalk from 'chalk';
import gradient from 'gradient-string';
export class ASCIIThemeManager {
    /**
     * Initialize ASCII themes
     */
    static initializeThemes() {
        // Matrix theme
        this.themes.set('matrix', {
            id: 'matrix',
            name: 'Matrix Digital Rain',
            description: 'Green cascading code aesthetic inspired by The Matrix',
            colors: ['#00ff41', '#008f11', '#39ff14'],
            chars: ['0', '1', '█', '▓', '▒', '░', '╬', '╫', '╪'],
            font: 'Digital',
            effects: {
                gradient: true,
                glow: true,
                animation: true
            }
        });
        // Retro synthwave theme
        this.themes.set('retro', {
            id: 'retro',
            name: 'Retro Synthwave',
            description: 'Neon-soaked 80s aesthetic with vibrant colors',
            colors: ['#ff006e', '#8338ec', '#ffbe0b', '#06ffa5'],
            chars: ['▀', '▄', '█', '▌', '▐', '■', '▲', '▼', '◆'],
            font: 'Starwars',
            effects: {
                gradient: true,
                glow: true,
                animation: false
            }
        });
        // Minimalist theme
        this.themes.set('minimalist', {
            id: 'minimalist',
            name: 'Minimalist Clean',
            description: 'Clean lines and subtle ASCII elements',
            colors: ['#2563eb', '#64748b', '#0ea5e9'],
            chars: ['─', '│', '┌', '┐', '└', '┘', '├', '┤', '┬'],
            font: 'Standard',
            effects: {
                gradient: false,
                glow: false,
                animation: false
            }
        });
        // Cyberpunk theme
        this.themes.set('cyberpunk', {
            id: 'cyberpunk',
            name: 'Cyberpunk Neon',
            description: 'High-tech low-life aesthetic with electric colors',
            colors: ['#ff0080', '#0080ff', '#80ff00', '#ff8000'],
            chars: ['▲', '▼', '◆', '◇', '●', '○', '◢', '◣', '◤'],
            font: 'Cyberlarge',
            effects: {
                gradient: true,
                glow: true,
                animation: true
            }
        });
    }
    /**
     * Get all available ASCII themes
     */
    static getAllThemes() {
        return Array.from(this.themes.values());
    }
    /**
     * Get ASCII theme by ID
     */
    static getTheme(id) {
        return this.themes.get(id);
    }
    /**
     * Apply ASCII styling to text
     */
    static applyASCIIStyle(text, themeId) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            return text;
        }
        let styledText = text;
        // Apply gradient effect
        if (theme.effects.gradient && theme.colors.length > 1) {
            const gradientColors = theme.colors.slice(0, 2);
            styledText = gradient(gradientColors)(text);
        }
        else {
            // Apply single color
            styledText = chalk.hex(theme.colors[0])(text);
        }
        // Apply glow effect (using background color)
        if (theme.effects.glow) {
            const glowColor = theme.colors[0];
            styledText = chalk.bgHex(this.adjustColorOpacity(glowColor, 0.1))(styledText);
        }
        return styledText;
    }
    /**
     * Generate ASCII border using theme characters
     */
    static generateBorder(themeId, width = 50) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            return '─'.repeat(width);
        }
        const borderChars = theme.chars.filter(char => ['─', '│', '┌', '┐', '└', '┘', '█', '▀', '▄'].includes(char));
        if (borderChars.length === 0) {
            return theme.chars[0].repeat(width);
        }
        const borderChar = borderChars[0];
        const border = borderChar.repeat(width);
        return this.applyASCIIStyle(border, themeId);
    }
    /**
     * Generate ASCII section divider
     */
    static generateSectionDivider(themeId, title, width = 50) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            return `\n${title}\n${'─'.repeat(width)}\n`;
        }
        const titleStyled = this.applyASCIIStyle(title, themeId);
        const border = this.generateBorder(themeId, width);
        return `\n${titleStyled}\n${border}\n`;
    }
    /**
     * Generate ASCII progress bar
     */
    static generateProgressBar(themeId, progress, total = 100, width = 20) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            const filled = Math.floor((progress / total) * width);
            return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}]`;
        }
        const percentage = Math.min(progress / total, 1);
        const filled = Math.floor(percentage * width);
        const empty = width - filled;
        // Use theme-specific characters
        const fillChar = theme.chars.find(char => ['█', '▓', '■'].includes(char)) || theme.chars[0];
        const emptyChar = theme.chars.find(char => ['░', '▒', '○'].includes(char)) || theme.chars[1] || ' ';
        const filledPart = this.applyASCIIStyle(fillChar.repeat(filled), themeId);
        const emptyPart = chalk.gray(emptyChar.repeat(empty));
        return `[${filledPart}${emptyPart}]`;
    }
    /**
     * Generate ASCII skill visualization
     */
    static generateSkillVisualization(themeId, skillName, level, maxLevel = 10) {
        const theme = this.getTheme(themeId);
        const progressBar = this.generateProgressBar(themeId, level, maxLevel, 10);
        const skillNameStyled = this.applyASCIIStyle(skillName, themeId);
        return `${skillNameStyled.padEnd(20)} ${progressBar} ${level}/${maxLevel}`;
    }
    /**
     * Create ASCII art header
     */
    static createHeader(themeId, name, title) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            return `${name}\n${title}`;
        }
        const nameStyled = this.applyASCIIStyle(name.toUpperCase(), themeId);
        const titleStyled = chalk.gray(title);
        const border = this.generateBorder(themeId, Math.max(name.length, title.length) + 4);
        return `${border}\n${nameStyled}\n${titleStyled}\n${border}`;
    }
    /**
     * Generate animated text effect (for supported themes)
     */
    static generateAnimatedText(themeId, text) {
        const theme = this.getTheme(themeId);
        if (!theme || !theme.effects.animation) {
            return this.applyASCIIStyle(text, themeId);
        }
        // For matrix theme, add random characters
        if (themeId === 'matrix') {
            const chars = theme.chars;
            const animatedChars = text.split('').map(char => {
                if (Math.random() < 0.1) {
                    return chars[Math.floor(Math.random() * chars.length)];
                }
                return char;
            }).join('');
            return this.applyASCIIStyle(animatedChars, themeId);
        }
        return this.applyASCIIStyle(text, themeId);
    }
    /**
     * Integrate ASCII theme with resume theme
     */
    static integrateWithResumeTheme(resumeTheme, asciiThemeId) {
        const asciiTheme = this.getTheme(asciiThemeId);
        if (!asciiTheme) {
            return resumeTheme;
        }
        // Create enhanced theme with ASCII styling
        const enhancedTheme = {
            ...resumeTheme,
            id: `${resumeTheme.id}-${asciiThemeId}`,
            name: `${resumeTheme.name} (${asciiTheme.name})`,
            description: `${resumeTheme.description} Enhanced with ${asciiTheme.description}`,
            colors: {
                light: {
                    ...resumeTheme.colors.light,
                    primary: asciiTheme.colors[0],
                    accent: asciiTheme.colors[1] || asciiTheme.colors[0]
                },
                dark: {
                    ...resumeTheme.colors.dark,
                    primary: asciiTheme.colors[0],
                    accent: asciiTheme.colors[1] || asciiTheme.colors[0]
                }
            }
        };
        return enhancedTheme;
    }
    /**
     * Helper method to adjust color opacity
     */
    static adjustColorOpacity(hexColor, opacity) {
        // Convert hex to rgba with opacity
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    /**
     * Preview ASCII theme
     */
    static previewTheme(themeId) {
        const theme = this.getTheme(themeId);
        if (!theme) {
            return 'Theme not found';
        }
        const preview = [
            this.createHeader(themeId, 'JOHN DOE', 'Software Engineer'),
            '',
            this.generateSectionDivider(themeId, 'SKILLS', 40),
            this.generateSkillVisualization(themeId, 'JavaScript', 9, 10),
            this.generateSkillVisualization(themeId, 'Python', 8, 10),
            this.generateSkillVisualization(themeId, 'React', 7, 10),
            '',
            this.generateSectionDivider(themeId, 'EXPERIENCE', 40),
            this.applyASCIIStyle('Senior Developer @ Tech Corp', themeId),
            chalk.gray('2020 - Present'),
            '',
            this.generateBorder(themeId, 40)
        ];
        return preview.join('\n');
    }
}
_a = ASCIIThemeManager;
ASCIIThemeManager.themes = new Map();
(() => {
    // Initialize ASCII themes from the existing ASCIIThemes
    _a.initializeThemes();
})();
export default ASCIIThemeManager;
//# sourceMappingURL=ascii-theme-manager.js.map
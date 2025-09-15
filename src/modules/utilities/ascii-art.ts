import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';
import { ThemeColors } from '../../data/types.js';

type FigletFont = 'Big' | 'Standard' | 'Small' | 'Slant' | 'Speed' | 'Starwars' | 
  'Cyberlarge' | 'Cybermedium' | 'Cybersmall' | 'Digital' | 'Doh' | 'Doom' | 
  'Epic' | 'Fuzzy' | 'Graffiti' | 'Isometric1' | 'Larry3d' | 'Nancyj' | 'Ogre' | 
  'Rectangles' | 'Roman' | 'Rounded' | 'Rowancap' | 'Shadow' | 'Slscript' | 
  'Smslant' | 'Stampatello' | 'Stop' | 'Straight' | 'Tanja' | 'Thick' | 'Thin' | 
  'Threepoint' | 'Twopoint' | 'Weird';

/**
 * ASCII Art Generator for resume CLI
 */
export class ASCIIArtGenerator {
  /**
   * Generate ASCII art banner for name
   */
  static async generateNameBanner(
    name: string, 
    font: FigletFont = 'Big',
    colors?: ThemeColors
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      figlet.text(name, { font }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!data) {
          resolve(name);
          return;
        }
        
        // Apply colors if provided
        if (colors) {
          const coloredBanner = chalk.hex(colors.primary)(data);
          resolve(coloredBanner);
        } else {
          // Default gradient effect
          const gradientBanner = gradient.rainbow(data);
          resolve(gradientBanner);
        }
      });
    });
  }
  
  /**
   * Generate ASCII art for company logos (simplified)
   */
  static generateCompanyLogo(companyName: string): string {
    const logos: Record<string, string> = {
      'google': `
   ██████╗  ██████╗  ██████╗  ██████╗ ██╗     ███████╗
  ██╔════╝ ██╔═══██╗██╔═══██╗██╔════╝ ██║     ██╔════╝
  ██║  ███╗██║   ██║██║   ██║██║  ███╗██║     █████╗  
  ██║   ██║██║   ██║██║   ██║██║   ██║██║     ██╔══╝  
  ╚██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗
   ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝`,
      'microsoft': `
  ███╗   ███╗███████╗
  ████╗ ████║██╔════╝
  ██╔████╔██║███████╗
  ██║╚██╔╝██║╚════██║
  ██║ ╚═╝ ██║███████║
  ╚═╝     ╚═╝╚══════╝`,
      'apple': `
      ██╗
     ████╗
    ██╔══██╗
   ██╔╝  ╚██╗
  ██╔╝    ╚██╗
  ╚██╗    ██╔╝
   ╚██╗  ██╔╝
    ╚██████╔╝
     ╚═════╝`,
      'default': `
  ┌─────────────────┐
  │   ${companyName.toUpperCase().padEnd(12)}  │
  └─────────────────┘`
    };
    
    const logo = logos[companyName.toLowerCase()] || logos.default;
    return chalk.cyan(logo);
  }
  
  /**
   * Generate skill level bars using ASCII
   */
  static generateSkillBar(skillName: string, level: number, maxLevel: number = 10): string {
    const barLength = 20;
    const filledLength = Math.round((level / maxLevel) * barLength);
    const emptyLength = barLength - filledLength;
    
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(emptyLength);
    
    let coloredBar;
    if (level >= 8) {
      coloredBar = chalk.green(filled) + chalk.gray(empty);
    } else if (level >= 6) {
      coloredBar = chalk.yellow(filled) + chalk.gray(empty);
    } else {
      coloredBar = chalk.red(filled) + chalk.gray(empty);
    }
    
    return `${skillName.padEnd(20)} [${coloredBar}] ${level}/${maxLevel}`;
  }
  
  /**
   * Generate decorative borders
   */
  static generateBorder(width: number = 50, style: 'single' | 'double' | 'rounded' = 'single'): string {
    const styles = {
      single: { top: '─', corner: '┌┐└┘', side: '│' },
      double: { top: '═', corner: '╔╗╚╝', side: '║' },
      rounded: { top: '─', corner: '╭╮╰╯', side: '│' }
    };
    
    const { top, corner, side } = styles[style];
    const topLine = corner[0] + top.repeat(width - 2) + corner[1];
    const bottomLine = corner[2] + top.repeat(width - 2) + corner[3];
    
    return chalk.cyan(`${topLine}\n${side}${' '.repeat(width - 2)}${side}\n${bottomLine}`);
  }
  
  /**
   * Generate ASCII progress indicator
   */
  static generateProgressIndicator(current: number, total: number): string {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((current / total) * barLength);
    
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(barLength - filledLength);
    
    return `Progress: [${chalk.green(filled)}${chalk.gray(empty)}] ${percentage}%`;
  }
  
  /**
   * Get available figlet fonts
   */
  static getAvailableFonts(): FigletFont[] {
    return [
      'Big', 'Standard', 'Small', 'Slant', 'Speed', 'Starwars',
      'Cyberlarge', 'Cybermedium', 'Cybersmall', 'Digital',
      'Doh', 'Doom', 'Epic', 'Fuzzy', 'Graffiti', 'Isometric1',
      'Larry3d', 'Nancyj', 'Ogre', 'Rectangles', 'Roman',
      'Rounded', 'Rowancap', 'Shadow', 'Slscript', 'Smslant',
      'Speed', 'Stampatello', 'Stop', 'Straight', 'Tanja',
      'Thick', 'Thin', 'Threepoint', 'Twopoint', 'Weird'
    ];
  }
}

/**
 * ASCII Art themes for different styles
 */
export const ASCIIThemes = {
  matrix: {
    colors: ['#00ff00', '#008000'],
    chars: ['0', '1', '█', '▓', '▒', '░'],
    font: 'Digital' as FigletFont
  },
  retro: {
    colors: ['#ff00ff', '#00ffff', '#ffff00'],
    chars: ['▀', '▄', '█', '▌', '▐', '■'],
    font: 'Starwars' as FigletFont
  },
  minimalist: {
    colors: ['#ffffff', '#cccccc'],
    chars: ['─', '│', '┌', '┐', '└', '┘'],
    font: 'Standard' as FigletFont
  },
  cyberpunk: {
    colors: ['#ff0080', '#0080ff', '#80ff00'],
    chars: ['▲', '▼', '◆', '◇', '●', '○'],
    font: 'Cyberlarge' as FigletFont
  }
};
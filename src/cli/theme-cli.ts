import { Command } from 'commander';
import { ThemeEngine } from '../modules/theming/theme-engine.js';
import { ColorPaletteGenerator } from '../modules/theming/color-generator.js';
import { FontManager } from '../modules/theming/font-manager.js';
import { BrandKitManager } from '../modules/theming/brand-kit.js';
import { ThemeModeManager } from '../modules/theming/theme-mode.js';
import { ResumeTheme, ColorSchemeRequest, BrandKit, Industry } from '../data/theme-types.js';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ThemeCLI {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('theme')
      .description('Theme & Customization Engine for Resume Builder')
      .version('1.0.0');

    // List available themes
    this.program
      .command('list')
      .description('List all available theme templates')
      .action(() => this.listThemes());

    // Create theme from template
    this.program
      .command('create-from-template')
      .description('Create a theme from a predefined template')
      .option('-t, --template <template>', 'Template ID')
      .option('-o, --output <path>', 'Output directory', './themes')
      .action((options) => this.createFromTemplate(options));

    // Create custom theme
    this.program
      .command('create-custom')
      .description('Create a custom theme with AI-generated colors')
      .option('-i, --industry <industry>', 'Industry type')
      .option('-p, --personality <personality>', 'Personality type')
      .option('-c, --color <color>', 'Base color (hex)')
      .option('-f, --font <font>', 'Font pairing name')
      .option('-o, --output <path>', 'Output directory', './themes')
      .action((options) => this.createCustomTheme(options));

    // Create brand theme
    this.program
      .command('create-brand')
      .description('Create a theme from brand kit')
      .option('-l, --logo <path>', 'Logo file path')
      .option('-c, --colors <colors>', 'Brand colors (comma-separated hex values)')
      .option('-p, --personality <personality>', 'Brand personality')
      .option('-o, --output <path>', 'Output directory', './themes')
      .action((options) => this.createBrandTheme(options));

    // Generate color palette
    this.program
      .command('generate-colors')
      .description('Generate AI-suggested color schemes')
      .option('-i, --industry <industry>', 'Industry type')
      .option('-p, --personality <personality>', 'Personality type')
      .option('-c, --color <color>', 'Base color (hex)')
      .option('-n, --count <count>', 'Number of schemes to generate', '3')
      .action((options) => this.generateColors(options));

    // List font pairings
    this.program
      .command('list-fonts')
      .description('List available font pairings')
      .option('-c, --category <category>', 'Filter by category')
      .action((options) => this.listFonts(options));

    // Preview theme
    this.program
      .command('preview')
      .description('Generate theme preview')
      .option('-t, --theme <path>', 'Theme file path')
      .option('-m, --mode <mode>', 'Theme mode (light/dark)', 'light')
      .option('-o, --output <path>', 'Output file path', './preview.html')
      .action((options) => this.previewTheme(options));

    // Validate theme
    this.program
      .command('validate')
      .description('Validate theme configuration')
      .argument('<theme-path>', 'Path to theme file')
      .action((themePath) => this.validateTheme(themePath));

    // Interactive theme builder
    this.program
      .command('interactive')
      .description('Interactive theme builder')
      .action(() => this.interactiveBuilder());
  }

  async listThemes(): Promise<void> {
    console.log(chalk.blue.bold('\n📋 Available Theme Templates\n'));
    
    const themes = ThemeEngine.getAllThemes();
    themes.forEach((theme, index) => {
      console.log(`${chalk.cyan(`${index + 1}.`)} ${chalk.white.bold(theme.name)}`);
      console.log(`   ${chalk.gray('ID:')} ${theme.id}`);
      console.log(`   ${chalk.gray('Industry:')} ${theme.industry}`);
      console.log(`   ${chalk.gray('Description:')} ${theme.description}`);
      console.log(`   ${chalk.gray('Primary Color:')} ${chalk.hex(theme.colors.light.primary)('●')} ${theme.colors.light.primary}`);
      console.log('');
    });
  }

  async createFromTemplate(options: any): Promise<void> {
    try {
      let templateId = options.template;
      
      if (!templateId) {
        const themes = ThemeEngine.getAllThemes();
        const { selectedTemplate } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedTemplate',
            message: 'Select a theme template:',
            choices: themes.map(theme => ({
              name: `${theme.name} - ${theme.description}`,
              value: theme.id
            }))
          }
        ]);
        templateId = selectedTemplate;
      }

      const theme = ThemeEngine.createFromTemplate(templateId);
      await this.saveTheme(theme, options.output);
      
      console.log(chalk.green.bold('✅ Theme created successfully!'));
      console.log(`Theme: ${chalk.cyan(theme.name)}`);
      console.log(`Saved to: ${chalk.gray(path.resolve(options.output, `${theme.id}.json`))}`);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error creating theme:'), error);
    }
  }

  async createCustomTheme(options: any): Promise<void> {
    try {
      let request: ColorSchemeRequest;
      
      if (!options.industry || !options.personality) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'industry',
            message: 'Select industry:',
            choices: ['technology', 'finance', 'healthcare', 'creative', 'consulting', 'education', 'retail', 'manufacturing'],
            when: !options.industry
          },
          {
            type: 'list',
            name: 'personality',
            message: 'Select personality:',
            choices: ['professional', 'creative', 'modern', 'classic', 'bold'],
            when: !options.personality
          },
          {
            type: 'input',
            name: 'baseColor',
            message: 'Enter base color (hex, optional):',
            when: !options.color,
            validate: (input) => {
              if (!input) return true;
              return /^#[0-9A-F]{6}$/i.test(input) || 'Please enter a valid hex color (e.g., #3b82f6)';
            }
          }
        ]);
        
        request = {
          industry: (options.industry || answers.industry) as Industry,
          personality: options.personality || answers.personality,
          preferences: (options.color || answers.baseColor) ? { favoriteColors: [options.color || answers.baseColor] } : undefined
        };
      } else {
        request = {
          industry: options.industry as Industry,
          personality: options.personality,
          preferences: options.color ? { favoriteColors: [options.color] } : undefined
        };
      }

      const theme = ThemeEngine.createCustomTheme(request, options.font);
      await this.saveTheme(theme, options.output);
      
      console.log(chalk.green.bold('✅ Custom theme created successfully!'));
      console.log(`Theme: ${chalk.cyan(theme.name)}`);
      console.log(`Industry: ${chalk.gray(theme.industry)}`);
      console.log(`Primary Color: ${chalk.hex(theme.colors.light.primary)('●')} ${theme.colors.light.primary}`);
      console.log(`Saved to: ${chalk.gray(path.resolve(options.output, `${theme.id}.json`))}`);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error creating custom theme:'), error);
    }
  }

  async createBrandTheme(options: any): Promise<void> {
    try {
      let brandKit: BrandKit;
      let personality: string;
      
      if (!options.colors || !options.personality) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'colors',
            message: 'Enter brand colors (comma-separated hex values):',
            when: !options.colors,
            validate: (input) => {
              const colors = input.split(',').map((c: string) => c.trim());
              return colors.every((c: string) => /^#[0-9A-F]{6}$/i.test(c)) || 'Please enter valid hex colors';
            }
          },
          {
            type: 'list',
            name: 'personality',
            message: 'Select brand personality:',
            choices: ['innovative', 'trustworthy', 'creative', 'professional', 'energetic'],
            when: !options.personality
          }
        ]);
        
        const colors = (options.colors || answers.colors).split(',').map((c: string) => c.trim());
        brandKit = {
          colors: {
            primary: colors[0],
            secondary: colors[1],
            accent: colors[2]
          },
          logo: options.logo ? {
            url: options.logo,
            position: 'top-left' as const
          } : undefined
        };
        personality = options.personality || answers.personality;
      } else {
        const colors = options.colors.split(',').map((c: string) => c.trim());
        brandKit = {
          colors: {
            primary: colors[0],
            secondary: colors[1],
            accent: colors[2]
          },
          logo: options.logo ? {
            url: options.logo,
            position: 'top-left' as const
          } : undefined
        };
        personality = options.personality;
      }

      const theme = ThemeEngine.createFromBrandKit(brandKit, personality as 'creative' | 'innovative' | 'trustworthy' | 'professional' | 'energetic');
      await this.saveTheme(theme, options.output);
      
      console.log(chalk.green.bold('✅ Brand theme created successfully!'));
      console.log(`Theme: ${chalk.cyan(theme.name)}`);
      console.log(`Primary Color: ${chalk.hex(brandKit.colors.primary)('●')} ${brandKit.colors.primary}`);
      console.log(`Saved to: ${chalk.gray(path.resolve(options.output, `${theme.id}.json`))}`);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error creating brand theme:'), error);
    }
  }

  async generateColors(options: any): Promise<void> {
    try {
      let request: ColorSchemeRequest;
      
      if (!options.industry || !options.personality) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'industry',
            message: 'Select industry:',
            choices: ['technology', 'finance', 'healthcare', 'creative', 'consulting', 'education', 'retail', 'manufacturing'],
            when: !options.industry
          },
          {
            type: 'list',
            name: 'personality',
            message: 'Select personality:',
            choices: ['professional', 'creative', 'modern', 'classic', 'bold'],
            when: !options.personality
          }
        ]);
        
        request = {
          industry: (options.industry || answers.industry) as Industry,
          personality: options.personality || answers.personality,
          preferences: options.color ? { favoriteColors: [options.color] } : undefined
        };
      } else {
        request = {
          industry: options.industry as Industry,
          personality: options.personality,
          preferences: options.color ? { favoriteColors: [options.color] } : undefined
        };
      }

      const count = parseInt(options.count) || 3;
      const schemes = ColorPaletteGenerator.generateColorScheme(request);
      
      console.log(chalk.blue.bold(`\n🎨 Generated ${schemes.length} Color Schemes\n`));
      
      schemes.slice(0, count).forEach((scheme, index) => {
        console.log(`${chalk.cyan(`${index + 1}.`)} ${chalk.white.bold(scheme.name)}`);
        console.log(`   ${chalk.gray('Description:')} ${scheme.description}`);
        console.log(`   ${chalk.gray('Primary:')} ${chalk.hex(scheme.palette.primary)('●')} ${scheme.palette.primary}`);
        console.log(`   ${chalk.gray('Secondary:')} ${chalk.hex(scheme.palette.secondary)('●')} ${scheme.palette.secondary}`);
        console.log(`   ${chalk.gray('Accent:')} ${chalk.hex(scheme.palette.accent)('●')} ${scheme.palette.accent}`);
        console.log(`   ${chalk.gray('Background:')} ${chalk.hex(scheme.palette.background)('●')} ${scheme.palette.background}`);
        console.log('');
      });
    } catch (error) {
      console.error(chalk.red.bold('❌ Error generating colors:'), error);
    }
  }

  async listFonts(options: any): Promise<void> {
    console.log(chalk.blue.bold('\n🔤 Available Font Pairings\n'));
    
    const pairings = FontManager.getAllPairings();
    const filtered = options.category 
      ? pairings.filter(p => p.category === options.category)
      : pairings;
    
    filtered.forEach((pairing, index) => {
      console.log(`${chalk.cyan(`${index + 1}.`)} ${chalk.white.bold(pairing.name)}`);
      console.log(`   ${chalk.gray('Category:')} ${pairing.category}`);
      console.log(`   ${chalk.gray('Heading:')} ${pairing.heading}`);
      console.log(`   ${chalk.gray('Body:')} ${pairing.body}`);
      console.log(`   ${chalk.gray('Description:')} ${pairing.description}`);
      console.log('');
    });
  }

  async previewTheme(options: any): Promise<void> {
    try {
      if (!options.theme) {
        console.error(chalk.red.bold('❌ Theme file path is required'));
        return;
      }

      const themeData = JSON.parse(fs.readFileSync(options.theme, 'utf8'));
      const theme: ResumeTheme = themeData;
      
      const sampleHTML = `
        <div class="resume">
          <header>
            <h1>John Doe</h1>
            <p>Senior Software Engineer</p>
          </header>
          <section class="section">
            <h2 class="section-title">Experience</h2>
            <div class="experience-item">
              <h3>Senior Software Engineer</h3>
              <p>Tech Company • 2020-Present</p>
              <p>Led development of scalable web applications using modern technologies.</p>
            </div>
          </section>
          <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills">
              <span class="skill-tag">JavaScript</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">Node.js</span>
              <span class="skill-tag">Python</span>
            </div>
          </section>
        </div>
      `;
      
      const html = ThemeEngine.applyThemeToHTML(sampleHTML, theme, options.mode as 'light' | 'dark');
      fs.writeFileSync(options.output, html);
      
      console.log(chalk.green.bold('✅ Theme preview generated!'));
      console.log(`Preview saved to: ${chalk.gray(path.resolve(options.output))}`);
    } catch (error) {
      console.error(chalk.red.bold('❌ Error generating preview:'), error);
    }
  }

  async validateTheme(themePath: string): Promise<void> {
    try {
      const themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
      const theme: ResumeTheme = themeData;
      
      const validation = ThemeEngine.validateTheme(theme);
      
      console.log(chalk.blue.bold('\n🔍 Theme Validation Results\n'));
      
      if (validation.isValid) {
        console.log(chalk.green.bold('✅ Theme is valid!'));
      } else {
        console.log(chalk.red.bold('❌ Theme has validation errors:'));
        validation.errors.forEach(error => {
          console.log(`   ${chalk.red('•')} ${error}`);
        });
      }
      
      if (validation.warnings.length > 0) {
        console.log(chalk.yellow.bold('\n⚠️  Warnings:'));
        validation.warnings.forEach(warning => {
          console.log(`   ${chalk.yellow('•')} ${warning}`);
        });
      }
      
      if (validation.suggestions.length > 0) {
        console.log(chalk.blue.bold('\n💡 Suggestions:'));
        validation.suggestions.forEach(suggestion => {
          console.log(`   ${chalk.blue('•')} ${suggestion}`);
        });
      }
    } catch (error) {
      console.error(chalk.red.bold('❌ Error validating theme:'), error);
    }
  }

  async interactiveBuilder(): Promise<void> {
    console.log(chalk.blue.bold('\n🎨 Interactive Theme Builder\n'));
    
    const { buildType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'buildType',
        message: 'How would you like to create your theme?',
        choices: [
          { name: 'Start from a template', value: 'template' },
          { name: 'Create custom theme', value: 'custom' },
          { name: 'Use brand colors', value: 'brand' }
        ]
      }
    ]);

    switch (buildType) {
      case 'template':
        await this.createFromTemplate({ output: './themes' });
        break;
      case 'custom':
        await this.createCustomTheme({ output: './themes' });
        break;
      case 'brand':
        await this.createBrandTheme({ output: './themes' });
        break;
    }
  }

  private async saveTheme(theme: ResumeTheme, outputDir: string): Promise<void> {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filePath = path.join(outputDir, `${theme.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(theme, null, 2));
    
    // Also generate CSS file
    const cssPath = path.join(outputDir, `${theme.id}.css`);
    const lightCSS = ThemeEngine.generateCSS(theme, 'light');
    const darkCSS = ThemeEngine.generateCSS(theme, 'dark');
    
    const fullCSS = `/* Light Mode */\n${lightCSS}\n\n/* Dark Mode */\n[data-theme="dark"] {\n${darkCSS.replace(':root', '')}\n}`;
    fs.writeFileSync(cssPath, fullCSS);
  }

  run(args: string[]): void {
    this.program.parse(args);
  }
}

// Export for use in main CLI
export function registerThemeCommands(program: Command): void {
  const themeCLI = new ThemeCLI();
  program.addCommand(themeCLI['program']);
}
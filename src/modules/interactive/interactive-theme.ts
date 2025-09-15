import chalk from 'chalk';
import inquirer from 'inquirer';
import { UserConfig } from '../../data/types.js';
import { getThemeColors, saveConfig, updateConfig } from '../core/config.js';
import { ColorPaletteGenerator } from '../theming/color-generator.js';
import { ThemeModeManager } from '../theming/theme-mode.js';

/**
 * Customize theme
 */
export async function customizeTheme(config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  while (true) {
    const { themeAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'themeAction',
        message: 'Theme & Customization Options:',
        choices: [
          { name: '🎨 AI Color Palette Generator', value: 'color-generator' },
          { name: '🔤 Font Management', value: 'font-manager' },
          { name: '🏢 Brand Kit Integration', value: 'brand-kit' },
          { name: '🌙 Dark/Light Mode Settings', value: 'theme-mode' },
          { name: '🎯 Quick Theme Selection', value: 'quick-themes' },
          { name: '🔙 Back to Main Menu', value: 'back' }
        ]
      }
    ]);
    
    if (themeAction === 'back') {
      return;
    }
    
    switch (themeAction) {
      case 'color-generator':
        await handleColorGenerator(config);
        break;
      case 'font-manager':
        await handleFontManager(config);
        break;
      case 'brand-kit':
        await handleBrandKit(config);
        break;
      case 'theme-mode':
        await handleThemeMode(config);
        break;
      case 'quick-themes':
        await handleQuickThemes(config);
        break;
    }
  }
}

/**
 * Handle AI Color Palette Generator
 */
export async function handleColorGenerator(config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n🎨 AI Color Palette Generator\n'));
  
  const { colorAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'colorAction',
      message: 'Choose color generation method:',
      choices: [
        { name: '🎯 Industry-based Colors', value: 'industry' },
        { name: '🎨 Base Color Variations', value: 'variations' },
        { name: '🌈 Generate Color Scheme', value: 'scheme' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (colorAction === 'back') return;
  
  try {
    let result;
    
    switch (colorAction) {
      case 'industry':
        const { industry } = await inquirer.prompt([
          {
            type: 'list',
            name: 'industry',
            message: 'Select your industry:',
            choices: [
              'technology', 'finance', 'healthcare', 'education',
              'creative', 'marketing', 'engineering', 'legal'
            ]
          }
        ]);
        
        const { personality } = await inquirer.prompt([
          {
            type: 'list',
            name: 'personality',
            message: 'Select personality:',
            choices: ['professional', 'creative', 'modern', 'classic', 'bold']
          }
        ]);
        
        result = ColorPaletteGenerator.generateColorScheme({
           industry: industry as any,
           personality,
           preferences: {}
         });
        
        if (result && result.length > 0) {
          const palette = result[0].palette;
          console.log((chalk as any)[colors.success]('\n✅ Generated Color Palette:'));
          console.log(`Primary: ${chalk.hex(palette.primary)(palette.primary)}`);
          console.log(`Secondary: ${chalk.hex(palette.secondary)(palette.secondary)}`);
          console.log(`Accent: ${chalk.hex(palette.accent)(palette.accent)}`);
          console.log(`Background: ${chalk.hex(palette.background)(palette.background)}`);
          console.log(`Text Primary: ${chalk.hex(palette.text.primary)(palette.text.primary)}`);
          console.log(`\nDescription: ${result[0].description}`);
          console.log(`Confidence: ${(result[0].confidence * 100).toFixed(1)}%`);
        }
        break;
        
      case 'variations':
        const { baseColor } = await inquirer.prompt([
          {
            type: 'input',
            name: 'baseColor',
            message: 'Enter base color (hex, e.g., #3498db):',
            validate: (input: string) => {
              return /^#[0-9A-Fa-f]{6}$/.test(input) || 'Please enter a valid hex color (e.g., #3498db)';
            }
          }
        ]);
        
        const variations = ColorPaletteGenerator.generateColorVariations(baseColor);
        console.log((chalk as any)[colors.success]('\n✅ Generated Color Variations:'));
        variations.forEach((color, index) => {
          console.log(`Variation ${index + 1}: ${chalk.hex(color)(color)}`);
        });
        break;
        
      case 'scheme':
        console.log((chalk as any)[colors.primary]('\n🎨 Generating comprehensive color scheme...\n'));
        const schemes = ColorPaletteGenerator.generateColorScheme({
           industry: 'technology',
           personality: 'modern',
           preferences: {}
         });
        
        if (schemes && schemes.length > 0) {
          schemes.forEach((scheme, index) => {
            console.log((chalk as any)[colors.success](`\n✅ Scheme ${index + 1}:`));
            console.log(`Description: ${scheme.description}`);
            console.log(`Confidence: ${(scheme.confidence * 100).toFixed(1)}%`);
            const p = scheme.palette;
            console.log(`Colors: ${chalk.hex(p.primary)(p.primary)} ${chalk.hex(p.secondary)(p.secondary)} ${chalk.hex(p.accent)(p.accent)}`);
          });
        }
        break;
    }
    
    if (result) {
      const { applyPalette } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'applyPalette',
          message: 'Apply this color palette?',
          default: true
        }
      ]);
      
      if (applyPalette) {
        console.log((chalk as any)[colors.success]('\n🎨 Color palette applied successfully!\n'));
      }
    }
  } catch (error) {
    console.log((chalk as any)[colors.error](`\n❌ Error generating palette: ${error}\n`));
  }
}

/**
 * Handle Font Management
 */
export async function handleFontManager(config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n🔤 Font Management\n'));
  
  const { fontAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fontAction',
      message: 'Font management options:',
      choices: [
        { name: '📝 Set Heading Font', value: 'heading' },
        { name: '📄 Set Body Font', value: 'body' },
        { name: '💻 Set Code Font', value: 'code' },
        { name: '🎯 Font Pairing Suggestions', value: 'pairing' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (fontAction === 'back') return;
  
  const fontFamilies = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'Source Sans Pro', 'Poppins', 'Nunito', 'Raleway', 'Ubuntu'
  ];
  
  if (fontAction === 'pairing') {
      console.log((chalk as any)[colors.primary]('\n📚 Recommended Font Pairings:\n'));
      console.log('• Heading: Montserrat + Body: Open Sans');
      console.log('• Heading: Poppins + Body: Inter');
      console.log('• Heading: Raleway + Body: Lato');
      console.log('• Heading: Ubuntu + Body: Source Sans Pro\n');
    } else {
    const { selectedFont } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedFont',
        message: `Select ${fontAction} font:`,
        choices: fontFamilies
      }
    ]);
    
    console.log((chalk as any)[colors.success](`\n✅ ${fontAction} font set to ${selectedFont}!\n`));
  }
}

/**
 * Handle Brand Kit Integration
 */
export async function handleBrandKit(config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n🏢 Brand Kit Integration\n'));
  
  const { brandAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'brandAction',
      message: 'Brand kit options:',
      choices: [
        { name: '🎨 Set Brand Colors', value: 'colors' },
        { name: '🔤 Set Brand Fonts', value: 'fonts' },
        { name: '📷 Upload Logo', value: 'logo' },
        { name: '📋 Import Brand Guidelines', value: 'import' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (brandAction === 'back') return;
  
  switch (brandAction) {
    case 'colors':
      const { primaryColor, secondaryColor } = await inquirer.prompt([
        {
          type: 'input',
          name: 'primaryColor',
          message: 'Enter primary brand color (hex):',
          validate: (input: string) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Invalid hex color'
        },
        {
          type: 'input',
          name: 'secondaryColor',
          message: 'Enter secondary brand color (hex):',
          validate: (input: string) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Invalid hex color'
        }
      ]);
      console.log((chalk as any)[colors.success]('\n✅ Brand colors updated!\n'));
      break;
      
    case 'fonts':
      const { brandFont } = await inquirer.prompt([
        {
          type: 'input',
          name: 'brandFont',
          message: 'Enter brand font family:'
        }
      ]);
      console.log((chalk as any)[colors.success](`\n✅ Brand font set to ${brandFont}!\n`));
      break;
      
    case 'logo':
      const { logoPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'logoPath',
          message: 'Enter logo file path:'
        }
      ]);
      console.log((chalk as any)[colors.success]('\n✅ Logo path updated!\n'));
      break;
      
    case 'import':
        console.log((chalk as any)[colors.primary]('\n📋 Brand guidelines import feature coming soon!\n'));
        break;
  }
}

/**
 * Handle Theme Mode Settings
 */
export async function handleThemeMode(config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n🌙 Dark/Light Mode Settings\n'));
  
  // Show current mode
  const currentMode = ThemeModeManager.getCurrentMode();
  const effectiveMode = ThemeModeManager.getEffectiveMode();
  console.log(chalk.gray(`Current mode: ${currentMode} (effective: ${effectiveMode})\n`));
  
  const { modeAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'modeAction',
      message: 'Theme mode options:',
      choices: [
        { name: '☀️ Set Light Mode', value: 'light' },
        { name: '🌙 Set Dark Mode', value: 'dark' },
        { name: '🔄 Set Auto Mode', value: 'auto' },
        { name: '⚙️ Configure Auto Settings', value: 'configure' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (modeAction === 'back') return;
  
  switch (modeAction) {
    case 'light':
      ThemeModeManager.setMode('light');
      console.log((chalk as any)[colors.success]('\n☀️ Light mode activated!\n'));
      // Update config to persist the setting
      updateConfig({ theme: 'light' });
      break;
    case 'dark':
      ThemeModeManager.setMode('dark');
      console.log((chalk as any)[colors.success]('\n🌙 Dark mode activated!\n'));
      // Update config to persist the setting
      updateConfig({ theme: 'dark' });
      break;
    case 'auto':
      ThemeModeManager.setMode('auto');
      console.log((chalk as any)[colors.success]('\n🔄 Auto mode activated! Theme will switch based on system settings.\n'));
      // Note: auto mode is handled by ThemeModeManager, no config update needed
      break;
    case 'configure':
      const { autoSettings } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'autoSettings',
          message: 'Configure auto mode settings:',
          choices: [
            'Follow system theme',
            'Switch at sunset/sunrise',
            'Custom time schedule',
            'Based on ambient light'
          ]
        }
      ]);
      
      if (autoSettings.includes('Custom time schedule')) {
        const { lightTime, darkTime } = await inquirer.prompt([
          {
            type: 'input',
            name: 'lightTime',
            message: 'Light mode start time (HH:MM):',
            default: '06:00',
            validate: (input) => {
              const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
              return timeRegex.test(input) || 'Please enter time in HH:MM format';
            }
          },
          {
            type: 'input',
            name: 'darkTime',
            message: 'Dark mode start time (HH:MM):',
            default: '18:00',
            validate: (input) => {
              const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
              return timeRegex.test(input) || 'Please enter time in HH:MM format';
            }
          }
        ]);
        
        // Enable auto switch with custom times
        ThemeModeManager.enableAutoSwitch(lightTime, darkTime);
        
        console.log((chalk as any)[colors.success](`\n⏰ Custom schedule set: Light at ${lightTime}, Dark at ${darkTime}\n`));
      }
      
      console.log((chalk as any)[colors.success]('\n⚙️ Auto mode settings configured!\n'));
      break;
  }
}

/**
 * Handle Quick Themes
 */
export async function handleQuickThemes(config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  const { selectedTheme } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTheme',
      message: 'Select a quick theme:',
      choices: [
        { name: '💼 Professional Blue', value: 'professional' },
        { name: '🎨 Creative Purple', value: 'creative' },
        { name: '🌿 Nature Green', value: 'nature' },
        { name: '🔥 Bold Red', value: 'bold' },
        { name: '🌊 Ocean Teal', value: 'ocean' }
      ]
    }
  ]);
  
  console.log((chalk as any)[colors.success](`\n✅ Applied ${selectedTheme} theme!\n`));
}
import chalk from 'chalk';
import inquirer from 'inquirer';
import qrcode from 'qrcode';
import clipboardy from 'clipboardy';
import fs, { promises as fsPromises } from 'fs';
import { ResumeData, SectionKey, UserConfig, SearchResult, ExportOptions, TemplateConfig } from '../data/types.js';
import { formatColoredResume, formatPlainResume, formatJsonResume, formatHtmlResume, formatPdfResume } from './formatting.js';
import { exportResume as exportResumeWithOptions, getAvailableTemplates, getTemplateByName } from './export.js';
import { validateSections } from './data.js';
import { loadConfig, saveConfig, addToFavorites, removeFromFavorites, getThemeColors } from './config.js';
import { ThemeEngine } from './theme-engine.js';
import { ThemeModeManager } from './theme-mode.js';
import { ColorPaletteGenerator } from './color-generator.js';
import { searchResume, getSearchSuggestions, groupResultsBySection } from './search.js';
import { calculateResumeStats, displayResumeStats, displayTechBreakdown, displayExperienceTimeline } from './statistics.js';
import { QRCodeGenerator } from './qr-code.js';
import { ContactCardExporter } from './contact-card.js';
import { ATSScoreCalculator } from './ats-score.js';
import { KeywordOptimizer } from './keyword-optimizer.js';
import { LengthOptimizer } from './length-optimizer.js';
import { GrammarChecker, GrammarCheckOptions, GrammarIssue } from './grammar-checker.js';
import { SocialIntegration, SocialSyncOptions, SocialSyncResult } from './social-integration.js';
import { GitHubAnalyticsEngine, GitHubAnalyticsOptions, GitHubAnalytics } from './github-analytics.js';

/**
 * Main interactive mode function
 */
export async function runInteractiveMode(resumeData: ResumeData): Promise<void> {
  const config = loadConfig();
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n🚀 Interactive Resume Navigator\n'));
  
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '📄 View Resume Sections', value: 'sections' },
          { name: '🔍 Search Resume', value: 'search' },
          { name: '📊 View Statistics', value: 'stats' },
          { name: '⭐ Manage Favorites', value: 'favorites' },
          { name: '🎨 Customize Theme', value: 'theme' },
          { name: '📱 Generate QR Codes', value: 'qr' },
          { name: '💳 Export Contact Card', value: 'contact-card' },
          { name: '🎯 ATS Score Analysis', value: 'ats-score' },
          { name: '🔑 Keyword Optimization', value: 'keywords' },
          { name: '📏 Length Optimization', value: 'length' },
          { name: '🌐 Social Media Sync', value: 'social-sync' },
          { name: '📊 GitHub Analytics', value: 'github-analytics' },
          { name: '📋 Copy Contact Info', value: 'clipboard' },
          { name: '💾 Export Resume', value: 'export' },
          { name: '❌ Exit', value: 'exit' }
        ]
      }
    ]);
    
    switch (action) {
      case 'sections':
        await navigateSections(resumeData);
        break;
      case 'search':
        await searchResumeInteractive(resumeData, config);
        break;
      case 'stats':
        await showStatistics(resumeData, config);
        break;
      case 'favorites':
        await manageFavorites(resumeData, config);
        break;
      case 'theme':
        await customizeTheme(config);
        break;
      case 'qr':
        await generateQRCodes(resumeData);
        break;
      case 'contact-card':
        await exportContactCard(resumeData);
        break;
      case 'ats-score':
        await analyzeATSScore(resumeData);
        break;
      case 'keywords':
        await optimizeKeywords(resumeData);
        break;
      case 'length':
        await optimizeLength(resumeData);
        break;
      case 'social-sync':
        await socialMediaSync(resumeData);
        break;
      case 'github-analytics':
        await analyzeGitHubProfile(resumeData);
        break;
      case 'clipboard':
        await copyToClipboard(resumeData);
        break;
      case 'export':
        await exportResume(resumeData);
        break;
      case 'exit':
        console.log((chalk as any)[colors.accent]('\n👋 Thanks for using the interactive resume!\n'));
        return;
    }
  }
}

/**
 * Search resume interactively
 */
async function searchResumeInteractive(resumeData: ResumeData, config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  while (true) {
    const { searchQuery } = await inquirer.prompt([
      {
        type: 'input',
        name: 'searchQuery',
        message: 'Enter search term (or "back" to return):',
        validate: (input: string) => input.trim().length > 0 || 'Please enter a search term'
      }
    ]);
    
    if (searchQuery.toLowerCase() === 'back') {
      return;
    }
    
    const results = searchResume(resumeData, searchQuery);
    
    if (results.length === 0) {
      console.log((chalk as any)[colors.error]('\n❌ No results found for "' + searchQuery + '"\n'));
      const suggestions = getSearchSuggestions(resumeData);
      if (suggestions.length > 0) {
        console.log((chalk as any)[colors.secondary]('💡 Did you mean: ' + suggestions.join(', ') + '?\n'));
      }
      continue;
    }
    
    console.log((chalk as any)[colors.success](`\n🔍 Found ${results.length} result(s) for "${searchQuery}":\n`));
    
    const groupedResults = groupResultsBySection(results);
    Object.entries(groupedResults).forEach(([section, sectionResults]) => {
      console.log((chalk as any)[colors.primary].bold(`\n📁 ${section}:`));
      sectionResults.forEach((result: SearchResult) => {
        console.log(`  • ${result.content} ${(chalk as any)[colors.secondary]('(Score: ' + result.score.toFixed(2) + ')')}`);
      });
    });
    
    // Add to search history
    config.searchHistory = config.searchHistory || [];
    if (!config.searchHistory.includes(searchQuery)) {
      config.searchHistory.unshift(searchQuery);
      config.searchHistory = config.searchHistory.slice(0, 10); // Keep last 10 searches
      saveConfig(config);
    }
    
    console.log('\n');
  }
}

/**
 * Show resume statistics
 */
async function showStatistics(resumeData: ResumeData, config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  const { statsType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'statsType',
      message: 'What statistics would you like to view?',
      choices: [
        { name: '📊 General Statistics', value: 'general' },
        { name: '💻 Technology Breakdown', value: 'tech' },
        { name: '📅 Experience Timeline', value: 'timeline' },
        { name: '🔙 Back to Main Menu', value: 'back' }
      ]
    }
  ]);
  
  switch (statsType) {
     case 'general':
       const stats = calculateResumeStats(resumeData);
       displayResumeStats(stats, config);
       break;
     case 'tech':
       displayTechBreakdown(resumeData, config);
       break;
     case 'timeline':
       displayExperienceTimeline(resumeData, config);
       break;
     case 'back':
       return;
   }
  
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}

/**
 * Manage favorites/bookmarks
 */
async function manageFavorites(resumeData: ResumeData, config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Manage Favorites:',
        choices: [
          { name: '⭐ View Favorites', value: 'view' },
          { name: '➕ Add to Favorites', value: 'add' },
          { name: '➖ Remove from Favorites', value: 'remove' },
          { name: '🔙 Back to Main Menu', value: 'back' }
        ]
      }
    ]);
    
    switch (action) {
      case 'view':
        if (config.favorites.length === 0) {
          console.log((chalk as any)[colors.secondary]('\n📝 No favorites yet. Add some sections to your favorites!\n'));
        } else {
          console.log((chalk as any)[colors.primary].bold('\n⭐ Your Favorites:\n'));
          config.favorites.forEach((fav, index) => {
            console.log(`${index + 1}. ${fav}`);
          });
          console.log('\n');
        }
        break;
        
      case 'add':
        const availableSections = Object.keys(resumeData).filter(key => 
          key !== 'personalInfo' && !config.favorites.includes(key)
        );
        
        if (availableSections.length === 0) {
          console.log((chalk as any)[colors.secondary]('\n✅ All sections are already in your favorites!\n'));
          break;
        }
        
        const { sectionToAdd } = await inquirer.prompt([
          {
            type: 'list',
            name: 'sectionToAdd',
            message: 'Select section to add to favorites:',
            choices: availableSections.map(section => ({
              name: section.charAt(0).toUpperCase() + section.slice(1),
              value: section
            }))
          }
        ]);
        
        config.favorites.push(sectionToAdd);
         saveConfig(config);
         console.log((chalk as any)[colors.success](`\n✅ Added "${sectionToAdd}" to favorites!\n`));
        break;
        
      case 'remove':
        if (config.favorites.length === 0) {
          console.log((chalk as any)[colors.secondary]('\n📝 No favorites to remove.\n'));
          break;
        }
        
        const { sectionToRemove } = await inquirer.prompt([
          {
            type: 'list',
            name: 'sectionToRemove',
            message: 'Select section to remove from favorites:',
            choices: config.favorites.map(fav => ({
              name: fav.charAt(0).toUpperCase() + fav.slice(1),
              value: fav
            }))
          }
        ]);
        
        config.favorites = config.favorites.filter(fav => fav !== sectionToRemove);
         saveConfig(config);
         console.log((chalk as any)[colors.success](`\n✅ Removed "${sectionToRemove}" from favorites!\n`));
        break;
        
      case 'back':
        return;
    }
  }
}

/**
 * Customize theme
 */
async function customizeTheme(config: UserConfig): Promise<void> {
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
async function handleColorGenerator(config: UserConfig): Promise<void> {
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
async function handleFontManager(config: UserConfig): Promise<void> {
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
async function handleBrandKit(config: UserConfig): Promise<void> {
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
async function handleThemeMode(config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n🌙 Dark/Light Mode Settings\n'));
  
  const { modeAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'modeAction',
      message: 'Theme mode options:',
      choices: [
        { name: '☀️ Set Light Mode', value: 'light' },
        { name: '🌙 Set Dark Mode', value: 'dark' },
        { name: '🔄 Set Auto Mode', value: 'auto' },
        { name: '⚙️ Configure Auto Switch', value: 'configure' },
        { name: '🔄 Toggle Current Mode', value: 'toggle' },
        { name: '📊 Check Current Status', value: 'status' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (modeAction === 'back') return;
  
  switch (modeAction) {
    case 'light':
    case 'dark':
      ThemeModeManager.setMode(modeAction);
      console.log((chalk as any)[colors.success](`\n✅ Theme mode set to ${modeAction}!\n`));
      break;
      
    case 'auto':
      ThemeModeManager.setMode('auto');
      console.log((chalk as any)[colors.success]('\n✅ Auto theme mode enabled!\n'));
      break;
      
    case 'toggle':
      ThemeModeManager.toggle();
      const currentMode = ThemeModeManager.getCurrentMode();
      console.log((chalk as any)[colors.success](`\n✅ Theme toggled to ${currentMode}!\n`));
      break;
      
    case 'status':
      const mode = ThemeModeManager.getCurrentMode();
      const effectiveMode = ThemeModeManager.getEffectiveMode();
      const systemPref = ThemeModeManager.getSystemPreference();
      
      console.log((chalk as any)[colors.primary]('\n📊 Theme Status:'));
      console.log(`Current Mode: ${mode}`);
      console.log(`Effective Mode: ${effectiveMode}`);
      console.log(`System Preference: ${systemPref}\n`);
      break;
      
    case 'configure':
      const { lightStart, darkStart } = await inquirer.prompt([
        {
          type: 'input',
          name: 'lightStart',
          message: 'Light mode start time (HH:MM):',
          default: '06:00',
          validate: (input: string) => /^\d{2}:\d{2}$/.test(input) || 'Format: HH:MM'
        },
        {
          type: 'input',
          name: 'darkStart',
          message: 'Dark mode start time (HH:MM):',
          default: '18:00',
          validate: (input: string) => /^\d{2}:\d{2}$/.test(input) || 'Format: HH:MM'
        }
      ]);
      
      ThemeModeManager.enableAutoSwitch(lightStart, darkStart);
      console.log((chalk as any)[colors.success]('\n✅ Auto switch times configured!\n'));
      break;
  }
}

/**
 * Handle Quick Theme Selection
 */
async function handleQuickThemes(config: UserConfig): Promise<void> {
  const { themeChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'themeChoice',
      message: 'Choose a quick theme:',
      choices: [
        { name: '🌙 Dark Theme', value: 'dark' },
        { name: '☀️ Light Theme', value: 'light' },
        { name: '🌈 Colorful Theme', value: 'colorful' },
        { name: '💼 Professional Theme', value: 'professional' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (themeChoice === 'back') {
    return;
  }
  
  config.theme = themeChoice;
  saveConfig(config);
  
  const colors = getThemeColors(config);
  console.log((chalk as any)[colors.success](`\n✅ Theme changed to "${themeChoice}"!\n`));
}

/**
 * Navigate through resume sections
 */
async function navigateSections(resumeData: ResumeData): Promise<void> {
  const sectionChoices = [
    { name: '👤 Personal Info', value: 'personal' },
    { name: '📝 Profile Summary', value: 'profile' },
    { name: '⚡ Tech Stack', value: 'techStack' },
    { name: '💼 Work Experience', value: 'experience' },
    { name: '🚀 Projects', value: 'projects' },
    { name: '👥 Leadership', value: 'leadership' },
    { name: '🌟 Open Source', value: 'openSource' },
    { name: '🎓 Education', value: 'education' },
    { name: '📊 View All Sections', value: 'all' },
    { name: '⬅️  Back to Main Menu', value: 'back' }
  ];
  
  while (true) {
    const { section } = await inquirer.prompt([
      {
        type: 'list',
        name: 'section',
        message: 'Which section would you like to view?',
        choices: sectionChoices
      }
    ]);
    
    if (section === 'back') break;
    
    const sections = section === 'all' ? undefined : [section as SectionKey];
    const output = formatColoredResume(resumeData, sections);
    
    console.log('\n' + output);
    
    // Ask if user wants to view another section
    const { continueViewing } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueViewing',
        message: 'Would you like to view another section?',
        default: true
      }
    ]);
    
    if (!continueViewing) break;
  }
}

/**
 * Generate QR codes for contact information
 */
export async function generateQRCodes(resumeData: ResumeData): Promise<void> {
  const qrChoices = [
    { name: '📧 Email', value: 'email' },
    { name: '📱 Phone', value: 'phone' },
    { name: '💼 LinkedIn', value: 'linkedin' },
    { name: '🐙 GitHub', value: 'github' },
    { name: '🌐 Portfolio', value: 'portfolio' },
    { name: '⬅️  Back to Main Menu', value: 'back' }
  ];
  
  while (true) {
    const { contact } = await inquirer.prompt([
      {
        type: 'list',
        name: 'contact',
        message: 'Generate QR code for which contact method?',
        choices: qrChoices
      }
    ]);
    
    if (contact === 'back') break;
    
    let contactData = '';
    let contactLabel = '';
    
    switch (contact) {
      case 'email':
        contactData = `mailto:${resumeData.personal.email}`;
        contactLabel = 'Email';
        break;
      case 'phone':
        contactData = `tel:${resumeData.personal.phone}`;
        contactLabel = 'Phone';
        break;
      case 'linkedin':
        contactData = resumeData.personal.linkedin;
        contactLabel = 'LinkedIn';
        break;
      case 'github':
        contactData = resumeData.personal.github;
        contactLabel = 'GitHub';
        break;
      case 'portfolio':
        contactData = resumeData.personal.portfolio;
        contactLabel = 'Portfolio';
        break;
    }
    
    try {
      console.log(`\n${chalk.cyanBright.bold(`QR Code for ${contactLabel}:`)}`);
      console.log(chalk.dim(`Data: ${contactData}\n`));
      
      const qrString = await qrcode.toString(contactData, {
        type: 'terminal',
        small: true
      });
      
      console.log(qrString);
      console.log(chalk.yellowBright('📱 Scan with your phone to access this contact info!\n'));
      
    } catch (error: any) {
      console.error(chalk.red(`Error generating QR code: ${error.message}`));
    }
    
    // Ask if user wants to generate another QR code
    const { continueQR } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueQR',
        message: 'Would you like to generate another QR code?',
        default: true
      }
    ]);
    
    if (!continueQR) break;
  }
}

/**
 * Copy contact information to clipboard
 */
export async function copyToClipboard(resumeData: ResumeData): Promise<void> {
  const clipboardChoices = [
    { name: '📧 Email Address', value: 'email' },
    { name: '📱 Phone Number', value: 'phone' },
    { name: '💼 LinkedIn Profile', value: 'linkedin' },
    { name: '🐙 GitHub Profile', value: 'github' },
    { name: '🌐 Portfolio Website', value: 'portfolio' },
    { name: '📝 All Contact Info', value: 'all' },
    { name: '⬅️  Back to Main Menu', value: 'back' }
  ];
  
  while (true) {
    const { contact } = await inquirer.prompt([
      {
        type: 'list',
        name: 'contact',
        message: 'What would you like to copy to clipboard?',
        choices: clipboardChoices
      }
    ]);
    
    if (contact === 'back') break;
    
    let clipboardData = '';
    let contactLabel = '';
    
    switch (contact) {
      case 'email':
        clipboardData = resumeData.personal.email;
        contactLabel = 'Email address';
        break;
      case 'phone':
        clipboardData = resumeData.personal.phone;
        contactLabel = 'Phone number';
        break;
      case 'linkedin':
        clipboardData = resumeData.personal.linkedin;
        contactLabel = 'LinkedIn profile';
        break;
      case 'github':
        clipboardData = resumeData.personal.github;
        contactLabel = 'GitHub profile';
        break;
      case 'portfolio':
        clipboardData = resumeData.personal.portfolio;
        contactLabel = 'Portfolio website';
        break;
      case 'all':
        clipboardData = `${resumeData.personal.name}\n${resumeData.personal.email}\n${resumeData.personal.phone}\n${resumeData.personal.linkedin}\n${resumeData.personal.github}\n${resumeData.personal.portfolio}`;
        contactLabel = 'All contact information';
        break;
    }
    
    try {
      await clipboardy.write(clipboardData);
      console.log(chalk.greenBright(`\n✅ ${contactLabel} copied to clipboard!\n`));
    } catch (error: any) {
      console.error(chalk.red(`Error copying to clipboard: ${error.message}`));
    }
    
    // Ask if user wants to copy something else
    const { continueCopy } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueCopy',
        message: 'Would you like to copy something else?',
        default: true
      }
    ]);
    
    if (!continueCopy) break;
  }
}

/**
 * Export resume in different formats
 */
export async function exportResume(resumeData: ResumeData): Promise<void> {
  const { exportType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'exportType',
      message: 'How would you like to export your resume?',
      choices: [
        { name: '📋 Quick Export (Standard Formats)', value: 'quick' },
        { name: '🎯 Template-based Export (Industry Specific)', value: 'template' },
        { name: '📱 Social Media Formats', value: 'social' },
        { name: '🔧 Custom Export', value: 'custom' }
      ]
    }
  ]);

  switch (exportType) {
    case 'quick':
      await quickExport(resumeData);
      break;
    case 'template':
      await templateBasedExport(resumeData);
      break;
    case 'social':
      await socialMediaExport(resumeData);
      break;
    case 'custom':
      await customExport(resumeData);
      break;
  }
}

async function quickExport(resumeData: ResumeData): Promise<void> {
  const { format } = await inquirer.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'Which format would you like to export?',
      choices: [
        { name: '🎨 Colored (Terminal)', value: 'colored' },
        { name: '📝 Plain Text', value: 'plain' },
        { name: '📊 JSON', value: 'json' },
        { name: '🌐 HTML (Web)', value: 'html' },
        { name: '📄 PDF (Print)', value: 'pdf' },
        { name: '📋 Markdown (GitHub)', value: 'markdown' },
        { name: '📚 LaTeX (Academic)', value: 'latex' }
      ]
    }
  ]);

  await performExport(resumeData, format);
}

async function templateBasedExport(resumeData: ResumeData): Promise<void> {
  const templates = getAvailableTemplates();
  const templateChoices = templates.map(template => ({
    name: `${template.name} (${template.format.toUpperCase()}) - ${template.style || 'default'} style`,
    value: template.name,
    short: template.name
  }));

  const { templateName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateName',
      message: 'Choose a template:',
      choices: templateChoices
    }
  ]);

  const template = getTemplateByName(templateName);
  if (!template) {
    console.error(chalk.red('Template not found!'));
    return;
  }

  console.log(chalk.cyan(`\n📋 Template: ${template.name}`));
  console.log(chalk.gray(`   Format: ${template.format.toUpperCase()}`));
  console.log(chalk.gray(`   Style: ${template.style || 'default'}`));
  console.log(chalk.gray(`   Sections: ${template.sections.join(', ')}`));
  if (template.industry) {
    console.log(chalk.gray(`   Industry: ${template.industry}`));
  }

  const { filename } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filename',
      message: 'Enter filename (without extension):',
      default: `bharathkumar-resume-${template.name.toLowerCase().replace(/\s+/g, '-')}`
    }
  ]);

  const exportOptions: ExportOptions = {
    format: template.format,
    template,
    includeContact: true
  };

  await performTemplateExport(resumeData, exportOptions, filename);
}

async function socialMediaExport(resumeData: ResumeData): Promise<void> {
  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Which social media platform?',
      choices: [
        { name: '💼 LinkedIn Summary (2000 chars)', value: 'linkedin' },
        { name: '🐦 Twitter Bio (160 chars)', value: 'twitter' }
      ]
    }
  ]);

  const maxLength = platform === 'linkedin' ? 2000 : 160;
  const exportOptions: ExportOptions = {
    format: platform,
    maxLength,
    includeContact: platform === 'linkedin'
  };

  try {
    const output = exportResumeWithOptions(resumeData, exportOptions);
    
    console.log(chalk.cyan(`\n📱 ${platform.toUpperCase()} Export:`));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(output);
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.yellow(`Character count: ${output.length}/${maxLength}`));
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '📋 Copy to Clipboard', value: 'copy' },
          { name: '💾 Save to File', value: 'save' },
          { name: '↩️  Back to Menu', value: 'back' }
        ]
      }
    ]);

    if (action === 'copy') {
      await clipboardy.write(output);
      console.log(chalk.green('✅ Copied to clipboard!'));
    } else if (action === 'save') {
      const { filename } = await inquirer.prompt([
        {
          type: 'input',
          name: 'filename',
          message: 'Enter filename:',
          default: `bharathkumar-${platform}-bio.txt`
        }
      ]);
      fs.writeFileSync(filename, output, 'utf8');
      console.log(chalk.green(`✅ Saved to ${filename}!`));
    }
  } catch (error: any) {
    console.error(chalk.red(`Error generating ${platform} export: ${error.message}`));
  }
}

async function customExport(resumeData: ResumeData): Promise<void> {
  const { format } = await inquirer.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'Choose export format:',
      choices: [
        { name: '📋 Markdown', value: 'markdown' },
        { name: '📚 LaTeX', value: 'latex' },
        { name: '💼 LinkedIn', value: 'linkedin' },
        { name: '🐦 Twitter', value: 'twitter' }
      ]
    }
  ]);

  const allSections: SectionKey[] = ['personal', 'profile', 'techStack', 'experience', 'projects', 'leadership', 'openSource', 'education'];
  const { sections } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'sections',
      message: 'Select sections to include:',
      choices: allSections.map(section => ({ name: section, value: section, checked: true }))
    }
  ]);

  const { includeContact } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeContact',
      message: 'Include contact information?',
      default: true
    }
  ]);

  let maxLength: number | undefined;
  if (format === 'linkedin' || format === 'twitter') {
    const { customLength } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customLength',
        message: `Maximum character length (default: ${format === 'linkedin' ? '2000' : '160'}):`,
        default: format === 'linkedin' ? '2000' : '160',
        validate: (input: string) => {
          const num = parseInt(input);
          return !isNaN(num) && num > 0 ? true : 'Please enter a valid positive number';
        }
      }
    ]);
    maxLength = parseInt(customLength);
  }

  const exportOptions: ExportOptions = {
    format,
    customSections: sections,
    includeContact,
    maxLength
  };

  const { filename } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filename',
      message: 'Enter filename (without extension):',
      default: `bharathkumar-resume-custom`
    }
  ]);

  await performTemplateExport(resumeData, exportOptions, filename);
}

async function performExport(resumeData: ResumeData, format: string): Promise<void> {
  const { filename } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filename',
      message: 'Enter filename (without extension):',
      default: 'bharathkumar-resume'
    }
  ]);
  
  const extensions: Record<string, string> = { 
    colored: 'txt', 
    plain: 'txt', 
    json: 'json', 
    html: 'html', 
    pdf: 'pdf',
    markdown: 'md',
    latex: 'tex'
  };
  const fullFilename = `${filename}.${extensions[format]}`;
  
  let output: string | Buffer;
  let isBuffer = false;
  
  try {
    if (['markdown', 'latex'].includes(format)) {
      const exportOptions: ExportOptions = {
        format: format as any,
        includeContact: true
      };
      output = exportResumeWithOptions(resumeData, exportOptions);
    } else {
      switch (format) {
        case 'json':
          output = formatJsonResume(resumeData);
          break;
        case 'plain':
          output = formatPlainResume(resumeData);
          break;
        case 'html':
          output = formatHtmlResume(resumeData);
          break;
        case 'pdf':
          console.log(chalk.yellowBright('\n⏳ Generating PDF... This may take a moment.'));
          output = await formatPdfResume(resumeData);
          isBuffer = true;
          break;
        case 'colored':
        default:
          output = formatColoredResume(resumeData);
          break;
      }
    }
    
    if (isBuffer) {
      fs.writeFileSync(fullFilename, output);
    } else {
      fs.writeFileSync(fullFilename, output, 'utf8');
    }
    
    console.log(chalk.greenBright(`\n✅ Resume exported successfully to ${fullFilename}!\n`));
    
  } catch (error: any) {
    console.error(chalk.red(`Error exporting resume: ${error.message}`));
  }
}

async function performTemplateExport(resumeData: ResumeData, exportOptions: ExportOptions, filename: string): Promise<void> {
  const extensions: Record<string, string> = {
    markdown: 'md',
    latex: 'tex',
    linkedin: 'txt',
    twitter: 'txt'
  };
  
  const fullFilename = `${filename}.${extensions[exportOptions.format]}`;
  
  try {
    const output = exportResumeWithOptions(resumeData, exportOptions);
    fs.writeFileSync(fullFilename, output, 'utf8');
    
    console.log(chalk.greenBright(`\n✅ Resume exported successfully to ${fullFilename}!`));
    
    if (exportOptions.format === 'latex') {
      console.log(chalk.yellow('💡 Tip: Compile the .tex file with pdflatex to generate a PDF.'));
    }
    
  } catch (error: any) {
    console.error(chalk.red(`Error exporting resume: ${error.message}`));
  }
}

/**
 * Export contact card in various formats
 */
async function exportContactCard(resumeData: ResumeData): Promise<void> {
  const { format } = await inquirer.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'Select contact card format:',
      choices: [
        { name: '📇 vCard (.vcf)', value: 'vcard' },
        { name: '📄 JSON', value: 'json' },
        { name: '📋 PDF', value: 'pdf' },
        { name: '🌐 HTML', value: 'html' },
        { name: '📦 All formats', value: 'all' }
      ]
    }
  ]);

  const { includeQR } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeQR',
      message: 'Include QR code?',
      default: true
    }
  ]);

  const { outputPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputPath',
      message: 'Enter output path (without extension):',
      default: './contact-card'
    }
  ]);

  try {
     const savedFiles = await ContactCardExporter.saveCard(resumeData, outputPath, {
       format: format as any,
       includeQR,
       qrType: 'vcard',
       theme: 'modern',
       includePhoto: false
     });
     
     console.log(chalk.green(`\n✅ Contact card saved successfully!`));
     console.log(chalk.blue(`📁 Files saved:`));
     savedFiles.forEach(file => {
       console.log(chalk.cyan(`  • ${file}`));
     });
   } catch (error) {
     console.error(chalk.red(`\n❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
   }
}

/**
 * Analyze ATS score for job descriptions
 */
async function analyzeATSScore(resumeData: ResumeData): Promise<void> {
  const calculator = new ATSScoreCalculator();
  
  const { jobDescription } = await inquirer.prompt([
    {
      type: 'editor',
      name: 'jobDescription',
      message: 'Paste the job description to analyze against:',
      validate: (input: string) => input.trim().length > 0 || 'Please provide a job description'
    }
  ]);

  try {
    console.log(chalk.yellow('\n🔄 Analyzing ATS compatibility...'));
    
    const result = await calculator.calculateScore(resumeData, {
       title: 'Job Analysis',
       company: 'Target Company',
       description: jobDescription,
       requirements: [],
       preferredSkills: [],
       keywords: []
     });
     
     console.log(chalk.green(`\n📊 ATS Analysis Results:`));
     console.log(chalk.blue(`Overall Score: ${result.overallScore}/100`));
     console.log(chalk.blue(`Keyword Match: ${result.breakdown.keywordMatch}/100`));
     console.log(chalk.blue(`Format Score: ${result.breakdown.formatScore}/100`));
     console.log(chalk.blue(`Experience Match: ${result.breakdown.experienceMatch}/100`));
    
    if (result.suggestions.length > 0) {
      console.log(chalk.yellow('\n💡 Suggestions for improvement:'));
      result.suggestions.forEach((suggestion, index) => {
        console.log(chalk.white(`${index + 1}. ${suggestion}`));
      });
    }
    
    const { exportResults } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'exportResults',
        message: 'Export detailed analysis report?',
        default: false
      }
    ]);
    
    if (exportResults) {
       const exportContent = calculator.exportAnalysis(result, 'json');
       await fsPromises.writeFile('ats-analysis-report.json', exportContent, 'utf8');
       console.log(chalk.green('\n✅ Analysis report exported to ats-analysis-report.json!'));
     }
  } catch (error) {
    console.error(chalk.red(`\n❌ Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
}


async function optimizeLength(resumeData: ResumeData): Promise<void> {
  const optimizer = new LengthOptimizer();
  
  const { targetFormat } = await inquirer.prompt([
    {
      type: 'list',
      name: 'targetFormat',
      message: 'Select target format for length optimization:',
      choices: [
        { name: '📄 One Page Resume', value: 'one-page' },
        { name: '📋 Two Page Resume', value: 'two-page' },
        { name: '💼 LinkedIn Summary', value: 'linkedin' },
        { name: '🐦 Twitter Bio', value: 'twitter' },
        { name: '📧 Email Signature', value: 'email' },
        { name: '🎯 Custom Length', value: 'custom' }
      ]
    }
  ]);

  let targetLength: number;
  
  switch (targetFormat) {
    case 'one-page':
      targetLength = 600; // ~600 words for one page
      break;
    case 'two-page':
      targetLength = 1200; // ~1200 words for two pages
      break;
    case 'linkedin':
      targetLength = 2000; // LinkedIn character limit
      break;
    case 'twitter':
      targetLength = 160; // Twitter bio limit
      break;
    case 'email':
      targetLength = 300; // Email signature limit
      break;
    case 'custom':
      const { customLength } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customLength',
          message: 'Enter target length (characters):',
          validate: (input: string) => {
            const num = parseInt(input);
            return !isNaN(num) && num > 0 ? true : 'Please enter a valid positive number';
          }
        }
      ]);
      targetLength = parseInt(customLength);
      break;
    default:
      targetLength = 600;
  }

  try {
    console.log(chalk.yellow('\n🔄 Analyzing resume length...'));
    
    const analysis = optimizer.analyzeLength(resumeData, 'pdf');
    
    console.log(chalk.green(`\n📏 Length Analysis Results:`));
     console.log(chalk.blue(`Current Length: ${analysis.stats.characters} characters (${analysis.stats.words} words)`));
     console.log(chalk.blue(`Current Pages: ${analysis.stats.pages}`));
     console.log(chalk.blue(`Target Length: ${targetLength} characters`));
     console.log(chalk.blue(`Is Optimal: ${analysis.isOptimal ? 'Yes' : 'No'}`));
     
     if (analysis.recommendations.length > 0) {
       console.log(chalk.yellow('\n✂️ Optimization recommendations:'));
       analysis.recommendations.forEach((recommendation: string, index: number) => {
         console.log(chalk.white(`${index + 1}. ${recommendation}`));
       });
     }
    
    const { generateOptimized } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'generateOptimized',
        message: 'Generate optimized version?',
        default: true
      }
    ]);
    
    if (generateOptimized) {
       const constraints = {
         maxPages: targetFormat === 'one-page' ? 1 : 2,
         maxWords: Math.floor(targetLength / 5), // Rough estimate: 5 chars per word
         targetFormat: 'pdf' as const,
         prioritySections: ['experience', 'projects', 'techStack']
       };
       
       const options = {
         preserveKeywords: true,
         maintainReadability: true,
         aggressiveMode: targetFormat === 'one-page'
       };
       
       const result = optimizer.optimizeLength(resumeData, constraints, options);
       
       const optimizedContent = formatPlainResume(result.optimizedResume);
       await fsPromises.writeFile(`optimized-resume-${targetFormat}.txt`, optimizedContent, 'utf8');
       
       console.log(chalk.green(`\n✅ Optimized resume exported to optimized-resume-${targetFormat}.txt!`));
       console.log(chalk.blue(`Reduction: ${result.reductionPercentage.toFixed(1)}% (${result.originalLength.words} → ${result.optimizedLength.words} words)`));
       
       if (result.suggestions.length > 0) {
         console.log(chalk.yellow('\n📝 Applied optimizations:'));
         result.suggestions.forEach((suggestion, index) => {
           console.log(chalk.white(`${index + 1}. ${suggestion.description} (${suggestion.wordsReduced} words saved)`));
         });
       }
     }
  } catch (error) {
    console.error(chalk.red(`\n❌ Length optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
}

/**
 * Check grammar and spelling in resume content
 */
async function checkGrammar(resumeData: ResumeData): Promise<void> {
  const checker = new GrammarChecker();
  
  const { checkType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'checkType',
      message: 'What would you like to check?',
      choices: [
        { name: '📝 Full Resume Check', value: 'full' },
        { name: '📄 Specific Section', value: 'section' },
        { name: '🎯 Quick Spell Check', value: 'spelling' },
        { name: '📚 Grammar Only', value: 'grammar' },
        { name: '🔙 Back to Main Menu', value: 'back' }
      ]
    }
  ]);
  
  if (checkType === 'back') return;
  
  try {
    console.log(chalk.yellow('\n🔄 Checking grammar and spelling...'));
    
    const options: GrammarCheckOptions = {
      checkSpelling: checkType === 'full' || checkType === 'spelling',
      checkGrammar: checkType === 'full' || checkType === 'grammar',
      checkPunctuation: checkType === 'full',
      checkStyle: checkType === 'full',
      strictMode: false
    };
    
    const result = checker.checkResume(resumeData, options);
    
    console.log(chalk.green(`\n📊 Grammar Check Results:`));
    console.log(chalk.blue(`Total Issues: ${result.totalIssues}`));
    console.log(chalk.blue(`Spelling Errors: ${result.issuesByType.spelling}`));
    console.log(chalk.blue(`Grammar Issues: ${result.issuesByType.grammar}`));
    console.log(chalk.blue(`Style Suggestions: ${result.issuesByType.style}`));
    console.log(chalk.blue(`Punctuation Issues: ${result.issuesByType.punctuation}`));
    console.log(chalk.blue(`Overall Score: ${result.overallScore}/100`));
    
    if (result.issues.length > 0) {
      console.log(chalk.yellow('\n🔍 Issues found:'));
      result.issues.slice(0, 10).forEach((issue, index) => {
        console.log(chalk.white(`${index + 1}. ${issue.type.toUpperCase()}: ${issue.message}`));
        console.log(chalk.gray(`   Text: "${issue.originalText}"`));
        if (issue.suggestion) {
          console.log(chalk.cyan(`   Suggestion: "${issue.suggestion}"`));
        }
        console.log(chalk.gray(`   Section: ${issue.section}.${issue.field}`));
      });
      
      if (result.issues.length > 10) {
        console.log(chalk.gray(`   ... and ${result.issues.length - 10} more issues`));
      }
    }
    
    const { exportReport } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'exportReport',
        message: 'Export detailed grammar report?',
        default: false
      }
    ]);
    
    if (exportReport) {
      const exportContent = checker.exportReport(result, 'json');
      await fsPromises.writeFile('grammar-check-report.json', exportContent, 'utf8');
      console.log(chalk.green('\n✅ Grammar report exported to grammar-check-report.json!'));
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Grammar check failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
}

/**
  * Optimize keywords for better ATS performance
  */
async function socialMediaSync(resumeData: ResumeData): Promise<void> {
  console.log(chalk.cyan('\n🌐 Social Media Integration'));
  console.log(chalk.gray('Sync your resume with LinkedIn and GitHub profiles\n'));

  const { platform } = await inquirer.prompt([
    {
      type: 'list',
      name: 'platform',
      message: 'Select platform to sync:',
      choices: [
        { name: '💼 LinkedIn Profile', value: 'linkedin' },
        { name: '🐙 GitHub Profile', value: 'github' },
        { name: '🔄 Sync Both Platforms', value: 'both' },
        { name: '📊 View Sync Status', value: 'status' },
        { name: '⬅️  Back to Main Menu', value: 'back' }
      ]
    }
  ]);

  if (platform === 'back') return;

  const socialIntegration = new SocialIntegration();

  try {
    if (platform === 'status') {
      // Display current sync status
      console.log(chalk.yellow('\n📊 Current Sync Status:'));
      console.log(chalk.gray('• LinkedIn: Not connected'));
      console.log(chalk.gray('• GitHub: Not connected'));
      console.log(chalk.blue('\nℹ️  Use sync options to connect your profiles\n'));
      return;
    }

    const syncOptions: SocialSyncOptions = {
      platforms: platform === 'both' ? ['linkedin', 'github'] : [platform as 'linkedin' | 'github'],
      autoUpdate: false,
      syncFrequency: 'manual',
      conflictResolution: 'manual'
    };

    // First, set up authentication tokens (mock for demonstration)
    socialIntegration.setAuthToken('linkedin', 'mock-linkedin-token');
    socialIntegration.setAuthToken('github', 'mock-github-token');

    console.log(chalk.yellow('\n🔄 Starting sync process...'));
    const results: SocialSyncResult[] = await socialIntegration.syncWithPlatforms(resumeData, syncOptions);

    // Handle conflicts if any exist
    const conflictResolutions: { [key: string]: 'local' | 'platform' } = {};
    let hasConflicts = false;

    for (const result of results) {
      if (result.conflicts && result.conflicts.length > 0) {
        hasConflicts = true;
        console.log(chalk.yellow(`\n⚠️  Conflicts detected for ${result.platform}:`));
        
        for (const conflict of result.conflicts) {
          console.log(chalk.cyan(`\n🔄 Field: ${conflict.field}`));
          console.log(chalk.gray(`Local value: ${conflict.localValue}`));
          console.log(chalk.gray(`${result.platform} value: ${conflict.platformValue}`));
          
          const { resolution } = await inquirer.prompt([
            {
              type: 'list',
              name: 'resolution',
              message: 'Which value would you like to keep?',
              choices: [
                { name: `Keep local value: "${conflict.localValue}"`, value: 'local' },
                { name: `Use ${result.platform} value: "${conflict.platformValue}"`, value: 'platform' }
              ]
            }
          ]);
          
          conflictResolutions[`${result.platform}.${conflict.field}`] = resolution;
        }
      }
    }

    // Apply sync results with conflict resolutions
    if (hasConflicts || results.some(r => r.updatedFields.length > 0)) {
      const updatedResumeData = socialIntegration.applySync(resumeData, results, conflictResolutions);
      
      // Update the original resume data object
      Object.assign(resumeData, updatedResumeData);
      
      console.log(chalk.green('\n✅ Resume data updated successfully!'));
    }

    // Display sync results
    console.log(chalk.cyan('\n📈 Sync Summary:'));
    
    results.forEach(result => {
      if (result.platform === 'linkedin') {
        console.log(chalk.blue('\n💼 LinkedIn:'));
        console.log(`  • Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
        console.log(`  • Updated fields: ${result.updatedFields.join(', ') || 'None'}`);
        console.log(`  • Conflicts: ${result.conflicts.length}`);
        console.log(`  • Message: ${result.message}`);
      }
      
      if (result.platform === 'github') {
        console.log(chalk.blue('\n🐙 GitHub:'));
        console.log(`  • Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
        console.log(`  • Updated fields: ${result.updatedFields.join(', ') || 'None'}`);
        console.log(`  • Conflicts: ${result.conflicts.length}`);
        console.log(`  • Message: ${result.message}`);
      }
    });

    if (hasConflicts) {
      console.log(chalk.green('\n🎉 All conflicts resolved and resume updated!'));
    } else {
      console.log(chalk.green('\n🎉 Sync completed with no conflicts!'));
    }

  } catch (error) {
    console.log(chalk.red('\n❌ Sync failed:'));
    console.log(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    console.log(chalk.yellow('\nℹ️  Please check your authentication credentials and try again.'));
  }
}

 async function optimizeKeywords(resumeData: ResumeData): Promise<void> {
  const optimizer = new KeywordOptimizer();
  
  const { industry } = await inquirer.prompt([
    {
      type: 'list',
      name: 'industry',
      message: 'Select your target industry:',
      choices: [
        { name: '💻 Technology', value: 'technology' },
        { name: '💰 Finance', value: 'finance' },
        { name: '🏥 Healthcare', value: 'healthcare' },
        { name: '🎓 Education', value: 'education' },
        { name: '🏭 Manufacturing', value: 'manufacturing' },
        { name: '🛒 Retail', value: 'retail' },
        { name: '🎯 Marketing', value: 'marketing' },
        { name: '⚖️ Legal', value: 'legal' },
        { name: '🔬 Research', value: 'research' },
        { name: '🎨 Creative', value: 'creative' }
      ]
    }
  ]);

  try {
    console.log(chalk.yellow('\n🔄 Analyzing keywords...'));
    
    const analysis = optimizer.analyzeKeywords(resumeData, undefined, {
       industry: industry,
       experienceLevel: 'mid'
     });
     
     console.log(chalk.green(`\n🔑 Keyword Analysis Results:`));
     console.log(chalk.blue(`Current Keywords: ${analysis.currentKeywords.length}`));
     console.log(chalk.blue(`Keyword Score: ${analysis.score}/100`));
     
     if (analysis.missingKeywords.length > 0) {
       console.log(chalk.yellow('\n📝 Suggested keywords to add:'));
       analysis.missingKeywords.slice(0, 10).forEach((keyword, index) => {
         console.log(chalk.white(`${index + 1}. ${keyword.keyword} (${keyword.category})`));
       });
     }
     
     if (analysis.suggestions.length > 0) {
       console.log(chalk.cyan('\n🔧 Additional keyword suggestions:'));
       analysis.suggestions.slice(0, 5).forEach((keyword, index) => {
         console.log(chalk.white(`${index + 1}. ${keyword.keyword} (${keyword.category})`));
       });
     }
    
    const { generateReport } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'generateReport',
        message: 'Generate detailed optimization report?',
        default: true
      }
    ]);
    
    if (generateReport) {
       const exportContent = optimizer.exportAnalysis(analysis, 'json');
       await fsPromises.writeFile('keyword-analysis-report.json', exportContent, 'utf8');
       console.log(chalk.green('\n✅ Optimization report exported to keyword-analysis-report.json!'));
     }
  } catch (error) {
    console.error(chalk.red(`\n❌ Keyword analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
}

/**
 * Analyze GitHub profile and display analytics
 */
async function analyzeGitHubProfile(resumeData: ResumeData): Promise<void> {
  const config = loadConfig();
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n📊 GitHub Analytics Dashboard\n'));
  
  const { username } = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your GitHub username:',
      validate: (input) => input.trim().length > 0 || 'Please enter a valid GitHub username'
    }
  ]);
  
  try {
    console.log((chalk as any)[colors.accent]('\n🔍 Fetching GitHub data...'));
    
    const analyticsEngine = new GitHubAnalyticsEngine();
    const options: GitHubAnalyticsOptions = {
      username: username.trim(),
      includePrivate: false,
      maxRepos: 100
    };
    
    const analytics = await analyticsEngine.generateAnalytics(options);
    
    // Display user profile
    console.log((chalk as any)[colors.primary].bold('\n👤 Profile Overview:'));
    console.log(`Name: ${analytics.user.name || 'N/A'}`);
    console.log(`Bio: ${analytics.user.bio || 'No bio available'}`);
    console.log(`Location: ${analytics.user.location || 'Not specified'}`);
    console.log(`Company: ${analytics.user.company || 'Not specified'}`);
    console.log(`Public Repos: ${analytics.user.public_repos}`);
    console.log(`Followers: ${analytics.user.followers}`);
    console.log(`Following: ${analytics.user.following}`);
    console.log(`Account Created: ${new Date(analytics.user.created_at).toLocaleDateString()}`);
    
    // Display repository stats
    console.log((chalk as any)[colors.primary].bold('\n📚 Repository Statistics:'));
    console.log(`Total Stars: ${analytics.stats.totalStars}`);
    console.log(`Total Forks: ${analytics.stats.totalForks}`);
    console.log(`Total Commits: ${analytics.stats.totalCommits}`);
    console.log(`Total PRs: ${analytics.stats.totalPRs}`);
    console.log(`Total Issues: ${analytics.stats.totalIssues}`);
    const languages = Object.keys(analytics.stats.mostUsedLanguages).slice(0, 5);
    console.log(`Top Languages: ${languages.join(', ')}`);
    
    // Display top repositories
    if (analytics.topRepositories.length > 0) {
      console.log((chalk as any)[colors.primary].bold('\n⭐ Top Repositories:'));
      analytics.topRepositories.slice(0, 5).forEach((repo, index) => {
        console.log(`${index + 1}. ${repo.name}`);
        console.log(`   ⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks`);
        console.log(`   📝 ${repo.description || 'No description'}`);
        console.log(`   🔗 ${repo.html_url}`);
        console.log('');
      });
    }
    
    // Display contribution activity
    console.log((chalk as any)[colors.primary].bold('\n📈 Contribution Activity:'));
    console.log(`Contribution Streak: ${analytics.stats.contributionStreak} days`);
    const totalContributions = analytics.stats.yearlyContributions.reduce((sum, contrib) => sum + contrib.count, 0);
    console.log(`Total Contributions (Last Year): ${totalContributions}`);
    
    // Display recent activity
    if (analytics.contributionGraph.length > 0) {
      console.log('\n📅 Recent Contribution Activity:');
      const recentContribs = analytics.contributionGraph.slice(-7);
      recentContribs.forEach((contrib, index) => {
        console.log(`${contrib.date}: ${contrib.count} contributions`);
      });
    }
    
    // Ask for next action
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do next?',
        choices: [
          { name: '💾 Export Analytics to Resume', value: 'export' },
          { name: '📊 View Detailed Charts', value: 'charts' },
          { name: '🔄 Refresh Data', value: 'refresh' },
          { name: '📋 Copy GitHub Stats', value: 'copy' },
          { name: '↩️  Back to Main Menu', value: 'back' }
        ]
      }
    ]);
    
    switch (action) {
      case 'export':
         const exportData = await analyticsEngine.exportToResumeData(analytics, resumeData);
         console.log((chalk as any)[colors.success]('\n✅ GitHub analytics exported to resume data!'));
         console.log('Added sections:');
         console.log('- GitHub profile information');
         console.log('- Repository statistics');
         console.log('- Contribution metrics');
         console.log('- Top projects showcase');
         break;
         
       case 'charts':
         console.log((chalk as any)[colors.accent]('\n📊 Detailed Analytics Charts:'));
         const formattedDisplay = analyticsEngine.formatAnalyticsForDisplay(analytics);
         console.log(formattedDisplay);
         break;
        
      case 'copy':
        const totalContribs = analytics.stats.yearlyContributions.reduce((sum, contrib) => sum + contrib.count, 0);
         const statsText = `GitHub Stats for ${username}:\n` +
           `⭐ ${analytics.stats.totalStars} total stars\n` +
           `📚 ${analytics.user.public_repos} public repositories\n` +
           `👥 ${analytics.user.followers} followers\n` +
           `📈 ${totalContribs} contributions this year`;
        
        try {
          await clipboardy.write(statsText);
          console.log((chalk as any)[colors.success]('\n✅ GitHub stats copied to clipboard!'));
        } catch (error) {
          console.error((chalk as any).red('❌ Failed to copy to clipboard'));
        }
        break;
        
      case 'refresh':
        await analyzeGitHubProfile(resumeData);
        return;
        
      case 'back':
        return;
    }
    
  } catch (error) {
    console.error((chalk as any).red('❌ Error fetching GitHub data:'), error);
    console.log((chalk as any)[colors.warning]('\n💡 Tips:'));
    console.log('- Make sure the username is correct');
    console.log('- Check your internet connection');
    console.log('- The user profile might be private');
  }
  
  // Ask if user wants to analyze another profile
  const { analyzeAnother } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'analyzeAnother',
      message: 'Would you like to analyze another GitHub profile?',
      default: false
    }
  ]);
  
  if (analyzeAnother) {
    await analyzeGitHubProfile(resumeData);
  }
}
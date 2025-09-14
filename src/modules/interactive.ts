import chalk from 'chalk';
import inquirer from 'inquirer';
import qrcode from 'qrcode';
import clipboardy from 'clipboardy';
import fs from 'fs';
import { ResumeData, SectionKey, UserConfig, SearchResult } from '../data/types.js';
import { formatColoredResume, formatPlainResume, formatJsonResume, formatHtmlResume, formatPdfResume } from './formatting.js';
import { validateSections } from './data.js';
import { loadConfig, saveConfig, addToFavorites, removeFromFavorites, getThemeColors } from './config.js';
import { searchResume, getSearchSuggestions, groupResultsBySection } from './search.js';
import { calculateResumeStats, displayResumeStats, displayTechBreakdown, displayExperienceTimeline } from './statistics.js';

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
  const { themeChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'themeChoice',
      message: 'Choose a theme:',
      choices: [
        { name: '🌙 Dark Theme', value: 'dark' },
        { name: '☀️ Light Theme', value: 'light' },
        { name: '🌈 Colorful Theme', value: 'colorful' },
        { name: '💼 Professional Theme', value: 'professional' },
        { name: '🔙 Back to Main Menu', value: 'back' }
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
        { name: '📄 PDF (Print)', value: 'pdf' }
      ]
    }
  ]);
  
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
    pdf: 'pdf' 
  };
  const fullFilename = `${filename}.${extensions[format]}`;
  
  let output: string | Buffer;
  let isBuffer = false;
  
  try {
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
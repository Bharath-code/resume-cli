import chalk from 'chalk';
import inquirer from 'inquirer';
import qrcode from 'qrcode';
import clipboardy from 'clipboardy';
import fs, { promises as fsPromises } from 'fs';
import { ResumeData, SectionKey, UserConfig, SearchResult, ExportOptions, TemplateConfig } from '../../data/types.js';
import { formatColoredResume, formatPlainResume, formatJsonResume, formatHtmlResume, formatPdfResume } from '../export/formatting.js';
import { exportResume as exportResumeWithOptions, getAvailableTemplates, getTemplateByName } from '../export/export.js';
import { validateSections } from '../core/data.js';
import { loadConfig, saveConfig, addToFavorites, removeFromFavorites, getThemeColors } from '../core/config.js';
import { ThemeEngine } from '../theming/theme-engine.js';
import { ThemeModeManager } from '../theming/theme-mode.js';
import { ColorPaletteGenerator } from '../theming/color-generator.js';
import { searchResume, getSearchSuggestions, groupResultsBySection } from '../utilities/search.js';
import { calculateResumeStats, displayResumeStats, displayTechBreakdown, displayExperienceTimeline } from '../export/statistics.js';
import { QRCodeGenerator } from '../utilities/qr-code.js';
import { ContactCardExporter } from '../utilities/contact-card.js';
import { ATSScoreCalculator } from '../analysis/ats-score.js';
import { KeywordOptimizer } from '../analysis/keyword-optimizer.js';
import { LengthOptimizer } from '../analysis/length-optimizer.js';
import { GrammarChecker, GrammarCheckOptions, GrammarIssue } from '../analysis/grammar-checker.js';
import { SocialIntegration, SocialSyncOptions, SocialSyncResult } from '../utilities/social-integration.js';
import { GitHubAnalyticsEngine, GitHubAnalyticsOptions, GitHubAnalytics } from '../analysis/github-analytics.js';
// Import modular functions
import { customizeTheme } from './interactive-theme.js';
import { showStatistics, showAnalyticsDashboard, showATSScore, analyzeGitHubProfile } from './interactive-statistics.js';
import { optimizeKeywords, analyzeJobDescription, analyzeLengthOptimization } from './interactive-analysis.js';
import { manageFavorites } from './interactive-favorites.js';
import { generateQRCode, exportContactCard } from './interactive-utilities.js';
import { ASCIIArtGenerator } from '../utilities/ascii-art.js';
import { ProgressBarManager } from '../utilities/progress-bars.js';
import { AnimatedLoadingManager, createLoadingSpinner, createAnalyzingSpinner, createGeneratingSpinner, createExportingSpinner, createSearchingSpinner, createOptimizingSpinner } from '../utilities/animated-loading.js';
import { InteractiveChartsManager } from '../utilities/interactive-charts.js';
import { ThemeCustomizationInterface } from '../theming/theme-customization.js';

/**
 * Main interactive mode function
 */
export async function runInteractiveMode(resumeData: ResumeData): Promise<void> {
  const config = loadConfig();
  const colors = getThemeColors(config);
  
  // Display ASCII name banner
  try {
    const nameBanner = await ASCIIArtGenerator.generateNameBanner(
      resumeData.personal.name,
      'Big',
      colors
    );
    console.log('\n' + nameBanner);
  } catch (error) {
    console.log((chalk as any)[colors.primary].bold(`\n🚀 ${resumeData.personal.name}'s Resume\n`));
  }
  
  console.log((chalk as any)[colors.secondary]('Interactive Resume Navigator\n'));
  
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
          { name: '📈 Interactive Charts', value: 'charts' },
          { name: '🎨 Theme Customization', value: 'customize' },
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
        await showStatistics(resumeData);
        break;
      case 'favorites':
        await manageFavorites(resumeData);
        break;
      case 'theme':
        await customizeTheme(config);
        break;
      case 'qr':
        await generateQRCode(resumeData);
        break;
      case 'contact-card':
        await exportContactCard(resumeData);
        break;
      case 'ats-score':
        await showATSScore(resumeData);
        break;
      case 'keywords':
        await optimizeKeywords(resumeData);
        break;
      case 'length':
        await analyzeLengthOptimization(resumeData);
        break;
      case 'social-sync':
        await socialMediaSync(resumeData);
        break;
      case 'github-analytics':
        await analyzeGitHubProfile(resumeData);
        break;
      case 'charts':
        await showInteractiveCharts(resumeData);
        break;
      case 'customize':
        await showThemeCustomization(resumeData);
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
    
    // Create and start search spinner
    const searchSpinner = createSearchingSpinner(`Searching for "${searchQuery}"...`);
    
    // Simulate search processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = searchResume(resumeData, searchQuery);
    
    if (results.length === 0) {
      AnimatedLoadingManager.failSpinner(searchSpinner, `No results found for "${searchQuery}"`);
      
      // Show suggestions with spinner
      const suggestionSpinner = createAnalyzingSpinner('Generating suggestions...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const suggestions = getSearchSuggestions(resumeData);
      if (suggestions.length > 0) {
        AnimatedLoadingManager.succeedSpinner(suggestionSpinner, 'Found some suggestions!');
        console.log((chalk as any)[colors.secondary]('💡 Did you mean: ' + suggestions.join(', ') + '?\n'));
      } else {
        AnimatedLoadingManager.infoSpinner(suggestionSpinner, 'No suggestions available');
      }
      continue;
    }
    
    AnimatedLoadingManager.succeedSpinner(searchSpinner, `Found ${results.length} result(s) for "${searchQuery}"`);
    
    // Group results by section with spinner
    const groupingSpinner = createAnalyzingSpinner('Organizing results...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const groupedResults = groupResultsBySection(results);
    AnimatedLoadingManager.succeedSpinner(groupingSpinner, 'Results organized by section');
    
    console.log();
    Object.entries(groupedResults).forEach(([section, sectionResults]) => {
      console.log((chalk as any)[colors.primary].bold(`📁 ${section}:`));
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

// Statistics and favorites functions moved to their respective modules

// customizeTheme function moved to interactive-theme.js

// Theme-related functions moved to interactive-theme.js

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

// QR code generation functions moved to interactive-utilities.js

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

/**
 * Show Interactive Charts Menu
 */
async function showInteractiveCharts(resumeData: ResumeData): Promise<void> {
  const config = loadConfig();
  const colors = getThemeColors(config);
  
  while (true) {
    const { chartType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'chartType',
        message: 'Choose a chart to display:',
        choices: [
          { name: '📊 Complete Analytics Dashboard', value: 'dashboard' },
          { name: '🕒 Experience Timeline', value: 'timeline' },
          { name: '🎯 Skill Level Bars', value: 'skills' },
          { name: '📈 Skill Category Radar', value: 'radar' },
          { name: '⬅️  Back to Main Menu', value: 'back' }
        ]
      }
    ]);
    
    if (chartType === 'back') break;
    
    const chartSpinner = createGeneratingSpinner('Generating chart visualization...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      let chartOutput = '';
      
      switch (chartType) {
        case 'dashboard':
          chartOutput = InteractiveChartsManager.generateDashboard(resumeData);
          AnimatedLoadingManager.succeedSpinner(chartSpinner, 'Analytics dashboard generated');
          break;
        case 'timeline':
          chartOutput = InteractiveChartsManager.generateExperienceTimeline(resumeData.experience);
          AnimatedLoadingManager.succeedSpinner(chartSpinner, 'Experience timeline generated');
          break;
        case 'skills':
          chartOutput = InteractiveChartsManager.generateSkillBars(resumeData.techStack);
          AnimatedLoadingManager.succeedSpinner(chartSpinner, 'Skill level chart generated');
          break;
        case 'radar':
          chartOutput = InteractiveChartsManager.generateSkillRadar(resumeData.techStack);
          AnimatedLoadingManager.succeedSpinner(chartSpinner, 'Skill radar chart generated');
          break;
      }
      
      console.log(chartOutput);
      
      // Ask if user wants to view another chart
      const { continueViewing } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueViewing',
          message: 'Would you like to view another chart?',
          default: true
        }
      ]);
      
      if (!continueViewing) break;
      
    } catch (error: any) {
      AnimatedLoadingManager.failSpinner(chartSpinner, `Chart generation failed: ${error.message}`);
      console.error((chalk as any)[colors.error](`\n❌ Error generating chart: ${error.message}`));
    }
  }
}

/**
 * Show Theme Customization Interface
 */
async function showThemeCustomization(resumeData: ResumeData): Promise<void> {
  const config = loadConfig();
  const colors = getThemeColors(config);
  
  while (true) {
    const { customizationType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'customizationType',
        message: 'Choose customization option:',
        choices: [
          { name: '🎨 Advanced Theme Editor', value: 'advanced' },
          { name: '🌈 Color Palette Generator', value: 'palette' },
          { name: '🎭 Theme Mode Manager', value: 'mode' },
          { name: '💾 Save Custom Theme', value: 'save' },
          { name: '📂 Load Theme Preset', value: 'load' },
          { name: '🔄 Reset to Default', value: 'reset' },
          { name: '⬅️  Back to Main Menu', value: 'back' }
        ]
      }
    ]);
    
    if (customizationType === 'back') break;
    
    const customizationSpinner = createGeneratingSpinner('Loading theme customization...');
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      switch (customizationType) {
        case 'advanced':
          AnimatedLoadingManager.succeedSpinner(customizationSpinner, 'Advanced theme editor loaded');
          await ThemeCustomizationInterface.startCustomization(config);
          break;
        case 'palette':
          AnimatedLoadingManager.succeedSpinner(customizationSpinner, 'Quick customization loaded');
          await ThemeCustomizationInterface.quickCustomization();
          break;
        case 'mode':
        case 'save':
        case 'load':
        case 'reset':
          AnimatedLoadingManager.succeedSpinner(customizationSpinner, 'Feature coming soon');
          console.log(chalk.yellow('This feature is coming soon!'));
          break;
      }
      
      // Ask if user wants to continue customizing
      const { continueCustomizing } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueCustomizing',
          message: 'Would you like to continue customizing?',
          default: true
        }
      ]);
      
      if (!continueCustomizing) break;
      
    } catch (error: any) {
      AnimatedLoadingManager.failSpinner(customizationSpinner, `Theme customization failed: ${error.message}`);
      console.error((chalk as any)[colors.error](`\n❌ Error in theme customization: ${error.message}`));
    }
  }
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
  
  // Initialize animated loading
  const mainSpinner = createExportingSpinner(`Preparing ${format} export...`);
  
  let output: string | Buffer;
  let isBuffer = false;
  
  try {
    // Simulate preparation time
    await new Promise(resolve => setTimeout(resolve, 500));
    AnimatedLoadingManager.updateSpinner(mainSpinner, `Generating ${format} content...`);
    
    if (['markdown', 'latex'].includes(format)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const exportOptions: ExportOptions = {
        format: format as any,
        includeContact: true
      };
      output = exportResumeWithOptions(resumeData, exportOptions);
    } else {
      await new Promise(resolve => setTimeout(resolve, 200));
      switch (format) {
        case 'json':
          AnimatedLoadingManager.updateSpinner(mainSpinner, 'Formatting JSON structure...');
          await new Promise(resolve => setTimeout(resolve, 300));
          output = formatJsonResume(resumeData);
          break;
        case 'plain':
          AnimatedLoadingManager.updateSpinner(mainSpinner, 'Formatting plain text...');
          await new Promise(resolve => setTimeout(resolve, 400));
          output = formatPlainResume(resumeData);
          break;
        case 'html':
          AnimatedLoadingManager.updateSpinner(mainSpinner, 'Generating HTML markup...');
          await new Promise(resolve => setTimeout(resolve, 600));
          output = formatHtmlResume(resumeData);
          break;
        case 'pdf':
          AnimatedLoadingManager.updateSpinner(mainSpinner, 'Generating PDF... This may take a moment.');
          await new Promise(resolve => setTimeout(resolve, 1200));
          output = await formatPdfResume(resumeData);
          isBuffer = true;
          break;
        case 'colored':
        default:
          AnimatedLoadingManager.updateSpinner(mainSpinner, 'Applying colors and formatting...');
          await new Promise(resolve => setTimeout(resolve, 500));
          output = formatColoredResume(resumeData);
          break;
      }
    }
    
    AnimatedLoadingManager.updateSpinner(mainSpinner, 'Writing file to disk...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (isBuffer) {
      fs.writeFileSync(fullFilename, output);
    } else {
      fs.writeFileSync(fullFilename, output, 'utf8');
    }
    
    AnimatedLoadingManager.succeedSpinner(mainSpinner, `Resume exported successfully to ${fullFilename}!`);
    
    // Show additional success information
    console.log(chalk.green(`\n✨ Export completed successfully!`));
    console.log(chalk.cyan(`📁 File: ${fullFilename}`));
    console.log(chalk.gray(`📊 Size: ${isBuffer ? (output as Buffer).length : (output as string).length} ${isBuffer ? 'bytes' : 'characters'}`));
    
  } catch (error: any) {
    AnimatedLoadingManager.failSpinner(mainSpinner, `Export failed: ${error.message}`);
    console.error(chalk.red(`\n❌ Error exporting resume: ${error.message}`));
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
    // Create analysis spinner sequence
    const initSpinner = createAnalyzingSpinner('Initializing grammar checker...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const options: GrammarCheckOptions = {
      checkSpelling: checkType === 'full' || checkType === 'spelling',
      checkGrammar: checkType === 'full' || checkType === 'grammar',
      checkPunctuation: checkType === 'full',
      checkStyle: checkType === 'full',
      strictMode: false
    };
    
    AnimatedLoadingManager.succeedSpinner(initSpinner, 'Grammar checker initialized');
    
    const analysisSpinner = createAnalyzingSpinner('Analyzing resume content...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = checker.checkResume(resumeData, options);
    
    if (result.totalIssues === 0) {
      AnimatedLoadingManager.succeedSpinner(analysisSpinner, 'Analysis complete - No issues found!');
      console.log(chalk.green('\n✅ No grammar or style issues found! Your resume looks great.'));
      return;
    }
    
    AnimatedLoadingManager.warnSpinner(analysisSpinner, `Found ${result.totalIssues} potential issue(s)`);
    
    // Process results with spinner
    const processingSpinner = createAnalyzingSpinner('Organizing findings...');
    await new Promise(resolve => setTimeout(resolve, 400));
    
    AnimatedLoadingManager.succeedSpinner(processingSpinner, 'Results organized by category');
    
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
      const exportSpinner = createGeneratingSpinner('Generating detailed report...');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const exportContent = checker.exportReport(result, 'json');
      await fsPromises.writeFile('grammar-check-report.json', exportContent, 'utf8');
      
      AnimatedLoadingManager.succeedSpinner(exportSpinner, 'Grammar report exported successfully!');
      console.log(chalk.green('\n✅ Grammar report exported to grammar-check-report.json!'));
    }
  } catch (error) {
    const errorSpinner = createAnalyzingSpinner('Processing error...');
    AnimatedLoadingManager.failSpinner(errorSpinner, `Grammar check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
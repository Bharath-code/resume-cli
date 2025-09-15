import chalk from 'chalk';
import inquirer from 'inquirer';
import { UserConfig, ResumeData, SectionKey } from '../../data/types.js';
import { getThemeColors, saveConfig, loadConfig, addToFavorites as addSectionToFavorites, removeFromFavorites as removeSectionFromFavorites } from '../core/config.js';
import { formatColoredResume } from '../export/formatting.js';

/**
 * Manage favorite resume sections
 */
export async function manageFavorites(resumeData: ResumeData): Promise<void> {
  const config = loadConfig();
  const colors = getThemeColors(config);
  
  while (true) {
    const { favoritesAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'favoritesAction',
        message: 'Favorite Resume Sections:',
        choices: [
          { name: '⭐ View Favorite Sections', value: 'view' },
          { name: '➕ Add Section to Favorites', value: 'add' },
          { name: '🗑️ Remove from Favorites', value: 'remove' },
          { name: '🔙 Back to Main Menu', value: 'back' }
        ]
      }
    ]);
    
    if (favoritesAction === 'back') {
      return;
    }
    
    switch (favoritesAction) {
      case 'view':
        await viewFavorites(resumeData, config);
        break;
      case 'add':
        await addToFavorites(resumeData, config);
        break;
      case 'remove':
        await removeFromFavorites(resumeData, config);
        break;
    }
  }
}

/**
 * View favorite sections
 */
export async function viewFavorites(resumeData: ResumeData, config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n⭐ Your Favorite Sections\n'));
  
  if (config.favorites.length === 0) {
    console.log((chalk as any)[colors.secondary]('No favorite sections yet. Use "Add Section to Favorites" to start.\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }
  
  // Display each favorite section
  for (const sectionKey of config.favorites) {
    const sectionName = getSectionDisplayName(sectionKey);
    console.log((chalk as any)[colors.primary](`\n📋 ${sectionName}:`));
    
    const output = formatColoredResume(resumeData, [sectionKey as SectionKey]);
    console.log(output);
    console.log('\n' + '-'.repeat(50));
  }
  
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}

/**
 * Add section to favorites
 */
export async function addToFavorites(resumeData: ResumeData, config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n➕ Add Section to Favorites\n'));
  
  // Get available sections that aren't already favorited
  const availableSections = Object.keys(resumeData).filter(key => 
    !config.favorites.includes(key)
  );
  
  if (availableSections.length === 0) {
    console.log((chalk as any)[colors.secondary]('All sections are already in your favorites!\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }
  
  const sectionChoices = availableSections.map(key => ({
    name: getSectionDisplayName(key),
    value: key
  }));
  
  sectionChoices.push({ name: '🔙 Back', value: 'back' });
  
  const { selectedSection } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedSection',
      message: 'Which section would you like to add to favorites?',
      choices: sectionChoices
    }
  ]);
  
  if (selectedSection === 'back') return;
  
  try {
    addSectionToFavorites(selectedSection as SectionKey);
    console.log((chalk as any)[colors.success](`\n✅ Added "${getSectionDisplayName(selectedSection)}" to favorites!\n`));
  } catch (error) {
    console.log((chalk as any)[colors.error](`\n❌ Error adding to favorites: ${error}\n`));
  }
  
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}

/**
 * Remove section from favorites
 */
export async function removeFromFavorites(resumeData: ResumeData, config: UserConfig): Promise<void> {
  const colors = getThemeColors(config);
  
  console.log((chalk as any)[colors.primary].bold('\n🗑️ Remove from Favorites\n'));
  
  if (config.favorites.length === 0) {
    console.log((chalk as any)[colors.secondary]('No favorites to remove.\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }
  
  const favoriteChoices = config.favorites.map(key => ({
    name: getSectionDisplayName(key),
    value: key
  }));
  
  favoriteChoices.push({ name: '🔙 Back', value: 'back' });
  
  const { selectedSection } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedSection',
      message: 'Which section would you like to remove from favorites?',
      choices: favoriteChoices
    }
  ]);
  
  if (selectedSection === 'back') return;
  
  try {
    removeSectionFromFavorites(selectedSection as SectionKey);
    console.log((chalk as any)[colors.success](`\n✅ Removed "${getSectionDisplayName(selectedSection)}" from favorites!\n`));
  } catch (error) {
    console.log((chalk as any)[colors.error](`\n❌ Error removing from favorites: ${error}\n`));
  }
  
  await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}

/**
 * Get display name for a section key
 */
function getSectionDisplayName(sectionKey: string): string {
  const displayNames: Record<string, string> = {
    personal: '👤 Personal Info',
    profile: '📝 Profile Summary',
    techStack: '⚡ Tech Stack',
    experience: '💼 Work Experience',
    projects: '🚀 Projects',
    leadership: '👥 Leadership',
    openSource: '🌟 Open Source',
    education: '🎓 Education'
  };
  
  return displayNames[sectionKey] || `📋 ${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}`;
}
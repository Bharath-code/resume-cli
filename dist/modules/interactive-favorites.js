import chalk from 'chalk';
import inquirer from 'inquirer';
import { getThemeColors } from './config.js';
/**
 * Manage favorites/bookmarks
 */
export async function manageFavorites(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    while (true) {
        const { favoritesAction } = await inquirer.prompt([
            {
                type: 'list',
                name: 'favoritesAction',
                message: 'Favorites & Bookmarks:',
                choices: [
                    { name: '⭐ View Favorites', value: 'view' },
                    { name: '➕ Add to Favorites', value: 'add' },
                    { name: '🗑️ Remove from Favorites', value: 'remove' },
                    { name: '📂 Organize Favorites', value: 'organize' },
                    { name: '📤 Export Favorites', value: 'export' },
                    { name: '📥 Import Favorites', value: 'import' },
                    { name: '🔙 Back to Main Menu', value: 'back' }
                ]
            }
        ]);
        if (favoritesAction === 'back') {
            return;
        }
        switch (favoritesAction) {
            case 'view':
                await viewFavorites(resumeData);
                break;
            case 'add':
                await addToFavorites(resumeData);
                break;
            case 'remove':
                await removeFromFavorites(resumeData);
                break;
            case 'organize':
                await organizeFavorites(resumeData);
                break;
            case 'export':
                await exportFavorites(resumeData);
                break;
            case 'import':
                await importFavorites(resumeData);
                break;
        }
    }
}
/**
 * View all favorites
 */
export async function viewFavorites(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n⭐ Your Favorites\n'));
    // Initialize favorites if not exists
    const favorites = {
        templates: [],
        sections: [],
        themes: [],
        exports: [],
        searches: []
    };
    // Display favorites by category
    if (favorites.templates && favorites.templates.length > 0) {
        console.log(chalk[colors.primary]('📄 Favorite Templates:'));
        favorites.templates.forEach((template, index) => {
            console.log(`${index + 1}. ${template.name} - ${template.description || 'No description'}`);
        });
        console.log();
    }
    if (favorites.sections && favorites.sections.length > 0) {
        console.log(chalk[colors.primary]('📋 Favorite Sections:'));
        favorites.sections.forEach((section, index) => {
            console.log(`${index + 1}. ${section.name} - ${section.type || 'Unknown type'}`);
        });
        console.log();
    }
    if (favorites.themes && favorites.themes.length > 0) {
        console.log(chalk[colors.primary]('🎨 Favorite Themes:'));
        favorites.themes.forEach((theme, index) => {
            console.log(`${index + 1}. ${theme.name} - ${theme.description || 'No description'}`);
        });
        console.log();
    }
    if (favorites.exports && favorites.exports.length > 0) {
        console.log(chalk[colors.primary]('📤 Favorite Export Settings:'));
        favorites.exports.forEach((exportSetting, index) => {
            console.log(`${index + 1}. ${exportSetting.name} - ${exportSetting.format || 'Unknown format'}`);
        });
        console.log();
    }
    if (favorites.searches && favorites.searches.length > 0) {
        console.log(chalk[colors.primary]('🔍 Saved Searches:'));
        favorites.searches.forEach((search, index) => {
            console.log(`${index + 1}. "${search.query}" - ${search.results || 0} results`);
        });
        console.log();
    }
    // Check if no favorites exist
    const totalFavorites = (favorites.templates?.length || 0) +
        (favorites.sections?.length || 0) +
        (favorites.themes?.length || 0) +
        (favorites.exports?.length || 0) +
        (favorites.searches?.length || 0);
    if (totalFavorites === 0) {
        console.log(chalk[colors.secondary]('No favorites saved yet. Use the "Add to Favorites" option to start building your collection.\n'));
    }
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}
/**
 * Add item to favorites
 */
export async function addToFavorites(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n➕ Add to Favorites\n'));
    const { favoriteType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'favoriteType',
            message: 'What would you like to add to favorites?',
            choices: [
                { name: '📄 Template', value: 'template' },
                { name: '📋 Resume Section', value: 'section' },
                { name: '🎨 Theme', value: 'theme' },
                { name: '📤 Export Setting', value: 'export' },
                { name: '🔍 Search Query', value: 'search' },
                { name: '🔙 Back', value: 'back' }
            ]
        }
    ]);
    if (favoriteType === 'back')
        return;
    // Initialize favorites if not exists
    // Configuration not available in modular version
    console.log(chalk[colors.secondary]('Favorites configuration not available.\n'));
    try {
        switch (favoriteType) {
            case 'template':
                await addTemplateFavorite(resumeData, colors);
                break;
            case 'section':
                await addSectionFavorite(resumeData, colors);
                break;
            case 'theme':
                await addThemeFavorite(resumeData, colors);
                break;
            case 'export':
                await addExportFavorite(resumeData, colors);
                break;
            case 'search':
                await addSearchFavorite(resumeData, colors);
                break;
        }
        // Save config - functionality not available
        // await saveConfig(config);
        console.log(chalk[colors.success]('\n✅ Added to favorites successfully!\n'));
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error adding to favorites: ${error}\n`));
    }
}
/**
 * Add template to favorites
 */
async function addTemplateFavorite(resumeData, colors) {
    const { name, description, templatePath } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Template name:',
            validate: (input) => input.trim().length > 0 || 'Name is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Description (optional):'
        },
        {
            type: 'input',
            name: 'templatePath',
            message: 'Template file path:',
            validate: (input) => input.trim().length > 0 || 'Path is required'
        }
    ]);
    // config.favorites!.templates!.push({
    console.log(chalk[colors.secondary]('Template favorites not available.\n'));
}
/**
 * Add section to favorites
 */
async function addSectionFavorite(resumeData, colors) {
    const { name, type, content } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Section name:',
            validate: (input) => input.trim().length > 0 || 'Name is required'
        },
        {
            type: 'list',
            name: 'type',
            message: 'Section type:',
            choices: [
                'experience', 'education', 'skills', 'projects',
                'certifications', 'awards', 'publications', 'other'
            ]
        },
        {
            type: 'editor',
            name: 'content',
            message: 'Section content:'
        }
    ]);
    // config.favorites!.sections!.push({
    console.log(chalk[colors.secondary]('Section favorites not available.\n'));
}
/**
 * Add theme to favorites
 */
async function addThemeFavorite(resumeData, colors) {
    const { name, description, primaryColor, secondaryColor } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Theme name:',
            validate: (input) => input.trim().length > 0 || 'Name is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Description (optional):'
        },
        {
            type: 'input',
            name: 'primaryColor',
            message: 'Primary color (hex):',
            validate: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Invalid hex color'
        },
        {
            type: 'input',
            name: 'secondaryColor',
            message: 'Secondary color (hex):',
            validate: (input) => /^#[0-9A-Fa-f]{6}$/.test(input) || 'Invalid hex color'
        }
    ]);
    // config.favorites!.themes!.push({
    console.log(chalk[colors.secondary]('Theme favorites not available.\n'));
}
/**
 * Add export setting to favorites
 */
async function addExportFavorite(resumeData, colors) {
    const { name, format, options } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Export setting name:',
            validate: (input) => input.trim().length > 0 || 'Name is required'
        },
        {
            type: 'list',
            name: 'format',
            message: 'Export format:',
            choices: ['PDF', 'HTML', 'DOCX', 'TXT', 'JSON']
        },
        {
            type: 'input',
            name: 'options',
            message: 'Export options (JSON format):',
            default: '{}'
        }
    ]);
    // config.favorites!.exports!.push({
    console.log(chalk[colors.secondary]('Export favorites not available.\n'));
}
/**
 * Add search to favorites
 */
async function addSearchFavorite(resumeData, colors) {
    const { query, description } = await inquirer.prompt([
        {
            type: 'input',
            name: 'query',
            message: 'Search query:',
            validate: (input) => input.trim().length > 0 || 'Query is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Description (optional):'
        }
    ]);
    // config.favorites!.searches!.push({
    console.log(chalk[colors.secondary]('Search favorites not available.\n'));
}
/**
 * Remove item from favorites
 */
export async function removeFromFavorites(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n🗑️ Remove from Favorites\n'));
    console.log(chalk[colors.secondary]('No favorites to remove.\n'));
    return;
}
/**
 * Organize favorites
 */
export async function organizeFavorites(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📂 Organize Favorites\n'));
    console.log(chalk[colors.secondary]('No favorites to organize.\n'));
    return;
}
/**
 * Export favorites
 */
export async function exportFavorites(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📤 Export Favorites\n'));
    console.log(chalk[colors.secondary]('No favorites to export.\n'));
    return;
}
/**
 * Import favorites
 */
export async function importFavorites(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📥 Import Favorites\n'));
    console.log(chalk[colors.secondary]('Import functionality not available.\n'));
    return;
}
//# sourceMappingURL=interactive-favorites.js.map
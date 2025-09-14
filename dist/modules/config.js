import fs from 'fs';
import path from 'path';
import os from 'os';
const CONFIG_DIR = path.join(os.homedir(), '.resume-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
    theme: 'light',
    favorites: [],
    searchHistory: []
};
/**
 * Ensure config directory exists
 */
function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}
/**
 * Load user configuration
 */
export function loadConfig() {
    try {
        ensureConfigDir();
        if (fs.existsSync(CONFIG_FILE)) {
            const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
            const config = JSON.parse(configData);
            return { ...DEFAULT_CONFIG, ...config };
        }
    }
    catch (error) {
        console.warn('Failed to load config, using defaults:', error);
    }
    return DEFAULT_CONFIG;
}
/**
 * Save user configuration
 */
export function saveConfig(config) {
    try {
        ensureConfigDir();
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    }
    catch (error) {
        console.error('Failed to save config:', error);
    }
}
/**
 * Update specific config property
 */
export function updateConfig(updates) {
    const currentConfig = loadConfig();
    const newConfig = { ...currentConfig, ...updates };
    saveConfig(newConfig);
    return newConfig;
}
/**
 * Add to favorites
 */
export function addToFavorites(section) {
    const config = loadConfig();
    if (!config.favorites.includes(section)) {
        config.favorites.push(section);
        saveConfig(config);
    }
    return config;
}
/**
 * Remove from favorites
 */
export function removeFromFavorites(section) {
    const config = loadConfig();
    config.favorites = config.favorites.filter(fav => fav !== section);
    saveConfig(config);
    return config;
}
/**
 * Add to search history
 */
export function addToSearchHistory(query) {
    const config = loadConfig();
    if (!config.searchHistory) {
        config.searchHistory = [];
    }
    // Remove if already exists to avoid duplicates
    config.searchHistory = config.searchHistory.filter(item => item !== query);
    // Add to beginning
    config.searchHistory.unshift(query);
    // Keep only last 10 searches
    config.searchHistory = config.searchHistory.slice(0, 10);
    saveConfig(config);
    return config;
}
/**
 * Get theme colors based on configuration
 */
export function getThemeColors(config) {
    const themes = {
        dark: {
            primary: 'cyanBright',
            secondary: 'gray',
            accent: 'greenBright',
            success: 'greenBright',
            error: 'redBright',
            warning: 'yellowBright'
        },
        light: {
            primary: 'blue',
            secondary: 'gray',
            accent: 'green',
            success: 'green',
            error: 'red',
            warning: 'yellow'
        },
        colorful: {
            primary: 'magentaBright',
            secondary: 'yellowBright',
            accent: 'cyanBright',
            success: 'greenBright',
            error: 'redBright',
            warning: 'yellowBright'
        },
        professional: {
            primary: 'blue',
            secondary: 'gray',
            accent: 'green',
            success: 'green',
            error: 'red',
            warning: 'yellow'
        }
    };
    return themes[config.theme] || themes.dark;
}
//# sourceMappingURL=config.js.map
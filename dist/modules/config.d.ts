import { UserConfig, SectionKey, ThemeColors } from '../data/types.js';
/**
 * Load user configuration
 */
export declare function loadConfig(): UserConfig;
/**
 * Save user configuration
 */
export declare function saveConfig(config: UserConfig): void;
/**
 * Update specific config property
 */
export declare function updateConfig(updates: Partial<UserConfig>): UserConfig;
/**
 * Add to favorites
 */
export declare function addToFavorites(section: SectionKey): UserConfig;
/**
 * Remove from favorites
 */
export declare function removeFromFavorites(section: SectionKey): UserConfig;
/**
 * Add to search history
 */
export declare function addToSearchHistory(query: string): UserConfig;
/**
 * Get theme colors based on configuration
 */
export declare function getThemeColors(config: UserConfig): ThemeColors;
//# sourceMappingURL=config.d.ts.map
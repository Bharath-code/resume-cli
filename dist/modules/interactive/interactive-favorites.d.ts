import { UserConfig, ResumeData } from '../../data/types.js';
/**
 * Manage favorite resume sections
 */
export declare function manageFavorites(resumeData: ResumeData): Promise<void>;
/**
 * View favorite sections
 */
export declare function viewFavorites(resumeData: ResumeData, config: UserConfig): Promise<void>;
/**
 * Add section to favorites
 */
export declare function addToFavorites(resumeData: ResumeData, config: UserConfig): Promise<void>;
/**
 * Remove section from favorites
 */
export declare function removeFromFavorites(resumeData: ResumeData, config: UserConfig): Promise<void>;
//# sourceMappingURL=interactive-favorites.d.ts.map
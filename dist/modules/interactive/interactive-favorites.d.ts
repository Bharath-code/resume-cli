import { ResumeData } from '../../data/types.js';
/**
 * Manage favorites/bookmarks
 */
export declare function manageFavorites(resumeData: ResumeData): Promise<void>;
/**
 * View all favorites
 */
export declare function viewFavorites(resumeData: ResumeData): Promise<void>;
/**
 * Add item to favorites
 */
export declare function addToFavorites(resumeData: ResumeData): Promise<void>;
/**
 * Remove item from favorites
 */
export declare function removeFromFavorites(resumeData: ResumeData): Promise<void>;
/**
 * Organize favorites
 */
export declare function organizeFavorites(resumeData: ResumeData): Promise<void>;
/**
 * Export favorites
 */
export declare function exportFavorites(resumeData: ResumeData): Promise<void>;
/**
 * Import favorites
 */
export declare function importFavorites(resumeData: ResumeData): Promise<void>;
//# sourceMappingURL=interactive-favorites.d.ts.map
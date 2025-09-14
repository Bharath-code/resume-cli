import { ResumeData, SectionKey, SearchResult } from '../data/types.js';
/**
 * Search within resume data
 */
export declare function searchResume(resumeData: ResumeData, query: string): SearchResult[];
/**
 * Get search suggestions based on resume content
 */
export declare function getSearchSuggestions(resumeData: ResumeData): string[];
/**
 * Filter search results by section
 */
export declare function filterResultsBySection(results: SearchResult[], section: SectionKey): SearchResult[];
/**
 * Group search results by section
 */
export declare function groupResultsBySection(results: SearchResult[]): Record<string, SearchResult[]>;
//# sourceMappingURL=search.d.ts.map
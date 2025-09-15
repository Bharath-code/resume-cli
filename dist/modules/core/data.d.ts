import { ResumeData, SectionKey } from '../../data/types.js';
/**
 * Load resume data from JSON file
 */
export declare function loadResumeData(): ResumeData;
/**
 * Get filtered resume data based on specified sections
 */
export declare function getFilteredResumeData(sections?: SectionKey[]): Partial<ResumeData>;
/**
 * Get available section keys
 */
export declare function getAvailableSections(): SectionKey[];
/**
 * Validate if provided sections exist in resume data
 */
export declare function validateSections(sections: string[]): {
    valid: SectionKey[];
    invalid: string[];
};
/**
 * Get package.json data
 */
export declare function getPackageInfo(): any;
//# sourceMappingURL=data.d.ts.map
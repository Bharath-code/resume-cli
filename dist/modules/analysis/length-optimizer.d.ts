import { ResumeData } from '../../data/types.js';
export interface LengthConstraints {
    maxPages: number;
    maxWords?: number;
    maxCharacters?: number;
    targetFormat: 'pdf' | 'docx' | 'txt' | 'html';
    prioritySections: string[];
}
export interface OptimizationResult {
    originalLength: {
        pages: number;
        words: number;
        characters: number;
    };
    optimizedLength: {
        pages: number;
        words: number;
        characters: number;
    };
    reductionPercentage: number;
    sectionsModified: string[];
    suggestions: OptimizationSuggestion[];
    optimizedResume: ResumeData;
}
export interface OptimizationSuggestion {
    section: string;
    type: 'trim' | 'remove' | 'condense' | 'prioritize';
    description: string;
    impact: 'low' | 'medium' | 'high';
    wordsReduced: number;
}
export interface OptimizationOptions {
    preserveKeywords: boolean;
    maintainReadability: boolean;
    aggressiveMode: boolean;
    customPriorities?: {
        [section: string]: number;
    };
}
export declare class LengthOptimizer {
    private readonly sectionPriorities;
    private readonly wordsPerPage;
    /**
     * Optimize resume length based on constraints
     */
    optimizeLength(resume: ResumeData, constraints: LengthConstraints, options?: OptimizationOptions): OptimizationResult;
    /**
     * Calculate resume statistics
     */
    private calculateResumeStats;
    /**
     * Count words in text
     */
    private countWords;
    /**
     * Remove low priority sections
     */
    private removeLowPrioritySections;
    /**
     * Trim experience descriptions
     */
    private trimExperienceDescriptions;
    /**
     * Optimize project descriptions
     */
    private optimizeProjectDescriptions;
    /**
     * Condense other sections
     */
    private condenseOtherSections;
    /**
     * Analyze current resume length
     */
    analyzeLength(resume: ResumeData, targetFormat?: 'pdf' | 'docx' | 'txt' | 'html'): {
        stats: {
            pages: number;
            words: number;
            characters: number;
        };
        recommendations: string[];
        isOptimal: boolean;
    };
    /**
     * Export optimization results
     */
    exportOptimization(result: OptimizationResult, format: 'json' | 'txt' | 'html'): string;
    /**
     * Generate text report
     */
    private generateTextReport;
    /**
     * Generate HTML report
     */
    private generateHtmlReport;
}
//# sourceMappingURL=length-optimizer.d.ts.map
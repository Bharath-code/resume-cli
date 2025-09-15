import { ResumeData } from '../data/types.js';
interface KeywordSuggestion {
    keyword: string;
    relevance: number;
    category: 'technical' | 'soft' | 'industry' | 'role' | 'certification';
    context: string;
    priority: 'high' | 'medium' | 'low';
}
interface KeywordAnalysis {
    currentKeywords: string[];
    missingKeywords: KeywordSuggestion[];
    suggestions: KeywordSuggestion[];
    overusedKeywords: string[];
    keywordDensity: {
        [key: string]: number;
    };
    score: number;
}
interface OptimizationOptions {
    industry?: string;
    role?: string;
    experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
    targetKeywordCount?: number;
    includeEmergingTech?: boolean;
}
export declare class KeywordOptimizer {
    private industryKeywords;
    private emergingTechKeywords;
    private actionVerbs;
    /**
     * Analyze resume keywords and suggest improvements
     */
    analyzeKeywords(resume: ResumeData, jobDescription?: string, options?: OptimizationOptions): KeywordAnalysis;
    /**
     * Generate keyword suggestions for specific sections
     */
    suggestSectionKeywords(section: 'experience' | 'projects' | 'skills' | 'summary', content: string, options?: OptimizationOptions): KeywordSuggestion[];
    /**
     * Optimize resume content by suggesting keyword placements
     */
    optimizeContent(resume: ResumeData, targetKeywords: string[], options?: OptimizationOptions): {
        optimizedResume: ResumeData;
        changes: Array<{
            section: string;
            original: string;
            optimized: string;
            addedKeywords: string[];
        }>;
    };
    /**
     * Generate industry-specific keyword recommendations
     */
    getIndustryRecommendations(industry: string, role?: string): {
        mustHave: KeywordSuggestion[];
        recommended: KeywordSuggestion[];
        emerging: KeywordSuggestion[];
    };
    private extractResumeText;
    private extractKeywords;
    private extractPhrases;
    private calculateKeywordDensity;
    private getIndustryKeywords;
    private findMissingKeywords;
    private generateSuggestions;
    private findOverusedKeywords;
    private calculateKeywordScore;
    private optimizeText;
    private canIntegrateKeyword;
    private integrateKeyword;
    private suggestExperienceKeywords;
    private suggestProjectKeywords;
    private suggestSkillKeywords;
    private suggestSummaryKeywords;
    private createKeywordSuggestions;
    private calculateRelevance;
    private categorizeKeyword;
    private getKeywordContext;
    private getKeywordPriority;
    private isTechnicalKeyword;
    private isSoftSkillKeyword;
    private isCertificationKeyword;
    private isIndustryKeyword;
    private isRoleKeyword;
    private getRoleKeywords;
    /**
     * Export keyword analysis to different formats
     */
    exportAnalysis(analysis: KeywordAnalysis, format?: 'json' | 'text' | 'csv'): string;
    private exportToText;
    private exportToCSV;
}
export {};
//# sourceMappingURL=keyword-optimizer.d.ts.map
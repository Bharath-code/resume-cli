import { ResumeData } from '../data/types.js';
interface JobDescription {
    title: string;
    company: string;
    description: string;
    requirements: string[];
    preferredSkills: string[];
    keywords: string[];
}
interface ATSScoreResult {
    overallScore: number;
    breakdown: {
        keywordMatch: number;
        skillsMatch: number;
        experienceMatch: number;
        formatScore: number;
    };
    suggestions: string[];
    missingKeywords: string[];
    matchedKeywords: string[];
    recommendations: {
        category: string;
        suggestion: string;
        impact: 'high' | 'medium' | 'low';
    }[];
}
interface ATSAnalysisOptions {
    strictMode?: boolean;
    industryFocus?: string;
    experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
    includeFormatAnalysis?: boolean;
}
export declare class ATSScoreCalculator {
    private commonATSKeywords;
    private industryKeywords;
    /**
     * Calculate ATS score for a resume against a job description
     */
    calculateScore(resume: ResumeData, jobDescription: JobDescription, options?: ATSAnalysisOptions): ATSScoreResult;
    /**
     * Analyze multiple job descriptions and find the best matches
     */
    analyzeMultipleJobs(resume: ResumeData, jobDescriptions: JobDescription[], options?: ATSAnalysisOptions): Array<ATSScoreResult & {
        jobTitle: string;
        company: string;
    }>;
    /**
     * Generate optimization suggestions for improving ATS score
     */
    generateOptimizationPlan(resume: ResumeData, jobDescription: JobDescription, targetScore?: number): {
        currentScore: number;
        targetScore: number;
        actionItems: Array<{
            action: string;
            priority: 'high' | 'medium' | 'low';
            expectedImpact: number;
            category: string;
        }>;
    };
    private extractResumeText;
    private extractJobText;
    private analyzeKeywords;
    private analyzeSkills;
    private analyzeExperience;
    private analyzeFormat;
    private calculateOverallScore;
    private generateSuggestions;
    private generateRecommendations;
    private calculateExperienceYears;
    private hasRelevantExperience;
    private getExpectedYears;
    /**
     * Export ATS analysis results to different formats
     */
    exportAnalysis(result: ATSScoreResult, format?: 'json' | 'text' | 'html'): string;
    private exportToText;
    private exportToHTML;
}
export {};
//# sourceMappingURL=ats-score.d.ts.map
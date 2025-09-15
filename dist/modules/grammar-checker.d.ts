import { ResumeData } from '../data/types.js';
export interface GrammarIssue {
    type: 'grammar' | 'spelling' | 'punctuation' | 'style';
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestion: string;
    section: string;
    field: string;
    position: {
        start: number;
        end: number;
    };
    originalText: string;
    correctedText: string;
}
export interface GrammarCheckResult {
    totalIssues: number;
    issuesByType: {
        grammar: number;
        spelling: number;
        punctuation: number;
        style: number;
    };
    issuesBySeverity: {
        low: number;
        medium: number;
        high: number;
    };
    issues: GrammarIssue[];
    overallScore: number;
    recommendations: string[];
}
export interface GrammarCheckOptions {
    checkSpelling?: boolean;
    checkGrammar?: boolean;
    checkPunctuation?: boolean;
    checkStyle?: boolean;
    strictMode?: boolean;
    customDictionary?: string[];
}
export declare class GrammarChecker {
    private readonly commonMisspellings;
    private readonly technicalTerms;
    private readonly grammarRules;
    private readonly styleRules;
    /**
     * Check grammar and spelling for the entire resume
     */
    checkGrammar(resume: ResumeData, options?: GrammarCheckOptions): GrammarCheckResult;
    /**
      * Check grammar and spelling for the entire resume (alias for checkGrammar)
      */
    checkResume(resumeData: ResumeData, options?: GrammarCheckOptions): GrammarCheckResult;
    private checkResumeSection;
    private originalCheckGrammar;
    private checkSection;
    private checkSpelling;
    private checkGrammarRules;
    private checkPunctuation;
    private checkStyle;
    private generateResult;
    private generateRecommendations;
    /**
     * Apply grammar and spelling corrections to the resume
     */
    applySuggestions(resume: ResumeData, issues: GrammarIssue[]): ResumeData;
    /**
     * Apply corrections to resume text
     */
    applyCorrections(resume: ResumeData, issues: GrammarIssue[]): ResumeData;
    /**
     * Export grammar check report in various formats
     */
    exportGrammarReport(result: GrammarCheckResult, format?: 'json' | 'txt' | 'html'): string;
    /**
     * Export report in specified format
     */
    exportReport(result: GrammarCheckResult, format: 'json' | 'txt' | 'html'): string;
    /**
     * Generate a text-based report
     */
    private generateTextReport;
    /**
     * Generate an HTML report
     */
    private generateHtmlReport;
}
//# sourceMappingURL=grammar-checker.d.ts.map
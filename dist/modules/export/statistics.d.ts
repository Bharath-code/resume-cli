import { ResumeData, ResumeStats, UserConfig } from '../../data/types.js';
/**
 * Calculate resume statistics
 */
export declare function calculateResumeStats(resumeData: ResumeData): ResumeStats;
/**
 * Display formatted resume statistics
 */
export declare function displayResumeStats(stats: ResumeStats, config?: UserConfig): void;
/**
 * Get detailed technology breakdown
 */
export declare function getTechBreakdown(resumeData: ResumeData): Record<string, string[]>;
/**
 * Display technology breakdown
 */
export declare function displayTechBreakdown(resumeData: ResumeData, config?: UserConfig): void;
/**
 * Get experience timeline
 */
export declare function getExperienceTimeline(resumeData: ResumeData): Array<{
    company: string;
    title: string;
    duration: string;
    years: number;
}>;
/**
 * Display experience timeline
 */
export declare function displayExperienceTimeline(resumeData: ResumeData, config?: UserConfig): void;
//# sourceMappingURL=statistics.d.ts.map
import { ResumeData, Experience } from '../../data/types.js';
export interface ChartConfig {
    height?: number;
    width?: number;
    colors?: any[];
    padding?: string;
    format?: (value: number, index: number) => string;
}
export interface TimelinePoint {
    year: number;
    value: number;
    label: string;
    company?: string;
}
export interface SkillData {
    name: string;
    level: number;
    category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}
/**
 * Interactive Charts Manager for Resume Visualization
 * Provides ASCII-based charts for experience timeline and skill radar
 */
export declare class InteractiveChartsManager {
    private static readonly DEFAULT_CONFIG;
    private static readonly SKILL_CATEGORIES;
    /**
     * Generate experience timeline chart
     */
    static generateExperienceTimeline(experiences: Experience[], config?: Partial<ChartConfig>): string;
    /**
     * Generate skill level radar chart
     */
    static generateSkillRadar(skills: string[], config?: Partial<ChartConfig>): string;
    /**
     * Generate skill level bar chart
     */
    static generateSkillBars(skills: string[], config?: Partial<ChartConfig>): string;
    /**
     * Generate comprehensive dashboard with multiple charts
     */
    static generateDashboard(resumeData: ResumeData, config?: Partial<ChartConfig>): string;
    /**
     * Parse experience data into timeline points
     */
    private static parseExperienceData;
    /**
     * Parse skills into structured data with levels
     */
    private static parseSkillData;
    /**
     * Categorize skills by type
     */
    private static categorizeSkills;
    /**
     * Create skill radar visualization
     */
    private static createSkillRadar;
    /**
     * Format timeline chart with labels
     */
    private static formatTimelineChart;
    /**
     * Generate summary statistics
     */
    private static generateSummaryStats;
}
export declare const generateExperienceChart: (experiences: Experience[], config?: Partial<ChartConfig>) => string;
export declare const generateSkillChart: (skills: string[], config?: Partial<ChartConfig>) => string;
export declare const generateDashboard: (resumeData: ResumeData, config?: Partial<ChartConfig>) => string;
export default InteractiveChartsManager;
//# sourceMappingURL=interactive-charts.d.ts.map
import { ResumeData } from '../data/types.js';
/**
 * Social media platform configuration
 */
export interface SocialPlatform {
    name: string;
    apiEndpoint: string;
    authRequired: boolean;
    supportedFields: string[];
}
/**
 * Social sync options
 */
export interface SocialSyncOptions {
    platforms: string[];
    autoUpdate: boolean;
    syncFrequency: 'manual' | 'daily' | 'weekly';
    conflictResolution: 'manual' | 'platform' | 'local';
}
/**
 * Social sync result
 */
export interface SocialSyncResult {
    platform: string;
    success: boolean;
    updatedFields: string[];
    conflicts: SocialConflict[];
    lastSyncDate: Date;
    message: string;
}
/**
 * Social conflict when data differs
 */
export interface SocialConflict {
    field: string;
    localValue: string;
    platformValue: string;
    resolution: 'pending' | 'resolved';
}
/**
 * LinkedIn profile data structure
 */
export interface LinkedInProfile {
    id: string;
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    location: string;
    industry: string;
    positions: LinkedInPosition[];
    educations: LinkedInEducation[];
    skills: LinkedInSkill[];
    profilePicture?: string;
}
export interface LinkedInPosition {
    id: string;
    title: string;
    companyName: string;
    description: string;
    startDate: {
        month: number;
        year: number;
    };
    endDate?: {
        month: number;
        year: number;
    };
    location: string;
    isCurrent: boolean;
}
export interface LinkedInEducation {
    id: string;
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: {
        year: number;
    };
    endDate?: {
        year: number;
    };
}
export interface LinkedInSkill {
    name: string;
    endorsementCount: number;
}
/**
 * GitHub profile data structure
 */
export interface GitHubProfile {
    login: string;
    name: string;
    bio: string;
    location: string;
    email: string;
    blog: string;
    company: string;
    repositories: GitHubRepository[];
    contributions: GitHubContribution[];
    languages: {
        [key: string]: number;
    };
}
export interface GitHubRepository {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
    topics: string[];
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface GitHubContribution {
    date: Date;
    count: number;
    level: number;
}
/**
 * Social Media Integration Manager
 */
export declare class SocialIntegration {
    private platforms;
    private authTokens;
    constructor();
    /**
     * Initialize supported social platforms
     */
    private initializePlatforms;
    /**
     * Set authentication token for a platform
     */
    setAuthToken(platform: string, token: string): void;
    /**
     * Get available platforms
     */
    getAvailablePlatforms(): SocialPlatform[];
    /**
     * Sync resume data with social platforms
     */
    syncWithPlatforms(resumeData: ResumeData, options: SocialSyncOptions): Promise<SocialSyncResult[]>;
    /**
     * Sync with a specific platform
     */
    private syncWithPlatform;
    /**
     * Sync with LinkedIn
     */
    private syncWithLinkedIn;
    /**
     * Sync with GitHub
     */
    private syncWithGitHub;
    /**
     * Fetch LinkedIn profile (simulated)
     */
    private fetchLinkedInProfile;
    /**
     * Fetch GitHub profile (simulated)
     */
    private fetchGitHubProfile;
    /**
     * Apply sync results to resume data
     */
    applySync(resumeData: ResumeData, syncResults: SocialSyncResult[], conflictResolutions: {
        [key: string]: 'local' | 'platform';
    }): ResumeData;
    /**
     * Apply field update to resume data
     */
    private applyFieldUpdate;
    /**
     * Export sync configuration
     */
    exportSyncConfig(options: SocialSyncOptions): string;
    /**
     * Import sync configuration
     */
    importSyncConfig(configJson: string): SocialSyncOptions;
}
//# sourceMappingURL=social-integration.d.ts.map
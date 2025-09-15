import { ResumeData } from '../../data/types.js';
export interface GitHubUser {
    login: string;
    name: string;
    bio: string;
    company: string;
    location: string;
    email: string;
    blog: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    avatar_url: string;
}
export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    language: string;
    topics: string[];
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    open_issues_count: number;
    license: {
        name: string;
        spdx_id: string;
    } | null;
}
export interface GitHubContribution {
    date: string;
    count: number;
    level: number;
}
export interface GitHubStats {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalStars: number;
    totalForks: number;
    contributionStreak: number;
    mostUsedLanguages: {
        [key: string]: number;
    };
    yearlyContributions: GitHubContribution[];
}
export interface GitHubAnalytics {
    user: GitHubUser;
    repositories: GitHubRepository[];
    stats: GitHubStats;
    topRepositories: GitHubRepository[];
    recentActivity: any[];
    contributionGraph: GitHubContribution[];
}
export interface GitHubAnalyticsOptions {
    username: string;
    token?: string;
    includePrivate?: boolean;
    maxRepos?: number;
}
export declare class GitHubAnalyticsEngine {
    private baseURL;
    private token?;
    constructor(token?: string);
    private getHeaders;
    fetchUserProfile(username: string): Promise<GitHubUser>;
    fetchUserRepositories(username: string, options?: {
        maxRepos?: number;
        includePrivate?: boolean;
    }): Promise<GitHubRepository[]>;
    fetchUserStats(username: string, repositories: GitHubRepository[]): Promise<GitHubStats>;
    private fetchContributionData;
    private calculateStreak;
    getTopRepositories(repositories: GitHubRepository[], limit?: number): Promise<GitHubRepository[]>;
    generateAnalytics(options: GitHubAnalyticsOptions): Promise<GitHubAnalytics>;
    formatAnalyticsForDisplay(analytics: GitHubAnalytics): string;
    exportToResumeData(analytics: GitHubAnalytics, resumeData: ResumeData): Promise<ResumeData>;
}
export default GitHubAnalyticsEngine;
//# sourceMappingURL=github-analytics.d.ts.map
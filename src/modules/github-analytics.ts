import axios from 'axios';
import chalk from 'chalk';
import { ResumeData } from '../data/types';

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
  mostUsedLanguages: { [key: string]: number };
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

export class GitHubAnalyticsEngine {
  private baseURL = 'https://api.github.com';
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  private getHeaders() {
    const headers: any = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Resume-Builder-Analytics'
    };
    
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    
    return headers;
  }

  async fetchUserProfile(username: string): Promise<GitHubUser> {
    try {
      const response = await axios.get(`${this.baseURL}/users/${username}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch GitHub user profile: ${error}`);
    }
  }

  async fetchUserRepositories(username: string, options: { maxRepos?: number; includePrivate?: boolean } = {}): Promise<GitHubRepository[]> {
    try {
      const { maxRepos = 100, includePrivate = false } = options;
      const type = includePrivate ? 'all' : 'public';
      
      const response = await axios.get(`${this.baseURL}/users/${username}/repos`, {
        headers: this.getHeaders(),
        params: {
          type,
          sort: 'updated',
          per_page: maxRepos,
          page: 1
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repositories: ${error}`);
    }
  }

  async fetchUserStats(username: string, repositories: GitHubRepository[]): Promise<GitHubStats> {
    try {
      // Calculate stats from repositories
      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
      
      // Language statistics
      const languageStats: { [key: string]: number } = {};
      repositories.forEach(repo => {
        if (repo.language) {
          languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
        }
      });
      
      // Sort languages by usage
      const mostUsedLanguages = Object.fromEntries(
        Object.entries(languageStats)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
      );

      // Fetch contribution data (this would require GitHub GraphQL API for accurate data)
      const contributionData = await this.fetchContributionData(username);
      
      return {
        totalCommits: contributionData.totalCommits,
        totalPRs: contributionData.totalPRs,
        totalIssues: contributionData.totalIssues,
        totalStars,
        totalForks,
        contributionStreak: contributionData.contributionStreak,
        mostUsedLanguages,
        yearlyContributions: contributionData.yearlyContributions
      };
    } catch (error) {
      throw new Error(`Failed to calculate GitHub stats: ${error}`);
    }
  }

  private async fetchContributionData(username: string): Promise<{
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    contributionStreak: number;
    yearlyContributions: GitHubContribution[];
  }> {
    // This is a simplified version. For real implementation, you'd use GitHub GraphQL API
    // or a service like GitHub's contribution graph API
    try {
      // Simulate contribution data for now
      const currentYear = new Date().getFullYear();
      const yearlyContributions: GitHubContribution[] = [];
      
      // Generate mock contribution data for the past year
      const startDate = new Date(currentYear, 0, 1);
      const endDate = new Date(currentYear, 11, 31);
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        yearlyContributions.push({
          date: d.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 10),
          level: Math.floor(Math.random() * 5)
        });
      }
      
      const totalCommits = yearlyContributions.reduce((sum, day) => sum + day.count, 0);
      
      return {
        totalCommits,
        totalPRs: Math.floor(totalCommits * 0.3), // Estimate
        totalIssues: Math.floor(totalCommits * 0.2), // Estimate
        contributionStreak: this.calculateStreak(yearlyContributions),
        yearlyContributions
      };
    } catch (error) {
      // Return default values if API fails
      return {
        totalCommits: 0,
        totalPRs: 0,
        totalIssues: 0,
        contributionStreak: 0,
        yearlyContributions: []
      };
    }
  }

  private calculateStreak(contributions: GitHubContribution[]): number {
    let currentStreak = 0;
    let maxStreak = 0;
    
    // Sort by date descending to start from most recent
    const sortedContributions = contributions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const contribution of sortedContributions) {
      if (contribution.count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  }

  async getTopRepositories(repositories: GitHubRepository[], limit: number = 5): Promise<GitHubRepository[]> {
    return repositories
      .sort((a, b) => {
        // Sort by stars, then forks, then recent activity
        const scoreA = a.stargazers_count * 2 + a.forks_count + (new Date(a.pushed_at).getTime() / 1000000000);
        const scoreB = b.stargazers_count * 2 + b.forks_count + (new Date(b.pushed_at).getTime() / 1000000000);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  async generateAnalytics(options: GitHubAnalyticsOptions): Promise<GitHubAnalytics> {
    try {
      console.log(chalk.blue('🔍 Fetching GitHub analytics...'));
      
      // Fetch user profile
      console.log(chalk.gray('  → Fetching user profile...'));
      const user = await this.fetchUserProfile(options.username);
      
      // Fetch repositories
      console.log(chalk.gray('  → Fetching repositories...'));
      const repositories = await this.fetchUserRepositories(options.username, {
        maxRepos: options.maxRepos,
        includePrivate: options.includePrivate
      });
      
      // Calculate stats
      console.log(chalk.gray('  → Calculating statistics...'));
      const stats = await this.fetchUserStats(options.username, repositories);
      
      // Get top repositories
      const topRepositories = await this.getTopRepositories(repositories);
      
      console.log(chalk.green('✅ GitHub analytics generated successfully!'));
      
      return {
        user,
        repositories,
        stats,
        topRepositories,
        recentActivity: [], // Would be populated with recent commits, PRs, etc.
        contributionGraph: stats.yearlyContributions
      };
    } catch (error) {
      throw new Error(`Failed to generate GitHub analytics: ${error}`);
    }
  }

  formatAnalyticsForDisplay(analytics: GitHubAnalytics): string {
    const { user, stats, topRepositories } = analytics;
    
    let output = '';
    
    // Header
    output += chalk.bold.blue(`\n📊 GitHub Analytics for ${user.name || user.login}\n`);
    output += chalk.gray('='.repeat(50)) + '\n\n';
    
    // Profile Summary
    output += chalk.bold('👤 Profile Summary\n');
    output += `   Name: ${user.name || 'N/A'}\n`;
    output += `   Username: @${user.login}\n`;
    output += `   Bio: ${user.bio || 'No bio available'}\n`;
    output += `   Company: ${user.company || 'N/A'}\n`;
    output += `   Location: ${user.location || 'N/A'}\n`;
    output += `   Public Repos: ${user.public_repos}\n`;
    output += `   Followers: ${user.followers}\n`;
    output += `   Following: ${user.following}\n\n`;
    
    // Statistics
    output += chalk.bold('📈 Statistics\n');
    output += `   ⭐ Total Stars: ${chalk.yellow(stats.totalStars.toString())}\n`;
    output += `   🍴 Total Forks: ${chalk.green(stats.totalForks.toString())}\n`;
    output += `   💻 Total Commits: ${chalk.blue(stats.totalCommits.toString())}\n`;
    output += `   🔀 Pull Requests: ${chalk.magenta(stats.totalPRs.toString())}\n`;
    output += `   🐛 Issues: ${chalk.red(stats.totalIssues.toString())}\n`;
    output += `   🔥 Contribution Streak: ${chalk.yellow(stats.contributionStreak.toString())} days\n\n`;
    
    // Top Languages
    output += chalk.bold('🔤 Most Used Languages\n');
    Object.entries(stats.mostUsedLanguages).slice(0, 5).forEach(([lang, count], index) => {
      const bar = '█'.repeat(Math.ceil(count / Math.max(...Object.values(stats.mostUsedLanguages)) * 20));
      output += `   ${index + 1}. ${lang}: ${chalk.cyan(bar)} (${count} repos)\n`;
    });
    output += '\n';
    
    // Top Repositories
    output += chalk.bold('🏆 Top Repositories\n');
    topRepositories.forEach((repo, index) => {
      output += `   ${index + 1}. ${chalk.bold(repo.name)}\n`;
      output += `      ${repo.description || 'No description'}\n`;
      output += `      ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 📝 ${repo.language || 'N/A'}\n`;
      output += `      🔗 ${repo.html_url}\n\n`;
    });
    
    return output;
  }

  async exportToResumeData(analytics: GitHubAnalytics, resumeData: ResumeData): Promise<ResumeData> {
    // Enhance resume data with GitHub analytics
    const enhancedData = { ...resumeData };
    
    // Update personal info with GitHub data
    if (analytics.user.name && !enhancedData.personal.name) {
      enhancedData.personal.name = analytics.user.name;
    }
    
    if (analytics.user.location && !enhancedData.personal.location) {
      enhancedData.personal.location = analytics.user.location;
    }
    
    // Add GitHub projects to projects section
    analytics.topRepositories.forEach(repo => {
      const existingProject = enhancedData.projects.find(p => 
        p.name.toLowerCase() === repo.name.toLowerCase()
      );
      
      if (!existingProject) {
        enhancedData.projects.push({
          name: repo.name,
          desc: `${repo.description || 'GitHub repository'} (⭐ ${repo.stargazers_count}, 🍴 ${repo.forks_count})`,
          tech: repo.language || 'Various'
        });
      }
    });
    
    // Update tech stack with GitHub languages
    const githubLanguages = Object.keys(analytics.stats.mostUsedLanguages);
    githubLanguages.forEach(lang => {
      if (!enhancedData.techStack.includes(lang)) {
        enhancedData.techStack.push(lang);
      }
    });
    
    return enhancedData;
  }
}

export default GitHubAnalyticsEngine;
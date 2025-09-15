import { ResumeData, PersonalInfo, Experience, Project } from '../data/types.js';

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
  startDate: { month: number; year: number };
  endDate?: { month: number; year: number };
  location: string;
  isCurrent: boolean;
}

export interface LinkedInEducation {
  id: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: { year: number };
  endDate?: { year: number };
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
  languages: { [key: string]: number };
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
export class SocialIntegration {
  private platforms: Map<string, SocialPlatform> = new Map();
  private authTokens: Map<string, string> = new Map();

  constructor() {
    this.initializePlatforms();
  }

  /**
   * Initialize supported social platforms
   */
  private initializePlatforms(): void {
    this.platforms.set('linkedin', {
      name: 'LinkedIn',
      apiEndpoint: 'https://api.linkedin.com/v2',
      authRequired: true,
      supportedFields: ['personalInfo', 'experience', 'education', 'skills']
    });

    this.platforms.set('github', {
      name: 'GitHub',
      apiEndpoint: 'https://api.github.com',
      authRequired: true,
      supportedFields: ['personalInfo', 'projects', 'techStack']
    });
  }

  /**
   * Set authentication token for a platform
   */
  setAuthToken(platform: string, token: string): void {
    this.authTokens.set(platform, token);
  }

  /**
   * Get available platforms
   */
  getAvailablePlatforms(): SocialPlatform[] {
    return Array.from(this.platforms.values());
  }

  /**
   * Sync resume data with social platforms
   */
  async syncWithPlatforms(resumeData: ResumeData, options: SocialSyncOptions): Promise<SocialSyncResult[]> {
    const results: SocialSyncResult[] = [];

    for (const platformName of options.platforms) {
      try {
        const result = await this.syncWithPlatform(resumeData, platformName, options);
        results.push(result);
      } catch (error) {
        results.push({
          platform: platformName,
          success: false,
          updatedFields: [],
          conflicts: [],
          lastSyncDate: new Date(),
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Sync with a specific platform
   */
  private async syncWithPlatform(resumeData: ResumeData, platformName: string, options: SocialSyncOptions): Promise<SocialSyncResult> {
    const platform = this.platforms.get(platformName);
    if (!platform) {
      throw new Error(`Platform ${platformName} not supported`);
    }

    switch (platformName) {
      case 'linkedin':
        return await this.syncWithLinkedIn(resumeData, options);
      case 'github':
        return await this.syncWithGitHub(resumeData, options);
      default:
        throw new Error(`Sync not implemented for ${platformName}`);
    }
  }

  /**
   * Sync with LinkedIn
   */
  private async syncWithLinkedIn(resumeData: ResumeData, options: SocialSyncOptions): Promise<SocialSyncResult> {
    const token = this.authTokens.get('linkedin');
    if (!token) {
      throw new Error('LinkedIn authentication token required');
    }

    // Simulate LinkedIn API call
    const linkedInProfile = await this.fetchLinkedInProfile(token);
    const conflicts: SocialConflict[] = [];
    const updatedFields: string[] = [];

    // Compare and sync personal info
    if (linkedInProfile.firstName !== resumeData.personal.name.split(' ')[0]) {
      conflicts.push({
        field: 'firstName',
        localValue: resumeData.personal.name.split(' ')[0],
        platformValue: linkedInProfile.firstName,
        resolution: 'pending'
      });
    }

    // Compare and sync experience
    for (const position of linkedInProfile.positions) {
      const matchingExp = resumeData.experience.find(exp => 
        exp.company.toLowerCase() === position.companyName.toLowerCase() &&
        exp.title.toLowerCase() === position.title.toLowerCase()
      );

      if (!matchingExp) {
        // New experience found on LinkedIn - add it
        const newExperience = {
          company: position.companyName,
          title: position.title,
          dates: `${position.startDate.month}/${position.startDate.year} - ${position.isCurrent ? 'Present' : `${position.endDate?.month}/${position.endDate?.year}`}`,
          bullets: [position.description]
        };
        resumeData.experience.push(newExperience);
        updatedFields.push('experience');
      } else if (matchingExp.bullets.join(' ') !== position.description) {
        conflicts.push({
          field: `experience.${position.companyName}.description`,
          localValue: matchingExp.bullets.join(' '),
          platformValue: position.description,
          resolution: 'pending'
        });
      }
    }

    return {
      platform: 'linkedin',
      success: true,
      updatedFields,
      conflicts,
      lastSyncDate: new Date(),
      message: `Synced with LinkedIn profile. Found ${conflicts.length} conflicts.`
    };
  }

  /**
   * Sync with GitHub
   */
  private async syncWithGitHub(resumeData: ResumeData, options: SocialSyncOptions): Promise<SocialSyncResult> {
    const token = this.authTokens.get('github');
    if (!token) {
      throw new Error('GitHub authentication token required');
    }

    // Simulate GitHub API call
    const githubProfile = await this.fetchGitHubProfile(token);
    const conflicts: SocialConflict[] = [];
    const updatedFields: string[] = [];

    // Compare and sync personal info
    if (githubProfile.name && githubProfile.name !== resumeData.personal.name) {
      conflicts.push({
        field: 'name',
        localValue: resumeData.personal.name,
        platformValue: githubProfile.name,
        resolution: 'pending'
      });
    }

    // Sync projects from repositories
    for (const repo of githubProfile.repositories.filter(r => !r.isPrivate && r.stars > 0)) {
      const matchingProject = resumeData.projects.find(proj => 
        proj.name.toLowerCase() === repo.name.toLowerCase()
      );

      if (!matchingProject) {
        // New project found on GitHub - add it
        const newProject = {
          name: repo.name,
          desc: repo.description || `${repo.stars} stars, ${repo.forks} forks. ${repo.topics.length > 0 ? `Topics: ${repo.topics.join(', ')}` : ''}`.trim(),
          tech: repo.language || 'Various'
        };
        resumeData.projects.push(newProject);
        updatedFields.push('projects');
      }
    }

    // Update tech stack based on GitHub languages
    const githubLanguages = Object.keys(githubProfile.languages);
    const currentTechStack = resumeData.techStack || [];
    const newTechnologies = githubLanguages.filter(lang => 
      !currentTechStack.some(tech => tech.toLowerCase() === lang.toLowerCase())
    );

    // Add new technologies to tech stack
    if (newTechnologies.length > 0) {
      if (!resumeData.techStack) {
        resumeData.techStack = [];
      }
      resumeData.techStack.push(...newTechnologies);
      updatedFields.push('techStack');
    }

    return {
      platform: 'github',
      success: true,
      updatedFields,
      conflicts,
      lastSyncDate: new Date(),
      message: `Synced with GitHub profile. Found ${newTechnologies.length} new technologies.`
    };
  }

  /**
   * Fetch LinkedIn profile (simulated)
   */
  private async fetchLinkedInProfile(token: string): Promise<LinkedInProfile> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data for demonstration
    return {
      id: 'linkedin-123',
      firstName: 'John',
      lastName: 'Doe',
      headline: 'Senior Software Engineer',
      summary: 'Experienced software engineer with expertise in full-stack development.',
      location: 'San Francisco, CA',
      industry: 'Technology',
      positions: [
        {
          id: 'pos-1',
          title: 'Senior Software Engineer',
          companyName: 'Tech Corp',
          description: 'Led development of scalable web applications using React and Node.js.',
          startDate: { month: 1, year: 2022 },
          location: 'San Francisco, CA',
          isCurrent: true
        }
      ],
      educations: [
        {
          id: 'edu-1',
          schoolName: 'University of Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: { year: 2018 },
          endDate: { year: 2022 }
        }
      ],
      skills: [
        { name: 'JavaScript', endorsementCount: 25 },
        { name: 'React', endorsementCount: 20 },
        { name: 'Node.js', endorsementCount: 18 }
      ]
    };
  }

  /**
   * Fetch GitHub profile (simulated)
   */
  private async fetchGitHubProfile(token: string): Promise<GitHubProfile> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data for demonstration
    return {
      login: 'johndoe',
      name: 'John Doe',
      bio: 'Full-stack developer passionate about open source',
      location: 'San Francisco, CA',
      email: 'john@example.com',
      blog: 'https://johndoe.dev',
      company: 'Tech Corp',
      repositories: [
        {
          name: 'awesome-project',
          description: 'A really awesome project built with React and TypeScript',
          language: 'TypeScript',
          stars: 150,
          forks: 25,
          url: 'https://github.com/johndoe/awesome-project',
          topics: ['react', 'typescript', 'web'],
          isPrivate: false,
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date('2024-01-10')
        }
      ],
      contributions: [],
      languages: {
        'TypeScript': 45.2,
        'JavaScript': 30.1,
        'Python': 15.7,
        'CSS': 9.0
      }
    };
  }

  /**
   * Apply sync results to resume data
   */
  applySync(resumeData: ResumeData, syncResults: SocialSyncResult[], conflictResolutions: { [key: string]: 'local' | 'platform' }): ResumeData {
    const updatedResume = { ...resumeData };

    for (const result of syncResults) {
      if (!result.success) continue;

      // Apply resolved conflicts
      for (const conflict of result.conflicts) {
        const resolution = conflictResolutions[`${result.platform}.${conflict.field}`];
        if (resolution === 'platform') {
          // Apply platform value to resume
          this.applyFieldUpdate(updatedResume, conflict.field, conflict.platformValue);
        }
        // If 'local', keep current value (no action needed)
      }
    }

    return updatedResume;
  }

  /**
   * Apply field update to resume data
   */
  private applyFieldUpdate(resumeData: ResumeData, fieldPath: string, value: string): void {
    const parts = fieldPath.split('.');
    
    switch (parts[0]) {
      case 'name':
        resumeData.personal.name = value;
        break;
      case 'firstName':
        const nameParts = resumeData.personal.name.split(' ');
        nameParts[0] = value;
        resumeData.personal.name = nameParts.join(' ');
        break;
      case 'lastName':
        const namePartsLast = resumeData.personal.name.split(' ');
        if (namePartsLast.length > 1) {
          namePartsLast[namePartsLast.length - 1] = value;
        } else {
          namePartsLast.push(value);
        }
        resumeData.personal.name = namePartsLast.join(' ');
        break;
      case 'location':
        resumeData.personal.location = value;
        break;
      case 'email':
        resumeData.personal.email = value;
        break;
      case 'experience':
        // Handle experience updates
        if (parts.length > 2 && parts[2] === 'description') {
          const companyName = parts[1];
          const experience = resumeData.experience.find(exp => 
            exp.company.toLowerCase() === companyName.toLowerCase()
          );
          if (experience) {
            experience.bullets = [value];
          }
        }
        break;
      case 'projects':
        // Handle new projects from GitHub
        // This would be handled in the sync methods directly
        break;
      case 'techStack':
        // Handle tech stack updates
        if (!resumeData.techStack) {
          resumeData.techStack = [];
        }
        if (!resumeData.techStack.includes(value)) {
          resumeData.techStack.push(value);
        }
        break;
      default:
        console.warn(`Unknown field path: ${fieldPath}`);
    }
  }

  /**
   * Export sync configuration
   */
  exportSyncConfig(options: SocialSyncOptions): string {
    return JSON.stringify({
      platforms: options.platforms,
      autoUpdate: options.autoUpdate,
      syncFrequency: options.syncFrequency,
      conflictResolution: options.conflictResolution,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import sync configuration
   */
  importSyncConfig(configJson: string): SocialSyncOptions {
    const config = JSON.parse(configJson);
    return {
      platforms: config.platforms || [],
      autoUpdate: config.autoUpdate || false,
      syncFrequency: config.syncFrequency || 'manual',
      conflictResolution: config.conflictResolution || 'manual'
    };
  }
}
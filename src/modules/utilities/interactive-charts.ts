import asciichart from 'asciichart';
import chalk from 'chalk';
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
  level: number; // 1-10 scale
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'other';
}

/**
 * Interactive Charts Manager for Resume Visualization
 * Provides ASCII-based charts for experience timeline and skill radar
 */
export class InteractiveChartsManager {
  private static readonly DEFAULT_CONFIG: ChartConfig = {
    height: 10,
    width: 60,
    colors: ['cyan', 'green', 'yellow', 'red', 'magenta'],
    padding: '  '
  };

  private static readonly SKILL_CATEGORIES = {
    frontend: { color: chalk.blue, symbol: '🎨', name: 'Frontend' },
    backend: { color: chalk.green, symbol: '⚙️', name: 'Backend' },
    database: { color: chalk.yellow, symbol: '🗄️', name: 'Database' },
    devops: { color: chalk.red, symbol: '🚀', name: 'DevOps' },
    mobile: { color: chalk.magenta, symbol: '📱', name: 'Mobile' },
    other: { color: chalk.gray, symbol: '🔧', name: 'Other' }
  };

  /**
   * Generate experience timeline chart
   */
  static generateExperienceTimeline(
    experiences: Experience[],
    config: Partial<ChartConfig> = {}
  ): string {
    const chartConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    // Parse experience data into timeline points
    const timelineData = this.parseExperienceData(experiences);
    
    if (timelineData.length === 0) {
      return chalk.gray('No experience data available for timeline visualization.');
    }

    // Create data series for chart
    const years = timelineData.map(point => point.year);
    const values = timelineData.map(point => point.value);
    
    // Generate ASCII chart
    const chart = asciichart.plot(values, {
      height: chartConfig.height,
      colors: [asciichart.blue],
      padding: chartConfig.padding
    });

    // Add timeline labels and formatting
    const formattedChart = this.formatTimelineChart(chart, timelineData, chartConfig);
    
    return formattedChart;
  }

  /**
   * Generate skill level radar chart
   */
  static generateSkillRadar(
    skills: string[],
    config: Partial<ChartConfig> = {}
  ): string {
    const chartConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    // Convert skills to skill data with levels
    const skillData = this.parseSkillData(skills);
    
    if (skillData.length === 0) {
      return chalk.gray('No skill data available for radar visualization.');
    }

    // Group skills by category
    const categorizedSkills = this.categorizeSkills(skillData);
    
    // Generate radar visualization
    const radarChart = this.createSkillRadar(categorizedSkills, chartConfig);
    
    return radarChart;
  }

  /**
   * Generate skill level bar chart
   */
  static generateSkillBars(
    skills: string[],
    config: Partial<ChartConfig> = {}
  ): string {
    const chartConfig = { ...this.DEFAULT_CONFIG, ...config };
    const skillData = this.parseSkillData(skills);
    
    if (skillData.length === 0) {
      return chalk.gray('No skill data available for bar visualization.');
    }

    // Sort skills by level (highest first)
    const sortedSkills = skillData.sort((a, b) => b.level - a.level);
    
    let output = chalk.bold.cyan('\n📊 Skill Proficiency Levels\n');
    output += chalk.gray('━'.repeat(50)) + '\n';
    
    sortedSkills.forEach(skill => {
      const category = this.SKILL_CATEGORIES[skill.category];
      const barLength = Math.round((skill.level / 10) * 20);
      const emptyLength = 20 - barLength;
      
      const bar = '█'.repeat(barLength) + '░'.repeat(emptyLength);
      const coloredBar = category.color(bar);
      
      output += `${category.symbol} ${skill.name.padEnd(15)} ${coloredBar} ${skill.level}/10\n`;
    });
    
    return output;
  }

  /**
   * Generate comprehensive dashboard with multiple charts
   */
  static generateDashboard(
    resumeData: ResumeData,
    config: Partial<ChartConfig> = {}
  ): string {
    let dashboard = '';
    
    // Header
    dashboard += chalk.bold.cyan('\n📈 Resume Analytics Dashboard\n');
    dashboard += chalk.gray('═'.repeat(60)) + '\n\n';
    
    // Experience Timeline
    dashboard += chalk.bold.yellow('🕒 Career Timeline\n');
    dashboard += this.generateExperienceTimeline(resumeData.experience, config);
    dashboard += '\n\n';
    
    // Skill Visualization
    dashboard += chalk.bold.green('🎯 Technical Skills\n');
    dashboard += this.generateSkillBars(resumeData.techStack, config);
    dashboard += '\n\n';
    
    // Summary Stats
    dashboard += this.generateSummaryStats(resumeData);
    
    return dashboard;
  }

  /**
   * Parse experience data into timeline points
   */
  private static parseExperienceData(experiences: Experience[]): TimelinePoint[] {
    const timelinePoints: TimelinePoint[] = [];
    
    experiences.forEach((exp, index) => {
      // Extract years from date strings (assuming format like "2020-2023" or "2020-Present")
      const dateMatch = exp.dates.match(/(\d{4}).*?(\d{4}|Present)/i);
      
      if (dateMatch) {
        const startYear = parseInt(dateMatch[1]);
        const endYear = dateMatch[2] === 'Present' ? new Date().getFullYear() : parseInt(dateMatch[2]);
        
        // Create points for start and end of each role
        timelinePoints.push({
          year: startYear,
          value: index + 1,
          label: `Started at ${exp.company}`,
          company: exp.company
        });
        
        if (endYear !== startYear) {
          timelinePoints.push({
            year: endYear,
            value: index + 1,
            label: `${dateMatch[2] === 'Present' ? 'Current' : 'Ended'} at ${exp.company}`,
            company: exp.company
          });
        }
      }
    });
    
    return timelinePoints.sort((a, b) => a.year - b.year);
  }

  /**
   * Parse skills into structured data with levels
   */
  private static parseSkillData(skills: string[]): SkillData[] {
    const skillLevels: Record<string, number> = {
      // Frontend
      'react': 9, 'vue': 8, 'angular': 7, 'javascript': 9, 'typescript': 9,
      'html': 9, 'css': 8, 'sass': 8, 'tailwind': 8, 'bootstrap': 7,
      
      // Backend
      'node.js': 9, 'express': 9, 'python': 8, 'django': 7, 'flask': 7,
      'java': 7, 'spring': 6, 'php': 6, 'laravel': 6, 'ruby': 5,
      
      // Database
      'mongodb': 8, 'postgresql': 8, 'mysql': 8, 'redis': 7, 'elasticsearch': 6,
      
      // DevOps
      'docker': 8, 'kubernetes': 7, 'aws': 8, 'azure': 6, 'gcp': 6,
      'jenkins': 6, 'github actions': 7, 'terraform': 6,
      
      // Mobile
      'react native': 7, 'flutter': 6, 'ios': 5, 'android': 5
    };
    
    const skillCategories: Record<string, SkillData['category']> = {
      'react': 'frontend', 'vue': 'frontend', 'angular': 'frontend',
      'javascript': 'frontend', 'typescript': 'frontend', 'html': 'frontend',
      'css': 'frontend', 'sass': 'frontend', 'tailwind': 'frontend',
      
      'node.js': 'backend', 'express': 'backend', 'python': 'backend',
      'django': 'backend', 'flask': 'backend', 'java': 'backend',
      
      'mongodb': 'database', 'postgresql': 'database', 'mysql': 'database',
      'redis': 'database', 'elasticsearch': 'database',
      
      'docker': 'devops', 'kubernetes': 'devops', 'aws': 'devops',
      'azure': 'devops', 'gcp': 'devops', 'jenkins': 'devops',
      
      'react native': 'mobile', 'flutter': 'mobile', 'ios': 'mobile', 'android': 'mobile'
    };
    
    return skills.map(skill => {
      const normalizedSkill = skill.toLowerCase().trim();
      return {
        name: skill,
        level: skillLevels[normalizedSkill] || Math.floor(Math.random() * 5) + 5, // Default 5-9
        category: skillCategories[normalizedSkill] || 'other'
      };
    });
  }

  /**
   * Categorize skills by type
   */
  private static categorizeSkills(skills: SkillData[]): Record<string, SkillData[]> {
    const categorized: Record<string, SkillData[]> = {};
    
    skills.forEach(skill => {
      if (!categorized[skill.category]) {
        categorized[skill.category] = [];
      }
      categorized[skill.category].push(skill);
    });
    
    return categorized;
  }

  /**
   * Create skill radar visualization
   */
  private static createSkillRadar(
    categorizedSkills: Record<string, SkillData[]>,
    config: ChartConfig
  ): string {
    let output = '';
    
    // Calculate average skill level per category
    const categoryAverages = Object.entries(categorizedSkills).map(([category, skills]) => {
      const average = skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length;
      return {
        category: category as keyof typeof this.SKILL_CATEGORIES,
        average: Math.round(average * 10) / 10,
        count: skills.length
      };
    }).sort((a, b) => b.average - a.average);
    
    // Create radar chart representation
    output += chalk.bold.cyan('\n🎯 Skill Category Radar\n');
    output += chalk.gray('━'.repeat(40)) + '\n';
    
    categoryAverages.forEach(({ category, average, count }) => {
      const categoryInfo = this.SKILL_CATEGORIES[category];
      const barLength = Math.round((average / 10) * 15);
      const bar = '●'.repeat(barLength) + '○'.repeat(15 - barLength);
      
      output += `${categoryInfo.symbol} ${categoryInfo.name.padEnd(10)} `;
      output += categoryInfo.color(bar);
      output += ` ${average}/10 (${count} skills)\n`;
    });
    
    return output;
  }

  /**
   * Format timeline chart with labels
   */
  private static formatTimelineChart(
    chart: string,
    timelineData: TimelinePoint[],
    config: ChartConfig
  ): string {
    let output = chalk.bold.cyan('\n🕒 Career Timeline\n');
    output += chalk.gray('━'.repeat(50)) + '\n';
    
    // Add the chart
    output += chart + '\n';
    
    // Add timeline labels
    const yearRange = timelineData[timelineData.length - 1].year - timelineData[0].year;
    const startYear = timelineData[0].year;
    const endYear = timelineData[timelineData.length - 1].year;
    
    output += chalk.gray(`${startYear}`.padEnd(20) + `${endYear}`.padStart(20)) + '\n';
    
    // Add company timeline
    output += '\n' + chalk.bold.yellow('📍 Career Milestones:\n');
    const uniqueCompanies = [...new Set(timelineData.map(p => p.company))];
    uniqueCompanies.forEach((company, index) => {
      const companyPoints = timelineData.filter(p => p.company === company);
      const startPoint = companyPoints[0];
      const endPoint = companyPoints[companyPoints.length - 1];
      
      output += `${chalk.cyan('▶')} ${company} (${startPoint.year}`;
      if (endPoint.year !== startPoint.year) {
        output += ` - ${endPoint.year === new Date().getFullYear() ? 'Present' : endPoint.year}`;
      }
      output += ')\n';
    });
    
    return output;
  }

  /**
   * Generate summary statistics
   */
  private static generateSummaryStats(resumeData: ResumeData): string {
    let output = chalk.bold.magenta('📊 Summary Statistics\n');
    output += chalk.gray('━'.repeat(30)) + '\n';
    
    const totalExperience = resumeData.experience.length;
    const totalProjects = resumeData.projects.length;
    const totalSkills = resumeData.techStack.length;
    
    // Calculate years of experience
    let totalYears = 0;
    resumeData.experience.forEach(exp => {
      const dateMatch = exp.dates.match(/(\d{4}).*?(\d{4}|Present)/i);
      if (dateMatch) {
        const startYear = parseInt(dateMatch[1]);
        const endYear = dateMatch[2] === 'Present' ? new Date().getFullYear() : parseInt(dateMatch[2]);
        totalYears += endYear - startYear;
      }
    });
    
    output += `🏢 Companies: ${chalk.cyan(totalExperience)}\n`;
    output += `⏱️  Experience: ${chalk.green(totalYears)} years\n`;
    output += `🚀 Projects: ${chalk.yellow(totalProjects)}\n`;
    output += `🛠️  Skills: ${chalk.blue(totalSkills)}\n`;
    
    return output;
  }
}

// Convenience functions for easy access
export const generateExperienceChart = (experiences: Experience[], config?: Partial<ChartConfig>) =>
  InteractiveChartsManager.generateExperienceTimeline(experiences, config);

export const generateSkillChart = (skills: string[], config?: Partial<ChartConfig>) =>
  InteractiveChartsManager.generateSkillBars(skills, config);

export const generateDashboard = (resumeData: ResumeData, config?: Partial<ChartConfig>) =>
  InteractiveChartsManager.generateDashboard(resumeData, config);

export default InteractiveChartsManager;
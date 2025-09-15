import { ResumeData } from '../../data/types.js';

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

export class ATSScoreCalculator {
  private commonATSKeywords = [
    'experience', 'skills', 'education', 'certification', 'project',
    'leadership', 'management', 'development', 'analysis', 'design',
    'implementation', 'collaboration', 'communication', 'problem-solving'
  ];

  private industryKeywords = {
    'technology': [
      'software', 'programming', 'development', 'coding', 'algorithm',
      'database', 'api', 'framework', 'testing', 'debugging', 'deployment',
      'cloud', 'devops', 'agile', 'scrum', 'git', 'ci/cd'
    ],
    'marketing': [
      'campaign', 'brand', 'digital', 'social media', 'analytics',
      'seo', 'content', 'strategy', 'roi', 'conversion', 'engagement'
    ],
    'finance': [
      'financial', 'accounting', 'budget', 'analysis', 'reporting',
      'compliance', 'audit', 'risk', 'investment', 'portfolio'
    ],
    'healthcare': [
      'patient', 'clinical', 'medical', 'healthcare', 'treatment',
      'diagnosis', 'compliance', 'safety', 'quality', 'research'
    ]
  };

  /**
   * Calculate ATS score for a resume against a job description
   */
  public calculateScore(
    resume: ResumeData,
    jobDescription: JobDescription,
    options: ATSAnalysisOptions = {}
  ): ATSScoreResult {
    const resumeText = this.extractResumeText(resume);
    const jobText = this.extractJobText(jobDescription);
    
    const keywordAnalysis = this.analyzeKeywords(resumeText, jobText, jobDescription.keywords);
    const skillsAnalysis = this.analyzeSkills(resume, jobDescription);
    const experienceAnalysis = this.analyzeExperience(resume, jobDescription, options.experienceLevel);
    const formatAnalysis = options.includeFormatAnalysis ? this.analyzeFormat(resume) : 85;

    const breakdown = {
      keywordMatch: keywordAnalysis.score,
      skillsMatch: skillsAnalysis.score,
      experienceMatch: experienceAnalysis.score,
      formatScore: formatAnalysis
    };

    const overallScore = this.calculateOverallScore(breakdown, options.strictMode);
    const suggestions = this.generateSuggestions(breakdown, keywordAnalysis, skillsAnalysis, experienceAnalysis);
    const recommendations = this.generateRecommendations(breakdown, keywordAnalysis, options);

    return {
      overallScore,
      breakdown,
      suggestions,
      missingKeywords: keywordAnalysis.missing,
      matchedKeywords: keywordAnalysis.matched,
      recommendations
    };
  }

  /**
   * Analyze multiple job descriptions and find the best matches
   */
  public analyzeMultipleJobs(
    resume: ResumeData,
    jobDescriptions: JobDescription[],
    options: ATSAnalysisOptions = {}
  ): Array<ATSScoreResult & { jobTitle: string; company: string }> {
    return jobDescriptions.map(job => ({
      ...this.calculateScore(resume, job, options),
      jobTitle: job.title,
      company: job.company
    })).sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Generate optimization suggestions for improving ATS score
   */
  public generateOptimizationPlan(
    resume: ResumeData,
    jobDescription: JobDescription,
    targetScore: number = 80
  ): {
    currentScore: number;
    targetScore: number;
    actionItems: Array<{
      action: string;
      priority: 'high' | 'medium' | 'low';
      expectedImpact: number;
      category: string;
    }>;
  } {
    const currentResult = this.calculateScore(resume, jobDescription);
    const actionItems = [];

    if (currentResult.breakdown.keywordMatch < 70) {
      actionItems.push({
        action: `Add missing keywords: ${currentResult.missingKeywords.slice(0, 5).join(', ')}`,
        priority: 'high' as const,
        expectedImpact: 15,
        category: 'Keywords'
      });
    }

    if (currentResult.breakdown.skillsMatch < 60) {
      actionItems.push({
        action: 'Highlight relevant technical skills and certifications',
        priority: 'high' as const,
        expectedImpact: 12,
        category: 'Skills'
      });
    }

    if (currentResult.breakdown.experienceMatch < 50) {
      actionItems.push({
        action: 'Quantify achievements and add relevant project details',
        priority: 'medium' as const,
        expectedImpact: 10,
        category: 'Experience'
      });
    }

    if (currentResult.breakdown.formatScore < 80) {
      actionItems.push({
        action: 'Improve resume formatting and structure for ATS compatibility',
        priority: 'medium' as const,
        expectedImpact: 8,
        category: 'Format'
      });
    }

    return {
      currentScore: currentResult.overallScore,
      targetScore,
      actionItems: actionItems.sort((a, b) => b.expectedImpact - a.expectedImpact)
    };
  }

  private extractResumeText(resume: ResumeData): string {
    const sections = [
      resume.personal.name,
      resume.personal.role || '',
      resume.profile || '',
      resume.techStack?.join(' ') || '',
      resume.experience?.map(exp => `${exp.title} ${exp.company} ${exp.bullets.join(' ')}`).join(' ') || '',
      resume.projects?.map(proj => `${proj.name} ${proj.desc} ${proj.tech}`).join(' ') || '',
      resume.education?.map(edu => `${edu.degree} ${edu.school} ${edu.details.join(' ')}`).join(' ') || ''
    ];
    
    return sections.join(' ').toLowerCase();
  }

  private extractJobText(job: JobDescription): string {
    return `${job.title} ${job.description} ${job.requirements.join(' ')} ${job.preferredSkills.join(' ')}`.toLowerCase();
  }

  private analyzeKeywords(resumeText: string, jobText: string, jobKeywords: string[]): {
    score: number;
    matched: string[];
    missing: string[];
  } {
    const allKeywords = [...jobKeywords, ...this.commonATSKeywords];
    const matched: string[] = [];
    const missing: string[] = [];

    allKeywords.forEach(keyword => {
      if (resumeText.includes(keyword.toLowerCase())) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const score = allKeywords.length > 0 ? (matched.length / allKeywords.length) * 100 : 0;
    return { score, matched, missing };
  }

  private analyzeSkills(resume: ResumeData, job: JobDescription): { score: number } {
    const resumeSkills = (resume.techStack || []).map(skill => skill.toLowerCase());
    const jobSkills = [...job.requirements, ...job.preferredSkills].map(skill => skill.toLowerCase());
    
    const matchedSkills = resumeSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
    );

    const score = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0;
    return { score: Math.min(score, 100) };
  }

  private analyzeExperience(resume: ResumeData, job: JobDescription, level?: string): { score: number } {
    const experienceYears = this.calculateExperienceYears(resume);
    const hasRelevantExperience = this.hasRelevantExperience(resume, job);
    
    let baseScore = hasRelevantExperience ? 70 : 30;
    
    // Adjust based on experience level
    if (level) {
      const expectedYears = this.getExpectedYears(level);
      const yearsDiff = Math.abs(experienceYears - expectedYears);
      const yearsPenalty = Math.min(yearsDiff * 5, 30);
      baseScore = Math.max(baseScore - yearsPenalty, 0);
    }

    return { score: Math.min(baseScore, 100) };
  }

  private analyzeFormat(resume: ResumeData): number {
    let score = 100;
    
    // Check for essential sections
    if (!resume.personal.name) score -= 10;
    if (!resume.personal.email) score -= 10;
    if (!resume.experience || resume.experience.length === 0) score -= 20;
    if (!resume.techStack || resume.techStack.length === 0) score -= 15;
    if (!resume.education || resume.education.length === 0) score -= 10;
    
    return Math.max(score, 0);
  }

  private calculateOverallScore(breakdown: ATSScoreResult['breakdown'], strictMode?: boolean): number {
    const weights = strictMode 
      ? { keywordMatch: 0.4, skillsMatch: 0.3, experienceMatch: 0.2, formatScore: 0.1 }
      : { keywordMatch: 0.3, skillsMatch: 0.25, experienceMatch: 0.25, formatScore: 0.2 };

    return Math.round(
      breakdown.keywordMatch * weights.keywordMatch +
      breakdown.skillsMatch * weights.skillsMatch +
      breakdown.experienceMatch * weights.experienceMatch +
      breakdown.formatScore * weights.formatScore
    );
  }

  private generateSuggestions(breakdown: ATSScoreResult['breakdown'], keywordAnalysis: any, skillsAnalysis: any, experienceAnalysis: any): string[] {
    const suggestions: string[] = [];

    if (breakdown.keywordMatch < 60) {
      suggestions.push('Include more relevant keywords from the job description');
    }
    if (breakdown.skillsMatch < 50) {
      suggestions.push('Highlight technical skills that match job requirements');
    }
    if (breakdown.experienceMatch < 40) {
      suggestions.push('Add more relevant work experience or projects');
    }
    if (breakdown.formatScore < 70) {
      suggestions.push('Improve resume formatting for better ATS compatibility');
    }

    return suggestions;
  }

  private generateRecommendations(breakdown: ATSScoreResult['breakdown'], keywordAnalysis: any, options: ATSAnalysisOptions): ATSScoreResult['recommendations'] {
    const recommendations: ATSScoreResult['recommendations'] = [];

    if (keywordAnalysis.missing.length > 0) {
      recommendations.push({
        category: 'Keywords',
        suggestion: `Add these missing keywords: ${keywordAnalysis.missing.slice(0, 3).join(', ')}`,
        impact: 'high'
      });
    }

    if (breakdown.skillsMatch < 60) {
      recommendations.push({
        category: 'Skills',
        suggestion: 'Create a dedicated skills section with relevant technologies',
        impact: 'high'
      });
    }

    if (breakdown.formatScore < 80) {
      recommendations.push({
        category: 'Format',
        suggestion: 'Use standard section headings and bullet points for better parsing',
        impact: 'medium'
      });
    }

    return recommendations;
  }

  private calculateExperienceYears(resume: ResumeData): number {
    if (!resume.experience || resume.experience.length === 0) return 0;
    
    // Since dates are strings, we'll estimate based on number of positions
    // Each position is estimated as 2 years average
    const estimatedYears = resume.experience.length * 2;
    
    return estimatedYears;
  }

  private hasRelevantExperience(resume: ResumeData, job: JobDescription): boolean {
    if (!resume.experience) return false;
    
    const jobKeywords = job.keywords.map(k => k.toLowerCase());
    return resume.experience.some(exp => 
      jobKeywords.some(keyword => 
        exp.title.toLowerCase().includes(keyword) ||
        exp.bullets.some(bullet => bullet.toLowerCase().includes(keyword))
      )
    );
  }

  private getExpectedYears(level: string): number {
    switch (level) {
      case 'entry': return 1;
      case 'mid': return 4;
      case 'senior': return 8;
      case 'executive': return 15;
      default: return 3;
    }
  }

  /**
   * Export ATS analysis results to different formats
   */
  public exportAnalysis(result: ATSScoreResult, format: 'json' | 'text' | 'html' = 'json'): string {
    switch (format) {
      case 'text':
        return this.exportToText(result);
      case 'html':
        return this.exportToHTML(result);
      default:
        return JSON.stringify(result, null, 2);
    }
  }

  private exportToText(result: ATSScoreResult): string {
    return `
ATS Score Analysis Report
========================

Overall Score: ${result.overallScore}/100

Breakdown:
- Keyword Match: ${result.breakdown.keywordMatch}/100
- Skills Match: ${result.breakdown.skillsMatch}/100
- Experience Match: ${result.breakdown.experienceMatch}/100
- Format Score: ${result.breakdown.formatScore}/100

Matched Keywords: ${result.matchedKeywords.join(', ')}
Missing Keywords: ${result.missingKeywords.join(', ')}

Suggestions:
${result.suggestions.map(s => `- ${s}`).join('\n')}

Recommendations:
${result.recommendations.map(r => `- [${r.impact.toUpperCase()}] ${r.category}: ${r.suggestion}`).join('\n')}
`;
  }

  private exportToHTML(result: ATSScoreResult): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>ATS Score Analysis</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .score { font-size: 24px; font-weight: bold; color: ${result.overallScore >= 70 ? '#28a745' : result.overallScore >= 50 ? '#ffc107' : '#dc3545'}; }
        .breakdown { margin: 20px 0; }
        .recommendation { margin: 10px 0; padding: 10px; border-left: 4px solid #007bff; background: #f8f9fa; }
        .high { border-left-color: #dc3545; }
        .medium { border-left-color: #ffc107; }
        .low { border-left-color: #28a745; }
    </style>
</head>
<body>
    <h1>ATS Score Analysis Report</h1>
    <div class="score">Overall Score: ${result.overallScore}/100</div>
    
    <div class="breakdown">
        <h3>Score Breakdown</h3>
        <ul>
            <li>Keyword Match: ${result.breakdown.keywordMatch}/100</li>
            <li>Skills Match: ${result.breakdown.skillsMatch}/100</li>
            <li>Experience Match: ${result.breakdown.experienceMatch}/100</li>
            <li>Format Score: ${result.breakdown.formatScore}/100</li>
        </ul>
    </div>
    
    <h3>Recommendations</h3>
    ${result.recommendations.map(r => `
        <div class="recommendation ${r.impact}">
            <strong>${r.category}</strong>: ${r.suggestion}
        </div>
    `).join('')}
</body>
</html>
`;
  }
}
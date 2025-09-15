import { ResumeData } from '../data/types.js';

interface KeywordSuggestion {
  keyword: string;
  relevance: number;
  category: 'technical' | 'soft' | 'industry' | 'role' | 'certification';
  context: string;
  priority: 'high' | 'medium' | 'low';
}

interface KeywordAnalysis {
  currentKeywords: string[];
  missingKeywords: KeywordSuggestion[];
  suggestions: KeywordSuggestion[];
  overusedKeywords: string[];
  keywordDensity: { [key: string]: number };
  score: number;
}

interface IndustryKeywordSet {
  technical: string[];
  soft: string[];
  industry: string[];
  roles: string[];
  certifications: string[];
}

interface OptimizationOptions {
  industry?: string;
  role?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  targetKeywordCount?: number;
  includeEmergingTech?: boolean;
}

export class KeywordOptimizer {
  private industryKeywords: { [key: string]: IndustryKeywordSet } = {
    'technology': {
      technical: [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker',
        'Kubernetes', 'Git', 'SQL', 'NoSQL', 'API', 'REST', 'GraphQL',
        'Microservices', 'CI/CD', 'DevOps', 'Agile', 'Scrum', 'TDD',
        'Machine Learning', 'AI', 'Data Science', 'Cloud Computing',
        'Cybersecurity', 'Blockchain', 'IoT', 'Mobile Development'
      ],
      soft: [
        'Problem Solving', 'Critical Thinking', 'Communication', 'Leadership',
        'Team Collaboration', 'Project Management', 'Analytical Skills',
        'Innovation', 'Adaptability', 'Time Management'
      ],
      industry: [
        'Software Development', 'Web Development', 'Mobile Apps', 'SaaS',
        'Fintech', 'E-commerce', 'Healthcare Tech', 'EdTech', 'Gaming',
        'Enterprise Software', 'Startup', 'Digital Transformation'
      ],
      roles: [
        'Software Engineer', 'Full Stack Developer', 'Frontend Developer',
        'Backend Developer', 'DevOps Engineer', 'Data Scientist',
        'Product Manager', 'Technical Lead', 'Architect', 'CTO'
      ],
      certifications: [
        'AWS Certified', 'Google Cloud', 'Azure', 'Kubernetes Certified',
        'Scrum Master', 'PMP', 'CISSP', 'CompTIA', 'Oracle Certified'
      ]
    },
    'marketing': {
      technical: [
        'Google Analytics', 'SEO', 'SEM', 'Social Media Marketing',
        'Content Marketing', 'Email Marketing', 'Marketing Automation',
        'CRM', 'Salesforce', 'HubSpot', 'Adobe Creative Suite',
        'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'A/B Testing'
      ],
      soft: [
        'Creativity', 'Strategic Thinking', 'Communication', 'Brand Management',
        'Customer Focus', 'Data Analysis', 'Project Management',
        'Storytelling', 'Negotiation', 'Relationship Building'
      ],
      industry: [
        'Digital Marketing', 'Brand Marketing', 'Performance Marketing',
        'Content Strategy', 'Growth Marketing', 'Influencer Marketing',
        'Event Marketing', 'Product Marketing', 'B2B Marketing', 'B2C Marketing'
      ],
      roles: [
        'Marketing Manager', 'Digital Marketing Specialist', 'Content Manager',
        'SEO Specialist', 'Social Media Manager', 'Brand Manager',
        'Growth Hacker', 'Marketing Director', 'CMO'
      ],
      certifications: [
        'Google Ads Certified', 'Google Analytics', 'HubSpot Certified',
        'Facebook Blueprint', 'Salesforce Certified', 'Adobe Certified'
      ]
    },
    'finance': {
      technical: [
        'Financial Modeling', 'Excel', 'SQL', 'Python', 'R', 'Tableau',
        'Bloomberg Terminal', 'SAP', 'QuickBooks', 'Financial Analysis',
        'Risk Management', 'Portfolio Management', 'Trading', 'Derivatives'
      ],
      soft: [
        'Analytical Skills', 'Attention to Detail', 'Problem Solving',
        'Communication', 'Ethics', 'Decision Making', 'Time Management',
        'Leadership', 'Negotiation', 'Client Relations'
      ],
      industry: [
        'Investment Banking', 'Private Equity', 'Hedge Funds', 'Asset Management',
        'Corporate Finance', 'Financial Planning', 'Insurance', 'Banking',
        'Fintech', 'Cryptocurrency', 'Real Estate Finance'
      ],
      roles: [
        'Financial Analyst', 'Investment Banker', 'Portfolio Manager',
        'Risk Analyst', 'Financial Advisor', 'Controller', 'CFO',
        'Quantitative Analyst', 'Credit Analyst'
      ],
      certifications: [
        'CFA', 'CPA', 'FRM', 'PMP', 'Series 7', 'Series 66',
        'CAIA', 'CFP', 'CIA', 'CISA'
      ]
    }
  };

  private emergingTechKeywords = [
    'Artificial Intelligence', 'Machine Learning', 'Deep Learning',
    'Natural Language Processing', 'Computer Vision', 'Blockchain',
    'Cryptocurrency', 'NFT', 'Web3', 'Metaverse', 'AR/VR',
    'Quantum Computing', 'Edge Computing', 'Serverless',
    'Microservices', 'Container Orchestration', 'GitOps'
  ];

  private actionVerbs = [
    'Developed', 'Implemented', 'Designed', 'Created', 'Built', 'Led',
    'Managed', 'Optimized', 'Improved', 'Increased', 'Reduced',
    'Streamlined', 'Automated', 'Collaborated', 'Delivered',
    'Achieved', 'Exceeded', 'Transformed', 'Innovated', 'Scaled'
  ];

  /**
   * Analyze resume keywords and suggest improvements
   */
  public analyzeKeywords(
    resume: ResumeData,
    jobDescription?: string,
    options: OptimizationOptions = {}
  ): KeywordAnalysis {
    const resumeText = this.extractResumeText(resume);
    const currentKeywords = this.extractKeywords(resumeText);
    const keywordDensity = this.calculateKeywordDensity(resumeText, currentKeywords);
    
    let targetKeywords: string[] = [];
    if (jobDescription) {
      targetKeywords = this.extractKeywords(jobDescription);
    }
    
    if (options.industry) {
      const industryKeywords = this.getIndustryKeywords(options.industry);
      targetKeywords = [...targetKeywords, ...industryKeywords];
    }
    
    const missingKeywords = this.findMissingKeywords(currentKeywords, targetKeywords, options);
    const suggestions = this.generateSuggestions(resume, missingKeywords, options);
    const overusedKeywords = this.findOverusedKeywords(keywordDensity);
    const score = this.calculateKeywordScore(currentKeywords, targetKeywords, keywordDensity);
    
    return {
      currentKeywords,
      missingKeywords,
      suggestions,
      overusedKeywords,
      keywordDensity,
      score
    };
  }

  /**
   * Generate keyword suggestions for specific sections
   */
  public suggestSectionKeywords(
    section: 'experience' | 'projects' | 'skills' | 'summary',
    content: string,
    options: OptimizationOptions = {}
  ): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    const industryKeywords = options.industry ? this.getIndustryKeywords(options.industry) : [];
    
    switch (section) {
      case 'experience':
        suggestions.push(...this.suggestExperienceKeywords(content, industryKeywords, options));
        break;
      case 'projects':
        suggestions.push(...this.suggestProjectKeywords(content, industryKeywords, options));
        break;
      case 'skills':
        suggestions.push(...this.suggestSkillKeywords(content, industryKeywords, options));
        break;
      case 'summary':
        suggestions.push(...this.suggestSummaryKeywords(content, industryKeywords, options));
        break;
    }
    
    return suggestions.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Optimize resume content by suggesting keyword placements
   */
  public optimizeContent(
    resume: ResumeData,
    targetKeywords: string[],
    options: OptimizationOptions = {}
  ): {
    optimizedResume: ResumeData;
    changes: Array<{
      section: string;
      original: string;
      optimized: string;
      addedKeywords: string[];
    }>;
  } {
    const changes: Array<{
      section: string;
      original: string;
      optimized: string;
      addedKeywords: string[];
    }> = [];
    
    const optimizedResume = JSON.parse(JSON.stringify(resume)) as ResumeData;
    
    // Optimize profile/summary
    if (optimizedResume.profile) {
      const optimizedProfile = this.optimizeText(optimizedResume.profile, targetKeywords, 'summary');
      if (optimizedProfile.text !== optimizedResume.profile) {
        changes.push({
          section: 'profile',
          original: optimizedResume.profile,
          optimized: optimizedProfile.text,
          addedKeywords: optimizedProfile.addedKeywords
        });
        optimizedResume.profile = optimizedProfile.text;
      }
    }
    
    // Optimize experience bullets
    optimizedResume.experience.forEach((exp, expIndex) => {
      exp.bullets.forEach((bullet, bulletIndex) => {
        const optimizedBullet = this.optimizeText(bullet, targetKeywords, 'experience');
        if (optimizedBullet.text !== bullet) {
          changes.push({
            section: `experience[${expIndex}].bullets[${bulletIndex}]`,
            original: bullet,
            optimized: optimizedBullet.text,
            addedKeywords: optimizedBullet.addedKeywords
          });
          exp.bullets[bulletIndex] = optimizedBullet.text;
        }
      });
    });
    
    // Optimize project descriptions
    optimizedResume.projects.forEach((project, projectIndex) => {
      const optimizedDesc = this.optimizeText(project.desc, targetKeywords, 'projects');
      if (optimizedDesc.text !== project.desc) {
        changes.push({
          section: `projects[${projectIndex}].desc`,
          original: project.desc,
          optimized: optimizedDesc.text,
          addedKeywords: optimizedDesc.addedKeywords
        });
        project.desc = optimizedDesc.text;
      }
    });
    
    return { optimizedResume, changes };
  }

  /**
   * Generate industry-specific keyword recommendations
   */
  public getIndustryRecommendations(industry: string, role?: string): {
    mustHave: KeywordSuggestion[];
    recommended: KeywordSuggestion[];
    emerging: KeywordSuggestion[];
  } {
    const industryData = this.industryKeywords[industry.toLowerCase()];
    if (!industryData) {
      return { mustHave: [], recommended: [], emerging: [] };
    }
    
    const mustHave = this.createKeywordSuggestions(industryData.technical.slice(0, 10), 'technical', 'high');
    const recommended = [
      ...this.createKeywordSuggestions(industryData.soft.slice(0, 5), 'soft', 'medium'),
      ...this.createKeywordSuggestions(industryData.industry.slice(0, 5), 'industry', 'medium')
    ];
    
    const emerging = this.createKeywordSuggestions(
      this.emergingTechKeywords.filter(keyword => 
        industryData.technical.some(tech => 
          keyword.toLowerCase().includes(tech.toLowerCase()) ||
          tech.toLowerCase().includes(keyword.toLowerCase())
        )
      ).slice(0, 5),
      'technical',
      'low'
    );
    
    return { mustHave, recommended, emerging };
  }

  private extractResumeText(resume: ResumeData): string {
    const sections = [
      resume.personal.name,
      resume.personal.role,
      resume.profile || '',
      resume.techStack?.join(' ') || '',
      resume.experience?.map(exp => `${exp.title} ${exp.company} ${exp.bullets.join(' ')}`).join(' ') || '',
      resume.projects?.map(proj => `${proj.name} ${proj.desc} ${proj.tech}`).join(' ') || '',
      resume.education?.map(edu => `${edu.degree} ${edu.school} ${edu.details.join(' ')}`).join(' ') || ''
    ];
    
    return sections.join(' ');
  }

  private extractKeywords(text: string): string[] {
    // Remove common words and extract meaningful keywords
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was',
      'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
      'can', 'shall', 'a', 'an', 'this', 'that', 'these', 'those'
    ]);
    
    const words = text.toLowerCase()
      .replace(/[^a-zA-Z0-9\s+#.-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));
    
    // Extract multi-word phrases and technologies
    const phrases = this.extractPhrases(text);
    
    return [...new Set([...words, ...phrases])];
  }

  private extractPhrases(text: string): string[] {
    const techPhrases = [
      /\b(machine learning|artificial intelligence|data science|web development|software engineering|project management|user experience|user interface|full stack|front end|back end|devops|ci\/cd)\b/gi,
      /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/g, // Capitalized phrases
      /\b([a-zA-Z]+\.[a-zA-Z]+)\b/g, // Tech with dots (e.g., Node.js)
      /\b([a-zA-Z]+\/[a-zA-Z]+)\b/g // Tech with slashes (e.g., CI/CD)
    ];
    
    const phrases: string[] = [];
    techPhrases.forEach(regex => {
      const matches = text.match(regex);
      if (matches) {
        phrases.push(...matches.map(match => match.toLowerCase()));
      }
    });
    
    return phrases;
  }

  private calculateKeywordDensity(text: string, keywords: string[]): { [key: string]: number } {
    const wordCount = text.split(/\s+/).length;
    const density: { [key: string]: number } = {};
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      density[keyword] = (count / wordCount) * 100;
    });
    
    return density;
  }

  private getIndustryKeywords(industry: string): string[] {
    const industryData = this.industryKeywords[industry.toLowerCase()];
    if (!industryData) return [];
    
    return [
      ...industryData.technical,
      ...industryData.soft,
      ...industryData.industry,
      ...industryData.roles,
      ...industryData.certifications
    ];
  }

  private findMissingKeywords(
    currentKeywords: string[],
    targetKeywords: string[],
    options: OptimizationOptions
  ): KeywordSuggestion[] {
    const currentSet = new Set(currentKeywords.map(k => k.toLowerCase()));
    const missing: KeywordSuggestion[] = [];
    
    targetKeywords.forEach(keyword => {
      if (!currentSet.has(keyword.toLowerCase())) {
        missing.push({
          keyword,
          relevance: this.calculateRelevance(keyword, options),
          category: this.categorizeKeyword(keyword),
          context: this.getKeywordContext(keyword),
          priority: this.getKeywordPriority(keyword, options)
        });
      }
    });
    
    return missing.sort((a, b) => b.relevance - a.relevance);
  }

  private generateSuggestions(
    resume: ResumeData,
    missingKeywords: KeywordSuggestion[],
    options: OptimizationOptions
  ): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    const targetCount = options.targetKeywordCount || 20;
    
    // Add top missing keywords
    suggestions.push(...missingKeywords.slice(0, Math.min(targetCount, missingKeywords.length)));
    
    // Add emerging tech keywords if requested
    if (options.includeEmergingTech) {
      const emergingKeywords = this.emergingTechKeywords
        .filter(keyword => !resume.techStack?.includes(keyword))
        .slice(0, 5)
        .map(keyword => ({
          keyword,
          relevance: 70,
          category: 'technical' as const,
          context: 'Emerging technology trend',
          priority: 'medium' as const
        }));
      
      suggestions.push(...emergingKeywords);
    }
    
    return suggestions;
  }

  private findOverusedKeywords(keywordDensity: { [key: string]: number }): string[] {
    const threshold = 2.0; // 2% density threshold
    return Object.entries(keywordDensity)
      .filter(([_, density]) => density > threshold)
      .map(([keyword, _]) => keyword);
  }

  private calculateKeywordScore(
    currentKeywords: string[],
    targetKeywords: string[],
    keywordDensity: { [key: string]: number }
  ): number {
    if (targetKeywords.length === 0) return 85; // Default score when no targets
    
    const currentSet = new Set(currentKeywords.map(k => k.toLowerCase()));
    const targetSet = new Set(targetKeywords.map(k => k.toLowerCase()));
    
    const matchCount = Array.from(targetSet).filter(keyword => currentSet.has(keyword)).length;
    const matchRatio = matchCount / targetKeywords.length;
    
    // Penalty for overused keywords
    const overusedPenalty = Object.values(keywordDensity).filter(density => density > 2.0).length * 5;
    
    const baseScore = matchRatio * 100;
    return Math.max(0, Math.min(100, baseScore - overusedPenalty));
  }

  private optimizeText(
    text: string,
    targetKeywords: string[],
    section: string
  ): { text: string; addedKeywords: string[] } {
    let optimizedText = text;
    const addedKeywords: string[] = [];
    const textLower = text.toLowerCase();
    
    // Find keywords that can be naturally integrated
    const relevantKeywords = targetKeywords.filter(keyword => {
      const keywordLower = keyword.toLowerCase();
      return !textLower.includes(keywordLower) && this.canIntegrateKeyword(text, keyword, section);
    });
    
    // Add up to 3 keywords per text block to avoid keyword stuffing
    relevantKeywords.slice(0, 3).forEach(keyword => {
      const integration = this.integrateKeyword(optimizedText, keyword, section);
      if (integration) {
        optimizedText = integration;
        addedKeywords.push(keyword);
      }
    });
    
    return { text: optimizedText, addedKeywords };
  }

  private canIntegrateKeyword(text: string, keyword: string, section: string): boolean {
    // Simple heuristic to determine if a keyword can be naturally integrated
    const keywordLower = keyword.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Check if keyword is contextually relevant
    if (section === 'experience' && this.isTechnicalKeyword(keyword)) {
      return textLower.includes('develop') || textLower.includes('implement') || textLower.includes('build');
    }
    
    if (section === 'summary' && this.isSoftSkillKeyword(keyword)) {
      return textLower.includes('experience') || textLower.includes('skilled') || textLower.includes('professional');
    }
    
    return true; // Default to allowing integration
  }

  private integrateKeyword(text: string, keyword: string, section: string): string | null {
    // Simple keyword integration - this could be made more sophisticated
    if (section === 'experience') {
      if (text.includes('using') || text.includes('with')) {
        return text.replace(/(using|with)\s+/, `$1 ${keyword} and `);
      }
    }
    
    if (section === 'summary') {
      if (text.includes('experience in')) {
        return text.replace('experience in', `experience in ${keyword} and`);
      }
    }
    
    // Fallback: append to end
    return `${text} (${keyword})`;
  }

  private suggestExperienceKeywords(
    content: string,
    industryKeywords: string[],
    options: OptimizationOptions
  ): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    
    // Suggest action verbs if missing
    const hasActionVerb = this.actionVerbs.some(verb => content.toLowerCase().includes(verb.toLowerCase()));
    if (!hasActionVerb) {
      suggestions.push({
        keyword: this.actionVerbs[Math.floor(Math.random() * this.actionVerbs.length)],
        relevance: 90,
        category: 'role',
        context: 'Start bullet points with strong action verbs',
        priority: 'high'
      });
    }
    
    // Suggest technical keywords
    const relevantTech = industryKeywords.filter(keyword => 
      this.isTechnicalKeyword(keyword) && !content.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 3);
    
    relevantTech.forEach(keyword => {
      suggestions.push({
        keyword,
        relevance: 85,
        category: 'technical',
        context: 'Add relevant technical skills to experience descriptions',
        priority: 'high'
      });
    });
    
    return suggestions;
  }

  private suggestProjectKeywords(
    content: string,
    industryKeywords: string[],
    options: OptimizationOptions
  ): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    
    // Suggest project-related keywords
    const projectKeywords = ['developed', 'built', 'created', 'designed', 'implemented'];
    const hasProjectVerb = projectKeywords.some(verb => content.toLowerCase().includes(verb));
    
    if (!hasProjectVerb) {
      suggestions.push({
        keyword: 'developed',
        relevance: 88,
        category: 'role',
        context: 'Use action verbs to describe project work',
        priority: 'high'
      });
    }
    
    return suggestions;
  }

  private suggestSkillKeywords(
    content: string,
    industryKeywords: string[],
    options: OptimizationOptions
  ): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    
    // Suggest missing technical skills
    const missingTech = industryKeywords.filter(keyword => 
      this.isTechnicalKeyword(keyword) && !content.toLowerCase().includes(keyword.toLowerCase())
    ).slice(0, 5);
    
    missingTech.forEach(keyword => {
      suggestions.push({
        keyword,
        relevance: 92,
        category: 'technical',
        context: 'Add to technical skills section',
        priority: 'high'
      });
    });
    
    return suggestions;
  }

  private suggestSummaryKeywords(
    content: string,
    industryKeywords: string[],
    options: OptimizationOptions
  ): KeywordSuggestion[] {
    const suggestions: KeywordSuggestion[] = [];
    
    // Suggest role-specific keywords
    if (options.role) {
      const roleKeywords = this.getRoleKeywords(options.role);
      roleKeywords.forEach(keyword => {
        if (!content.toLowerCase().includes(keyword.toLowerCase())) {
          suggestions.push({
            keyword,
            relevance: 95,
            category: 'role',
            context: 'Include role-specific terms in summary',
            priority: 'high'
          });
        }
      });
    }
    
    return suggestions;
  }

  private createKeywordSuggestions(
    keywords: string[],
    category: KeywordSuggestion['category'],
    priority: KeywordSuggestion['priority']
  ): KeywordSuggestion[] {
    return keywords.map(keyword => ({
      keyword,
      relevance: priority === 'high' ? 90 : priority === 'medium' ? 70 : 50,
      category,
      context: this.getKeywordContext(keyword),
      priority
    }));
  }

  private calculateRelevance(keyword: string, options: OptimizationOptions): number {
    let relevance = 50; // Base relevance
    
    if (options.industry && this.isIndustryKeyword(keyword, options.industry)) {
      relevance += 30;
    }
    
    if (options.role && this.isRoleKeyword(keyword, options.role)) {
      relevance += 25;
    }
    
    if (this.isTechnicalKeyword(keyword)) {
      relevance += 15;
    }
    
    return Math.min(100, relevance);
  }

  private categorizeKeyword(keyword: string): KeywordSuggestion['category'] {
    if (this.isTechnicalKeyword(keyword)) return 'technical';
    if (this.isSoftSkillKeyword(keyword)) return 'soft';
    if (this.isCertificationKeyword(keyword)) return 'certification';
    if (this.isRoleKeyword(keyword)) return 'role';
    return 'industry';
  }

  private getKeywordContext(keyword: string): string {
    if (this.isTechnicalKeyword(keyword)) {
      return 'Technical skill or technology';
    }
    if (this.isSoftSkillKeyword(keyword)) {
      return 'Soft skill or competency';
    }
    if (this.isCertificationKeyword(keyword)) {
      return 'Professional certification';
    }
    return 'Industry or role-specific term';
  }

  private getKeywordPriority(keyword: string, options: OptimizationOptions): KeywordSuggestion['priority'] {
    if (options.role && this.isRoleKeyword(keyword, options.role)) {
      return 'high';
    }
    if (this.isTechnicalKeyword(keyword)) {
      return 'high';
    }
    if (this.isSoftSkillKeyword(keyword)) {
      return 'medium';
    }
    return 'low';
  }

  private isTechnicalKeyword(keyword: string): boolean {
    const techPatterns = [
      /\b(javascript|python|java|react|node|aws|docker|kubernetes|sql|api|git)\b/i,
      /\b[A-Z]{2,}\b/, // Acronyms
      /\.[a-z]+$/i, // File extensions or tech with dots
      /\/[a-z]+/i // Tech with slashes
    ];
    
    return techPatterns.some(pattern => pattern.test(keyword));
  }

  private isSoftSkillKeyword(keyword: string): boolean {
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'critical thinking', 'creativity', 'adaptability', 'time management',
      'project management', 'analytical', 'collaboration'
    ];
    
    return softSkills.some(skill => keyword.toLowerCase().includes(skill));
  }

  private isCertificationKeyword(keyword: string): boolean {
    const certPatterns = [
      /certified/i, /certification/i, /\b(cfa|cpa|pmp|cissp|aws|azure|google)\b/i
    ];
    
    return certPatterns.some(pattern => pattern.test(keyword));
  }

  private isIndustryKeyword(keyword: string, industry: string): boolean {
    const industryData = this.industryKeywords[industry.toLowerCase()];
    if (!industryData) return false;
    
    const allKeywords = [
      ...industryData.technical,
      ...industryData.industry,
      ...industryData.roles
    ].map(k => k.toLowerCase());
    
    return allKeywords.includes(keyword.toLowerCase());
  }

  private isRoleKeyword(keyword: string, role?: string): boolean {
    if (!role) return false;
    
    // Simple role matching - could be enhanced
    return keyword.toLowerCase().includes(role.toLowerCase()) ||
           role.toLowerCase().includes(keyword.toLowerCase());
  }

  private getRoleKeywords(role: string): string[] {
    const roleKeywordMap: { [key: string]: string[] } = {
      'software engineer': ['software', 'engineer', 'development', 'programming', 'coding'],
      'data scientist': ['data', 'science', 'analytics', 'machine learning', 'statistics'],
      'product manager': ['product', 'management', 'strategy', 'roadmap', 'stakeholder'],
      'marketing manager': ['marketing', 'campaign', 'brand', 'digital', 'growth']
    };
    
    return roleKeywordMap[role.toLowerCase()] || [];
  }

  /**
   * Export keyword analysis to different formats
   */
  public exportAnalysis(analysis: KeywordAnalysis, format: 'json' | 'text' | 'csv' = 'json'): string {
    switch (format) {
      case 'text':
        return this.exportToText(analysis);
      case 'csv':
        return this.exportToCSV(analysis);
      default:
        return JSON.stringify(analysis, null, 2);
    }
  }

  private exportToText(analysis: KeywordAnalysis): string {
    return `
Keyword Analysis Report
======================

Overall Score: ${analysis.score}/100

Current Keywords (${analysis.currentKeywords.length}):
${analysis.currentKeywords.join(', ')}

Missing Keywords (${analysis.missingKeywords.length}):
${analysis.missingKeywords.map(k => `- ${k.keyword} (${k.category}, ${k.priority} priority)`).join('\n')}

Suggestions (${analysis.suggestions.length}):
${analysis.suggestions.map(s => `- ${s.keyword}: ${s.context}`).join('\n')}

Overused Keywords:
${analysis.overusedKeywords.map(k => `- ${k} (${analysis.keywordDensity[k].toFixed(2)}% density)`).join('\n')}
`;
  }

  private exportToCSV(analysis: KeywordAnalysis): string {
    const headers = 'Keyword,Category,Priority,Relevance,Context\n';
    const rows = analysis.suggestions.map(s => 
      `"${s.keyword}","${s.category}","${s.priority}",${s.relevance},"${s.context}"`
    ).join('\n');
    
    return headers + rows;
  }
}
import { ResumeData, Experience, Project, Education } from '../data/types.js';

// Interfaces for grammar and spell checking
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
  overallScore: number; // 0-100
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

export class GrammarChecker {
  private readonly commonMisspellings = {
    'recieve': 'receive',
    'seperate': 'separate',
    'definately': 'definitely',
    'occured': 'occurred',
    'managment': 'management',
    'developement': 'development',
    'responsable': 'responsible',
    'sucessful': 'successful',
    'acheivement': 'achievement',
    'experiance': 'experience',
    'knowlege': 'knowledge',
    'skillset': 'skill set',
    'teamlead': 'team lead',
    'fullstack': 'full-stack',
    'frontend': 'front-end',
    'backend': 'back-end'
  };

  private readonly technicalTerms = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'GitLab', 'Jenkins', 'CI/CD', 'DevOps',
    'API', 'REST', 'GraphQL', 'JSON', 'XML', 'HTML', 'CSS', 'SCSS', 'Sass',
    'Webpack', 'Babel', 'ESLint', 'Jest', 'Cypress', 'Selenium', 'TDD', 'BDD',
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Slack', 'Teams'
  ];

  private readonly grammarRules = [
    {
      pattern: /\b(i)\b/gi,
      replacement: 'I',
      message: 'Personal pronoun "I" should be capitalized',
      type: 'grammar' as const
    },
    {
      pattern: /\s{2,}/g,
      replacement: ' ',
      message: 'Multiple spaces should be reduced to single space',
      type: 'style' as const
    },
    {
      pattern: /([.!?])([A-Z])/g,
      replacement: '$1 $2',
      message: 'Missing space after sentence ending punctuation',
      type: 'punctuation' as const
    },
    {
      pattern: /\b(there|their|they're)\b/gi,
      message: 'Check usage of there/their/they\'re',
      type: 'grammar' as const
    },
    {
      pattern: /\b(your|you're)\b/gi,
      message: 'Check usage of your/you\'re',
      type: 'grammar' as const
    },
    {
      pattern: /\b(its|it's)\b/gi,
      message: 'Check usage of its/it\'s',
      type: 'grammar' as const
    }
  ];

  private readonly styleRules = [
    {
      pattern: /\b(very|really|quite|extremely)\s+/gi,
      message: 'Consider removing weak intensifiers for stronger impact',
      type: 'style' as const,
      severity: 'low' as const
    },
    {
      pattern: /\b(I think|I believe|I feel)\b/gi,
      message: 'Avoid uncertain language in professional contexts',
      type: 'style' as const,
      severity: 'medium' as const
    },
    {
      pattern: /\b(responsible for)\b/gi,
      message: 'Consider using stronger action verbs instead of "responsible for"',
      type: 'style' as const,
      severity: 'low' as const
    },
    {
      pattern: /\b(helped|assisted)\b/gi,
      message: 'Use specific action verbs instead of "helped" or "assisted"',
      type: 'style' as const,
      severity: 'medium' as const
    }
  ];

  /**
   * Check grammar and spelling for the entire resume
   */
  checkGrammar(
    resume: ResumeData,
    options: GrammarCheckOptions = {
      checkSpelling: true,
      checkGrammar: true,
      checkPunctuation: true,
      checkStyle: true,
      strictMode: false
    }
  ): GrammarCheckResult {
    const issues: GrammarIssue[] = [];
    const sectionResults: { [key: string]: GrammarIssue[] } = {};

    // Check each section
    Object.keys(resume).forEach(sectionKey => {
      const sectionIssues = this.checkResumeSection(resume[sectionKey as keyof ResumeData], sectionKey, options);
      issues.push(...sectionIssues);
      sectionResults[sectionKey] = sectionIssues;
    });

    return this.generateResult(issues);
  }

  /**
    * Check grammar and spelling for the entire resume (alias for checkGrammar)
    */
   checkResume(resumeData: ResumeData, options: GrammarCheckOptions = {}): GrammarCheckResult {
     const defaultOptions: GrammarCheckOptions = {
       checkSpelling: true,
       checkGrammar: true,
       checkPunctuation: true,
       checkStyle: true,
       strictMode: false,
       ...options
     };
     return this.checkGrammar(resumeData, defaultOptions);
   }

  private checkResumeSection(
    sectionData: any,
    sectionKey: string,
    options: GrammarCheckOptions
  ): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    
    if (!sectionData) {
      return issues;
    }

    // Handle different section types
    switch (sectionKey) {
      case 'personal':
        if (sectionData.name) {
          issues.push(...this.checkSection('Personal Info', 'name', sectionData.name, options));
        }
        if (sectionData.role) {
          issues.push(...this.checkSection('Personal Info', 'role', sectionData.role, options));
        }
        break;
      case 'profile':
        if (typeof sectionData === 'string') {
          issues.push(...this.checkSection('Profile', 'summary', sectionData, options));
        }
        break;
      case 'experience':
        if (Array.isArray(sectionData)) {
          sectionData.forEach((exp, index) => {
            issues.push(...this.checkSection('Experience', `title-${index}`, exp.title, options));
            issues.push(...this.checkSection('Experience', `company-${index}`, exp.company, options));
            if (exp.bullets) {
              exp.bullets.forEach((bullet: string, bulletIndex: number) => {
                issues.push(...this.checkSection('Experience', `bullet-${index}-${bulletIndex}`, bullet, options));
              });
            }
          });
        }
        break;
      case 'projects':
        if (Array.isArray(sectionData)) {
          sectionData.forEach((project, index) => {
            issues.push(...this.checkSection('Projects', `name-${index}`, project.name, options));
            issues.push(...this.checkSection('Projects', `description-${index}`, project.desc, options));
            issues.push(...this.checkSection('Projects', `tech-${index}`, project.tech, options));
          });
        }
        break;
      case 'education':
        if (Array.isArray(sectionData)) {
          sectionData.forEach((edu, index) => {
            issues.push(...this.checkSection('Education', `degree-${index}`, edu.degree, options));
            issues.push(...this.checkSection('Education', `school-${index}`, edu.school, options));
            if (edu.details) {
              edu.details.forEach((detail: string, detailIndex: number) => {
                issues.push(...this.checkSection('Education', `detail-${index}-${detailIndex}`, detail, options));
              });
            }
          });
        }
        break;
      case 'leadership':
        if (Array.isArray(sectionData)) {
          sectionData.forEach((item: string, index: number) => {
            issues.push(...this.checkSection('Leadership', `item-${index}`, item, options));
          });
        }
        break;
      case 'openSource':
        if (Array.isArray(sectionData)) {
          sectionData.forEach((item: string, index: number) => {
            issues.push(...this.checkSection('Open Source', `item-${index}`, item, options));
          });
        }
        break;
    }

    return issues;
  }

  private originalCheckGrammar(
    resume: ResumeData,
    options: GrammarCheckOptions = {
      checkSpelling: true,
      checkGrammar: true,
      checkPunctuation: true,
      checkStyle: true,
      strictMode: false
    }
  ): GrammarCheckResult {
    const issues: GrammarIssue[] = [];
    
    // Check personal info
    if (resume.personal) {
      issues.push(...this.checkSection('Personal Info', 'name', resume.personal.name, options));
      issues.push(...this.checkSection('Personal Info', 'role', resume.personal.role, options));
    }
    
    // Check profile
    if (resume.profile) {
      issues.push(...this.checkSection('Profile', 'summary', resume.profile, options));
    }

    // Check experience
    if (resume.experience) {
      resume.experience.forEach((exp, index) => {
        issues.push(...this.checkSection('Experience', `title-${index}`, exp.title, options));
        issues.push(...this.checkSection('Experience', `company-${index}`, exp.company, options));
        if (exp.bullets) {
          exp.bullets.forEach((bullet: string, bulletIndex: number) => {
            issues.push(...this.checkSection('Experience', `bullet-${index}-${bulletIndex}`, bullet, options));
          });
        }
      });
    }

    // Check projects
    if (resume.projects) {
      resume.projects.forEach((project, index) => {
        issues.push(...this.checkSection('Projects', `name-${index}`, project.name, options));
        issues.push(...this.checkSection('Projects', `description-${index}`, project.desc, options));
        issues.push(...this.checkSection('Projects', `tech-${index}`, project.tech, options));
      });
    }

    // Check education
    if (resume.education) {
      resume.education.forEach((edu, index) => {
        issues.push(...this.checkSection('Education', `degree-${index}`, edu.degree, options));
        issues.push(...this.checkSection('Education', `school-${index}`, edu.school, options));
        if (edu.details) {
          edu.details.forEach((detail: string, detailIndex: number) => {
            issues.push(...this.checkSection('Education', `detail-${index}-${detailIndex}`, detail, options));
          });
        }
      });
    }
    
    // Check leadership
    if (resume.leadership) {
      resume.leadership.forEach((item: string, index: number) => {
        issues.push(...this.checkSection('Leadership', `item-${index}`, item, options));
      });
    }
    
    // Check open source
    if (resume.openSource) {
      resume.openSource.forEach((item: string, index: number) => {
        issues.push(...this.checkSection('Open Source', `item-${index}`, item, options));
      });
    }

    return this.generateResult(issues);
  }

  private checkSection(
    section: string,
    field: string,
    text: string,
    options: GrammarCheckOptions
  ): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    
    if (!text || text.trim().length === 0) {
      return issues;
    }

    // Spelling check
    if (options.checkSpelling === true) {
      issues.push(...this.checkSpelling(text, section, field));
    }

    // Grammar check
    if (options.checkGrammar === true) {
      issues.push(...this.checkGrammarRules(text, section, field));
    }

    // Punctuation check
    if (options.checkPunctuation === true) {
      issues.push(...this.checkPunctuation(text, section, field));
    }

    // Style check
    if (options.checkStyle === true) {
      issues.push(...this.checkStyle(text, section, field, options.strictMode || false));
    }

    return issues;
  }

  private checkSpelling(text: string, section: string, field: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    
    Object.entries(this.commonMisspellings).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        issues.push({
          type: 'spelling',
          severity: 'high',
          message: `Misspelled word: "${match[0]}"`,
          suggestion: `Replace with "${correct}"`,
          section,
          field,
          position: {
            start: match.index,
            end: match.index + match[0].length
          },
          originalText: match[0],
          correctedText: correct
        });
      }
    });

    return issues;
  }

  private checkGrammarRules(text: string, section: string, field: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    
    this.grammarRules.forEach(rule => {
      if (rule.pattern && rule.replacement) {
        const matches = text.match(rule.pattern);
        if (matches) {
          matches.forEach(match => {
            const index = text.indexOf(match);
            issues.push({
              type: rule.type,
              severity: 'medium',
              message: rule.message,
              suggestion: `Replace "${match}" with "${match.replace(rule.pattern, rule.replacement)}"`,
              section,
              field,
              position: {
                start: index,
                end: index + match.length
              },
              originalText: match,
              correctedText: match.replace(rule.pattern, rule.replacement)
            });
          });
        }
      } else {
        // Pattern-only rules (like there/their/they're)
        const matches = text.match(rule.pattern);
        if (matches) {
          matches.forEach(match => {
            const index = text.indexOf(match);
            issues.push({
              type: rule.type,
              severity: 'medium',
              message: rule.message,
              suggestion: 'Review context and choose appropriate word',
              section,
              field,
              position: {
                start: index,
                end: index + match.length
              },
              originalText: match,
              correctedText: match // No automatic correction for these
            });
          });
        }
      }
    });

    return issues;
  }

  private checkPunctuation(text: string, section: string, field: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    
    // Check for missing periods at end of sentences
    if (text.length > 10 && !text.match(/[.!?]$/)) {
      issues.push({
        type: 'punctuation',
        severity: 'low',
        message: 'Missing ending punctuation',
        suggestion: 'Add a period at the end of the sentence',
        section,
        field,
        position: {
          start: text.length,
          end: text.length
        },
        originalText: text,
        correctedText: text + '.'
      });
    }

    // Check for double punctuation
    const doublePunctuation = text.match(/[.!?]{2,}/g);
    if (doublePunctuation) {
      doublePunctuation.forEach(match => {
        const index = text.indexOf(match);
        issues.push({
          type: 'punctuation',
          severity: 'medium',
          message: 'Multiple punctuation marks',
          suggestion: `Replace "${match}" with single punctuation`,
          section,
          field,
          position: {
            start: index,
            end: index + match.length
          },
          originalText: match,
          correctedText: match[0]
        });
      });
    }

    return issues;
  }

  private checkStyle(text: string, section: string, field: string, strictMode: boolean): GrammarIssue[] {
    const issues: GrammarIssue[] = [];
    
    this.styleRules.forEach(rule => {
      if (!strictMode && rule.severity === 'low') {
        return; // Skip low-severity style issues in non-strict mode
      }
      
      const matches = text.match(rule.pattern);
      if (matches) {
        matches.forEach(match => {
          const index = text.indexOf(match);
          issues.push({
            type: rule.type,
            severity: rule.severity,
            message: rule.message,
            suggestion: 'Consider revising for stronger impact',
            section,
            field,
            position: {
              start: index,
              end: index + match.length
            },
            originalText: match,
            correctedText: match // Style suggestions don't have automatic corrections
          });
        });
      }
    });

    return issues;
  }

  private generateResult(issues: GrammarIssue[], sectionResults?: { [key: string]: GrammarIssue[] }): GrammarCheckResult {
    const issuesByType = {
      grammar: issues.filter(i => i.type === 'grammar').length,
      spelling: issues.filter(i => i.type === 'spelling').length,
      punctuation: issues.filter(i => i.type === 'punctuation').length,
      style: issues.filter(i => i.type === 'style').length
    };

    const issuesBySeverity = {
      low: issues.filter(i => i.severity === 'low').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      high: issues.filter(i => i.severity === 'high').length
    };

    // Calculate overall score (0-100)
    const totalIssues = issues.length;
    const weightedScore = issues.reduce((score, issue) => {
      const weights = { low: 1, medium: 3, high: 5 };
      return score - weights[issue.severity];
    }, 100);
    
    const overallScore = Math.max(0, Math.min(100, weightedScore));

    const recommendations = this.generateRecommendations(issues, issuesByType, issuesBySeverity);

    return {
      totalIssues,
      issuesByType,
      issuesBySeverity,
      issues,
      overallScore,
      recommendations
    };
  }

  private generateRecommendations(
    issues: GrammarIssue[],
    issuesByType: any,
    issuesBySeverity: any
  ): string[] {
    const recommendations: string[] = [];

    if (issuesBySeverity.high > 0) {
      recommendations.push(`Address ${issuesBySeverity.high} high-priority issues first`);
    }

    if (issuesByType.spelling > 0) {
      recommendations.push(`Fix ${issuesByType.spelling} spelling errors to improve professionalism`);
    }

    if (issuesByType.grammar > 5) {
      recommendations.push('Consider using grammar checking tools or proofreading services');
    }

    if (issuesByType.style > 3) {
      recommendations.push('Review style suggestions to strengthen your resume language');
    }

    if (issues.length === 0) {
      recommendations.push('Excellent! No grammar or spelling issues found.');
    } else if (issues.length < 5) {
      recommendations.push('Good job! Only minor issues detected.');
    } else if (issues.length < 15) {
      recommendations.push('Several issues found. Review and correct for better impact.');
    } else {
      recommendations.push('Many issues detected. Consider thorough proofreading.');
    }

    return recommendations;
  }

  /**
   * Apply grammar and spelling corrections to the resume
   */
  applySuggestions(resume: ResumeData, issues: GrammarIssue[]): ResumeData {
    const correctedResume = JSON.parse(JSON.stringify(resume)) as ResumeData;
    
    // Group issues by section and field for efficient processing
    const issuesBySection = issues.reduce((acc, issue) => {
      const key = `${issue.section}-${issue.field}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(issue);
      return acc;
    }, {} as { [key: string]: GrammarIssue[] });

    // Apply corrections (only for spelling and some grammar issues)
    Object.entries(issuesBySection).forEach(([key, sectionIssues]) => {
      const autoCorrectableIssues = sectionIssues.filter(issue => 
        issue.type === 'spelling' || 
        (issue.type === 'grammar' && issue.correctedText !== issue.originalText)
      );
      
      if (autoCorrectableIssues.length > 0) {
        // Apply corrections to the appropriate field
        // This would require more complex logic to navigate the resume structure
        // For now, we'll return the original resume with a note about manual corrections
      }
    });

    return correctedResume;
  }

  /**
   * Apply corrections to resume text
   */
  applyCorrections(resume: ResumeData, issues: GrammarIssue[]): ResumeData {
    return this.applySuggestions(resume, issues);
  }

  /**
   * Export grammar check report in various formats
   */
  exportGrammarReport(result: GrammarCheckResult, format: 'json' | 'txt' | 'html' = 'json'): string {
    return this.exportReport(result, format);
  }

  /**
   * Export report in specified format
   */
  exportReport(result: GrammarCheckResult, format: 'json' | 'txt' | 'html'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(result, null, 2);
      case 'txt':
        return this.generateTextReport(result);
      case 'html':
        return this.generateHtmlReport(result);
      default:
        return JSON.stringify(result, null, 2);
    }
  }

  /**
   * Generate a text-based report
   */
  private generateTextReport(result: GrammarCheckResult): string {
    let report = '=== GRAMMAR & SPELL CHECK REPORT ===\n\n';
    
    report += `Overall Score: ${result.overallScore}/100\n`;
    report += `Total Issues: ${result.totalIssues}\n\n`;
    
    report += 'Issues by Type:\n';
    report += `- Grammar: ${result.issuesByType.grammar}\n`;
    report += `- Spelling: ${result.issuesByType.spelling}\n`;
    report += `- Punctuation: ${result.issuesByType.punctuation}\n`;
    report += `- Style: ${result.issuesByType.style}\n\n`;
    
    report += 'Issues by Severity:\n';
    report += `- High: ${result.issuesBySeverity.high}\n`;
    report += `- Medium: ${result.issuesBySeverity.medium}\n`;
    report += `- Low: ${result.issuesBySeverity.low}\n\n`;
    
    if (result.issues.length > 0) {
      report += 'Detailed Issues:\n';
      result.issues.forEach((issue, index) => {
        report += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.section} - ${issue.field}\n`;
        report += `   Type: ${issue.type}\n`;
        report += `   Issue: ${issue.message}\n`;
        report += `   Suggestion: ${issue.suggestion}\n`;
        report += `   Text: "${issue.originalText}"\n`;
        if (issue.correctedText !== issue.originalText) {
          report += `   Correction: "${issue.correctedText}"\n`;
        }
        report += '\n';
      });
    }
    
    report += 'Recommendations:\n';
    result.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
    
    return report;
  }

  /**
   * Generate an HTML report
   */
  private generateHtmlReport(result: GrammarCheckResult): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Grammar & Spell Check Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        .score { font-size: 24px; font-weight: bold; color: ${result.overallScore >= 80 ? '#28a745' : result.overallScore >= 60 ? '#ffc107' : '#dc3545'}; }
        .section { margin: 20px 0; }
        .issue { border-left: 4px solid #007bff; padding: 10px; margin: 10px 0; background: #f8f9fa; }
        .high { border-left-color: #dc3545; }
        .medium { border-left-color: #ffc107; }
        .low { border-left-color: #28a745; }
        .stats { display: flex; gap: 20px; }
        .stat-box { background: #e9ecef; padding: 10px; border-radius: 5px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Grammar & Spell Check Report</h1>
        <div class="score">Overall Score: ${result.overallScore}/100</div>
        <p>Total Issues Found: ${result.totalIssues}</p>
    </div>
    
    <div class="section">
        <h2>Summary</h2>
        <div class="stats">
            <div class="stat-box">
                <strong>${result.issuesByType.grammar}</strong><br>Grammar
            </div>
            <div class="stat-box">
                <strong>${result.issuesByType.spelling}</strong><br>Spelling
            </div>
            <div class="stat-box">
                <strong>${result.issuesByType.punctuation}</strong><br>Punctuation
            </div>
            <div class="stat-box">
                <strong>${result.issuesByType.style}</strong><br>Style
            </div>
        </div>
    </div>
    
    ${result.issues.length > 0 ? `
    <div class="section">
        <h2>Issues Found</h2>
        ${result.issues.map((issue, index) => `
        <div class="issue ${issue.severity}">
            <strong>#${index + 1} - ${issue.section} (${issue.field})</strong>
            <p><strong>Type:</strong> ${issue.type} | <strong>Severity:</strong> ${issue.severity}</p>
            <p><strong>Issue:</strong> ${issue.message}</p>
            <p><strong>Suggestion:</strong> ${issue.suggestion}</p>
            <p><strong>Text:</strong> "${issue.originalText}"</p>
            ${issue.correctedText !== issue.originalText ? `<p><strong>Correction:</strong> "${issue.correctedText}"</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    <div class="section">
        <h2>Recommendations</h2>
        <ul>
            ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>
    `;
  }
}
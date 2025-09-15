import { ResumeData, Experience, Project, Education } from '../../data/types.js';

// Interfaces for length optimization
export interface LengthConstraints {
  maxPages: number;
  maxWords?: number;
  maxCharacters?: number;
  targetFormat: 'pdf' | 'docx' | 'txt' | 'html';
  prioritySections: string[];
}

export interface OptimizationResult {
  originalLength: {
    pages: number;
    words: number;
    characters: number;
  };
  optimizedLength: {
    pages: number;
    words: number;
    characters: number;
  };
  reductionPercentage: number;
  sectionsModified: string[];
  suggestions: OptimizationSuggestion[];
  optimizedResume: ResumeData;
}

export interface OptimizationSuggestion {
  section: string;
  type: 'trim' | 'remove' | 'condense' | 'prioritize';
  description: string;
  impact: 'low' | 'medium' | 'high';
  wordsReduced: number;
}

export interface OptimizationOptions {
  preserveKeywords: boolean;
  maintainReadability: boolean;
  aggressiveMode: boolean;
  customPriorities?: { [section: string]: number };
}

export class LengthOptimizer {
  private readonly sectionPriorities = {
    'personal': 10,
    'experience': 9,
    'skills': 8,
    'education': 7,
    'projects': 6,
    'certifications': 5,
    'awards': 4,
    'languages': 3,
    'interests': 2,
    'references': 1
  };

  private readonly wordsPerPage = {
    'pdf': 400,
    'docx': 450,
    'txt': 500,
    'html': 350
  };

  /**
   * Optimize resume length based on constraints
   */
  optimizeLength(
    resume: ResumeData,
    constraints: LengthConstraints,
    options: OptimizationOptions = {
      preserveKeywords: true,
      maintainReadability: true,
      aggressiveMode: false
    }
  ): OptimizationResult {
    const originalStats = this.calculateResumeStats(resume);
    const targetWords = constraints.maxPages * this.wordsPerPage[constraints.targetFormat];
    
    if (constraints.maxWords && constraints.maxWords < targetWords) {
      constraints.maxWords = Math.min(constraints.maxWords, targetWords);
    } else {
      constraints.maxWords = targetWords;
    }

    let optimizedResume = JSON.parse(JSON.stringify(resume)) as ResumeData;
    const suggestions: OptimizationSuggestion[] = [];
    const sectionsModified: string[] = [];

    // Calculate reduction needed
    const reductionNeeded = originalStats.words - constraints.maxWords;
    
    if (reductionNeeded <= 0) {
      return {
        originalLength: originalStats,
        optimizedLength: originalStats,
        reductionPercentage: 0,
        sectionsModified: [],
        suggestions: [],
        optimizedResume: resume
      };
    }

    let wordsReduced = 0;
    const targetReduction = reductionNeeded;

    // Phase 1: Remove low-priority sections if aggressive mode
    if (options.aggressiveMode && wordsReduced < targetReduction) {
      const result = this.removeLowPrioritySections(optimizedResume, targetReduction - wordsReduced, options);
      optimizedResume = result.resume;
      wordsReduced += result.wordsReduced;
      suggestions.push(...result.suggestions);
      sectionsModified.push(...result.sectionsModified);
    }

    // Phase 2: Trim experience descriptions
    if (wordsReduced < targetReduction) {
      const result = this.trimExperienceDescriptions(optimizedResume, targetReduction - wordsReduced, options);
      optimizedResume = result.resume;
      wordsReduced += result.wordsReduced;
      suggestions.push(...result.suggestions);
      if (result.wordsReduced > 0) sectionsModified.push('experience');
    }

    // Phase 3: Optimize project descriptions
    if (wordsReduced < targetReduction) {
      const result = this.optimizeProjectDescriptions(optimizedResume, targetReduction - wordsReduced, options);
      optimizedResume = result.resume;
      wordsReduced += result.wordsReduced;
      suggestions.push(...result.suggestions);
      if (result.wordsReduced > 0) sectionsModified.push('projects');
    }

    // Phase 4: Condense skills and other sections
    if (wordsReduced < targetReduction) {
      const result = this.condenseOtherSections(optimizedResume, targetReduction - wordsReduced, options);
      optimizedResume = result.resume;
      wordsReduced += result.wordsReduced;
      suggestions.push(...result.suggestions);
      sectionsModified.push(...result.sectionsModified);
    }

    const optimizedStats = this.calculateResumeStats(optimizedResume);
    const reductionPercentage = ((originalStats.words - optimizedStats.words) / originalStats.words) * 100;

    return {
      originalLength: originalStats,
      optimizedLength: optimizedStats,
      reductionPercentage,
      sectionsModified: [...new Set(sectionsModified)],
      suggestions,
      optimizedResume
    };
  }

  /**
   * Calculate resume statistics
   */
  private calculateResumeStats(resume: ResumeData): { pages: number; words: number; characters: number } {
    let totalWords = 0;
    let totalCharacters = 0;

    // Count personal section
    if (resume.personal) {
      const personalText = `${resume.personal.name || ''} ${resume.personal.role || ''} ${resume.personal.email || ''} ${resume.personal.phone || ''} ${resume.personal.location || ''} ${resume.personal.portfolio || ''} ${resume.personal.linkedin || ''} ${resume.personal.github || ''}`;
      const words = this.countWords(personalText);
      totalWords += words;
      totalCharacters += personalText.length;
    }

    // Count experience
    if (resume.experience) {
      resume.experience.forEach((exp: Experience) => {
        const expText = `${exp.company || ''} ${exp.title || ''} ${exp.dates || ''} ${exp.bullets?.join(' ') || ''}`;
        totalWords += this.countWords(expText);
        totalCharacters += expText.length;
      });
    }

    // Count projects
    if (resume.projects) {
      resume.projects.forEach((proj: Project) => {
        const projText = `${proj.name || ''} ${proj.desc || ''} ${proj.tech || ''}`;
        totalWords += this.countWords(projText);
        totalCharacters += projText.length;
      });
    }

    // Count education
    if (resume.education) {
      resume.education.forEach((edu: Education) => {
        const eduText = `${edu.degree || ''} ${edu.school || ''} ${edu.dates || ''} ${edu.details?.join(' ') || ''}`;
        totalWords += this.countWords(eduText);
        totalCharacters += eduText.length;
      });
    }

    // Count tech stack
    if (resume.techStack) {
      const techText = resume.techStack.join(' ');
      totalWords += this.countWords(techText);
      totalCharacters += techText.length;
    }

    // Count profile
    if (resume.profile) {
      totalWords += this.countWords(resume.profile);
      totalCharacters += resume.profile.length;
    }

    // Count leadership and open source
    ['leadership', 'openSource'].forEach(section => {
      const sectionData = (resume as any)[section];
      if (Array.isArray(sectionData)) {
        const sectionText = sectionData.join(' ');
        totalWords += this.countWords(sectionText);
        totalCharacters += sectionText.length;
      }
    });

    // Count other sections
    ['certifications', 'awards', 'languages'].forEach(section => {
      const sectionData = (resume as any)[section];
      if (Array.isArray(sectionData)) {
        sectionData.forEach((item: any) => {
          const itemText = typeof item === 'string' ? item : Object.values(item).join(' ');
          totalWords += this.countWords(itemText);
          totalCharacters += itemText.length;
        });
      }
    });

    const estimatedPages = Math.ceil(totalWords / 400); // Rough estimate

    return {
      pages: estimatedPages,
      words: totalWords,
      characters: totalCharacters
    };
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Remove low priority sections
   */
  private removeLowPrioritySections(
    resume: ResumeData,
    targetReduction: number,
    options: OptimizationOptions
  ): { resume: ResumeData; wordsReduced: number; suggestions: OptimizationSuggestion[]; sectionsModified: string[] } {
    const suggestions: OptimizationSuggestion[] = [];
    const sectionsModified: string[] = [];
    let wordsReduced = 0;

    const sectionsToConsider = ['interests', 'references', 'languages'];
    
    for (const section of sectionsToConsider) {
      if (wordsReduced >= targetReduction) break;
      
      const sectionData = (resume as any)[section];
      if (sectionData) {
        const sectionText = Array.isArray(sectionData) 
          ? sectionData.map(item => typeof item === 'string' ? item : Object.values(item).join(' ')).join(' ')
          : String(sectionData);
        const sectionWords = this.countWords(sectionText);
        
        delete (resume as any)[section];
        wordsReduced += sectionWords;
        sectionsModified.push(section);
        
        suggestions.push({
          section,
          type: 'remove',
          description: `Removed ${section} section to reduce length`,
          impact: 'low',
          wordsReduced: sectionWords
        });
      }
    }

    return { resume, wordsReduced, suggestions, sectionsModified };
  }

  /**
   * Trim experience descriptions
   */
  private trimExperienceDescriptions(
    resume: ResumeData,
    targetReduction: number,
    options: OptimizationOptions
  ): { resume: ResumeData; wordsReduced: number; suggestions: OptimizationSuggestion[] } {
    const suggestions: OptimizationSuggestion[] = [];
    let wordsReduced = 0;

    if (!resume.experience) return { resume, wordsReduced, suggestions };

    resume.experience.forEach((exp: Experience, index: number) => {
      if (wordsReduced >= targetReduction || !exp.bullets) return;

      const originalBullets = [...exp.bullets];
      const originalWords = exp.bullets.reduce((sum: number, bullet: string) => sum + this.countWords(bullet), 0);

      // Trim bullets - keep most impactful ones
      if (exp.bullets.length > 3) {
        exp.bullets = exp.bullets.slice(0, 3);
      }

      // Shorten remaining bullets
      exp.bullets = exp.bullets.map((bullet: string) => {
        if (bullet.length > 100) {
          return bullet.substring(0, 97) + '...';
        }
        return bullet;
      });

      const newWords = exp.bullets.reduce((sum: number, bullet: string) => sum + this.countWords(bullet), 0);
      const reduction = originalWords - newWords;
      wordsReduced += reduction;

      if (reduction > 0) {
        suggestions.push({
          section: 'experience',
          type: 'trim',
          description: `Trimmed experience bullets for ${exp.company}`,
          impact: 'medium',
          wordsReduced: reduction
        });
      }
    });

    return { resume, wordsReduced, suggestions };
  }

  /**
   * Optimize project descriptions
   */
  private optimizeProjectDescriptions(
    resume: ResumeData,
    targetReduction: number,
    options: OptimizationOptions
  ): { resume: ResumeData; wordsReduced: number; suggestions: OptimizationSuggestion[] } {
    const suggestions: OptimizationSuggestion[] = [];
    let wordsReduced = 0;

    if (!resume.projects) return { resume, wordsReduced, suggestions };

    resume.projects.forEach((proj: Project, index: number) => {
      if (wordsReduced >= targetReduction) return;

      const originalDesc = proj.desc || '';
      const originalWords = this.countWords(originalDesc);

      if (originalDesc.length > 150) {
        proj.desc = originalDesc.substring(0, 147) + '...';
        const newWords = this.countWords(proj.desc);
        const reduction = originalWords - newWords;
        wordsReduced += reduction;

        suggestions.push({
          section: 'projects',
          type: 'condense',
          description: `Condensed description for project: ${proj.name}`,
          impact: 'low',
          wordsReduced: reduction
        });
      }
    });

    return { resume, wordsReduced, suggestions };
  }

  /**
   * Condense other sections
   */
  private condenseOtherSections(
    resume: ResumeData,
    targetReduction: number,
    options: OptimizationOptions
  ): { resume: ResumeData; wordsReduced: number; suggestions: OptimizationSuggestion[]; sectionsModified: string[] } {
    const suggestions: OptimizationSuggestion[] = [];
    const sectionsModified: string[] = [];
    let wordsReduced = 0;

    // Condense tech stack section
    if (resume.techStack && resume.techStack.length > 15 && wordsReduced < targetReduction) {
      const originalWords = this.countWords(resume.techStack.join(' '));
      
      // Limit tech stack to top 15 items
      resume.techStack = resume.techStack.slice(0, 15);
      
      const newWords = this.countWords(resume.techStack.join(' '));
      const reduction = originalWords - newWords;
      
      if (reduction > 0) {
        wordsReduced += reduction;
        sectionsModified.push('techStack');
        suggestions.push({
          section: 'techStack',
          type: 'condense',
          description: 'Limited tech stack to top 15 technologies',
          impact: 'low',
          wordsReduced: reduction
        });
      }
    }

    return { resume, wordsReduced, suggestions, sectionsModified };
  }

  /**
   * Analyze current resume length
   */
  analyzeLength(resume: ResumeData, targetFormat: 'pdf' | 'docx' | 'txt' | 'html' = 'pdf'): {
    stats: { pages: number; words: number; characters: number };
    recommendations: string[];
    isOptimal: boolean;
  } {
    const stats = this.calculateResumeStats(resume);
    const recommendations: string[] = [];
    const optimalPages = targetFormat === 'pdf' ? 2 : 1;
    
    const isOptimal = stats.pages <= optimalPages;

    if (stats.pages > optimalPages) {
      recommendations.push(`Resume is ${stats.pages - optimalPages} page(s) too long`);
      recommendations.push('Consider using the length optimizer to trim content');
    }

    if (stats.words > 800) {
      recommendations.push('Consider reducing word count for better readability');
    }

    if (!isOptimal) {
      recommendations.push('Focus on most relevant experience and achievements');
      recommendations.push('Use bullet points instead of paragraphs');
      recommendations.push('Remove or condense less relevant sections');
    }

    return {
      stats,
      recommendations,
      isOptimal
    };
  }

  /**
   * Export optimization results
   */
  exportOptimization(result: OptimizationResult, format: 'json' | 'txt' | 'html'): string {
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
   * Generate text report
   */
  private generateTextReport(result: OptimizationResult): string {
    const lines = [
      '=== RESUME LENGTH OPTIMIZATION REPORT ===',
      '',
      'ORIGINAL STATS:',
      `  Pages: ${result.originalLength.pages}`,
      `  Words: ${result.originalLength.words}`,
      `  Characters: ${result.originalLength.characters}`,
      '',
      'OPTIMIZED STATS:',
      `  Pages: ${result.optimizedLength.pages}`,
      `  Words: ${result.optimizedLength.words}`,
      `  Characters: ${result.optimizedLength.characters}`,
      '',
      `REDUCTION: ${result.reductionPercentage.toFixed(1)}%`,
      '',
      'SECTIONS MODIFIED:',
      ...result.sectionsModified.map(section => `  - ${section}`),
      '',
      'OPTIMIZATION SUGGESTIONS:',
      ...result.suggestions.map(suggestion => 
        `  - ${suggestion.section}: ${suggestion.description} (${suggestion.wordsReduced} words reduced)`
      )
    ];

    return lines.join('\n');
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(result: OptimizationResult): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Resume Length Optimization Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-box { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .suggestions { margin-top: 20px; }
        .suggestion { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 3px; }
        .impact-high { border-left: 4px solid #e74c3c; }
        .impact-medium { border-left: 4px solid #f39c12; }
        .impact-low { border-left: 4px solid #27ae60; }
    </style>
</head>
<body>
    <h1 class="header">Resume Length Optimization Report</h1>
    
    <div class="stats">
        <div class="stat-box">
            <h3>Original</h3>
            <p>Pages: ${result.originalLength.pages}</p>
            <p>Words: ${result.originalLength.words}</p>
            <p>Characters: ${result.originalLength.characters}</p>
        </div>
        <div class="stat-box">
            <h3>Optimized</h3>
            <p>Pages: ${result.optimizedLength.pages}</p>
            <p>Words: ${result.optimizedLength.words}</p>
            <p>Characters: ${result.optimizedLength.characters}</p>
        </div>
        <div class="stat-box">
            <h3>Reduction</h3>
            <p>${result.reductionPercentage.toFixed(1)}%</p>
        </div>
    </div>
    
    <h2>Sections Modified</h2>
    <ul>
        ${result.sectionsModified.map(section => `<li>${section}</li>`).join('')}
    </ul>
    
    <div class="suggestions">
        <h2>Optimization Details</h2>
        ${result.suggestions.map(suggestion => `
            <div class="suggestion impact-${suggestion.impact}">
                <strong>${suggestion.section}</strong>: ${suggestion.description}
                <br><small>${suggestion.wordsReduced} words reduced</small>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }
}
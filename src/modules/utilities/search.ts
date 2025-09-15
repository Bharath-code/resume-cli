import { ResumeData, SectionKey, SearchResult } from '../../data/types.js';
import { addToSearchHistory } from '../core/config.js';

/**
 * Search within resume data
 */
export function searchResume(resumeData: ResumeData, query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return results;

  // Add to search history
  addToSearchHistory(query);

  // Search in tech stack
  resumeData.techStack.forEach(tech => {
    if (tech.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'techStack',
        type: tech.toLowerCase() === searchTerm ? 'exact' : 'partial',
        content: tech,
        context: 'Technology Stack',
        score: tech.toLowerCase() === searchTerm ? 100 : 80
      });
    }
  });

  // Search in profile
  if (resumeData.profile.toLowerCase().includes(searchTerm)) {
    const sentences = resumeData.profile.split('. ');
    const matchingSentence = sentences.find(sentence => 
      sentence.toLowerCase().includes(searchTerm)
    );
    results.push({
      section: 'profile',
      type: 'partial',
      content: matchingSentence || resumeData.profile,
      context: 'Professional Profile',
      score: 70
    });
  }

  // Search in experience
  resumeData.experience.forEach((exp, index) => {
    // Search company name
    if (exp.company.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'experience',
        type: exp.company.toLowerCase() === searchTerm ? 'exact' : 'partial',
        content: `${exp.company} - ${exp.title}`,
        context: `Experience #${index + 1}`,
        score: exp.company.toLowerCase() === searchTerm ? 100 : 75
      });
    }
    
    // Search job title
    if (exp.title.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'experience',
        type: exp.title.toLowerCase() === searchTerm ? 'exact' : 'partial',
        content: `${exp.title} at ${exp.company}`,
        context: `Experience #${index + 1}`,
        score: exp.title.toLowerCase() === searchTerm ? 100 : 75
      });
    }
    
    // Search in bullets
    exp.bullets.forEach((bullet, bulletIndex) => {
      if (bullet.toLowerCase().includes(searchTerm)) {
        results.push({
          section: 'experience',
          type: 'partial',
          content: bullet.replace(/\*\*(.*?)\*\*/g, '$1'), // Remove markdown
          context: `${exp.company} - Achievement #${bulletIndex + 1}`,
          score: 65
        });
      }
    });
  });

  // Search in projects
  resumeData.projects.forEach((project, index) => {
    // Search project name
    if (project.name.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'projects',
        type: project.name.toLowerCase() === searchTerm ? 'exact' : 'partial',
        content: project.name,
        context: `Project #${index + 1}`,
        score: project.name.toLowerCase() === searchTerm ? 100 : 80
      });
    }
    
    // Search project description
    if (project.desc.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'projects',
        type: 'partial',
        content: project.desc,
        context: `${project.name} - Description`,
        score: 70
      });
    }
    
    // Search project technologies
    if (project.tech.toLowerCase().includes(searchTerm)) {
      const techs = project.tech.split(' • ');
      const matchingTech = techs.find(tech => 
        tech.toLowerCase().includes(searchTerm)
      );
      results.push({
        section: 'projects',
        type: 'partial',
        content: matchingTech || project.tech,
        context: `${project.name} - Technologies`,
        score: 75
      });
    }
  });

  // Search in leadership
  resumeData.leadership.forEach((item, index) => {
    if (item.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'leadership',
        type: 'partial',
        content: item,
        context: `Leadership #${index + 1}`,
        score: 70
      });
    }
  });

  // Search in open source
  resumeData.openSource.forEach((item, index) => {
    if (item.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'openSource',
        type: 'partial',
        content: item,
        context: `Open Source #${index + 1}`,
        score: 70
      });
    }
  });

  // Search in education
  resumeData.education.forEach((edu, index) => {
    // Search degree
    if (edu.degree.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'education',
        type: edu.degree.toLowerCase() === searchTerm ? 'exact' : 'partial',
        content: edu.degree,
        context: `Education #${index + 1}`,
        score: edu.degree.toLowerCase() === searchTerm ? 100 : 80
      });
    }
    
    // Search school
    if (edu.school.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'education',
        type: edu.school.toLowerCase() === searchTerm ? 'exact' : 'partial',
        content: edu.school,
        context: `Education #${index + 1}`,
        score: edu.school.toLowerCase() === searchTerm ? 100 : 80
      });
    }
    
    // Search details
    edu.details.forEach((detail, detailIndex) => {
      if (detail.toLowerCase().includes(searchTerm)) {
        results.push({
          section: 'education',
          type: 'partial',
          content: detail,
          context: `${edu.school} - Detail #${detailIndex + 1}`,
          score: 65
        });
      }
    });
  });

  // Search in personal info
  const personalFields = ['name', 'role', 'location'] as const;
  personalFields.forEach(field => {
    const value = resumeData.personal[field];
    if (value.toLowerCase().includes(searchTerm)) {
      results.push({
        section: 'personal',
        type: value.toLowerCase() === searchTerm ? 'exact' : 'partial',
        content: value,
        context: `Personal - ${field.charAt(0).toUpperCase() + field.slice(1)}`,
        score: value.toLowerCase() === searchTerm ? 100 : 85
      });
    }
  });

  return results;
}

/**
 * Get search suggestions based on resume content
 */
export function getSearchSuggestions(resumeData: ResumeData): string[] {
  const suggestions = new Set<string>();
  
  // Add tech stack items
  resumeData.techStack.forEach(tech => suggestions.add(tech));
  
  // Add company names
  resumeData.experience.forEach(exp => {
    suggestions.add(exp.company);
    suggestions.add(exp.title);
  });
  
  // Add project names
  resumeData.projects.forEach(project => {
    suggestions.add(project.name);
    // Add individual technologies from projects
    project.tech.split(' • ').forEach(tech => suggestions.add(tech.trim()));
  });
  
  // Add education info
  resumeData.education.forEach(edu => {
    suggestions.add(edu.degree);
    suggestions.add(edu.school);
  });
  
  return Array.from(suggestions).sort();
}

/**
 * Filter search results by section
 */
export function filterResultsBySection(results: SearchResult[], section: SectionKey): SearchResult[] {
  return results.filter(result => result.section === section);
}

/**
 * Group search results by section
 */
export function groupResultsBySection(results: SearchResult[]): Record<string, SearchResult[]> {
  const grouped: Record<string, SearchResult[]> = {};
  
  results.forEach(result => {
    if (!grouped[result.section]) {
      grouped[result.section] = [];
    }
    grouped[result.section].push(result);
  });
  
  return grouped;
}
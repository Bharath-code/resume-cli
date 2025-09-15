import { ResumeData, OutputFormat, ExportOptions, TemplateConfig, SectionKey } from '../../data/types.js';
import chalk from 'chalk';

// Predefined templates for different industries and purposes
export const EXPORT_TEMPLATES: Record<string, TemplateConfig> = {
  github_profile: {
    name: 'GitHub Profile',
    format: 'markdown',
    sections: ['personal', 'profile', 'techStack', 'projects', 'experience'],
    style: 'professional'
  },
  academic_cv: {
    name: 'Academic CV',
    format: 'latex',
    sections: ['personal', 'education', 'experience', 'projects', 'openSource'],
    style: 'academic'
  },
  linkedin_summary: {
    name: 'LinkedIn Summary',
    format: 'linkedin',
    sections: ['profile', 'experience', 'techStack'],
    style: 'professional'
  },
  twitter_bio: {
    name: 'Twitter Bio',
    format: 'twitter',
    sections: ['personal', 'profile'],
    style: 'minimal'
  },
  tech_resume: {
    name: 'Tech Resume',
    format: 'markdown',
    sections: ['personal', 'profile', 'techStack', 'experience', 'projects', 'education'],
    style: 'professional',
    industry: 'technology'
  },
  creative_portfolio: {
    name: 'Creative Portfolio',
    format: 'markdown',
    sections: ['personal', 'profile', 'projects', 'experience'],
    style: 'creative'
  }
};

export function exportResume(resumeData: ResumeData, options: ExportOptions): string {
  const { format, template, customSections, includeContact = true, maxLength } = options;
  
  switch (format) {
    case 'markdown':
      return exportToMarkdown(resumeData, template, customSections, includeContact);
    case 'latex':
      return exportToLatex(resumeData, template, customSections, includeContact);
    case 'linkedin':
      return exportToLinkedIn(resumeData, maxLength);
    case 'twitter':
      return exportToTwitter(resumeData, maxLength);
    case 'jsonld':
      return exportToJsonLD(resumeData, template, customSections, includeContact);
    case 'ats':
      return exportToATS(resumeData, template, customSections, includeContact);
    case 'portfolio':
      return exportToPortfolio(resumeData, template, customSections, includeContact);
    case 'api':
      return exportToAPI(resumeData, template, customSections, includeContact);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

function exportToMarkdown(resumeData: ResumeData, template?: TemplateConfig, customSections?: SectionKey[], includeContact = true): string {
  const sections = customSections || template?.sections || Object.keys(resumeData) as SectionKey[];
  let markdown = '';
  
  // Header
  markdown += `# ${resumeData.personal.name}\n`;
  markdown += `## ${resumeData.personal.role}\n\n`;
  
  // Contact information
  if (includeContact) {
    markdown += '### Contact\n';
    markdown += `- **Location:** ${resumeData.personal.location}\n`;
    markdown += `- **Email:** [${resumeData.personal.email}](mailto:${resumeData.personal.email})\n`;
    markdown += `- **LinkedIn:** [${resumeData.personal.linkedin}](${resumeData.personal.linkedin})\n`;
    markdown += `- **GitHub:** [${resumeData.personal.github}](${resumeData.personal.github})\n`;
    if (resumeData.personal.portfolio) {
      markdown += `- **Portfolio:** [${resumeData.personal.portfolio}](${resumeData.personal.portfolio})\n`;
    }
    markdown += '\n';
  }
  
  // Profile/Summary
  if (sections.includes('profile')) {
    markdown += '## About Me\n';
    markdown += `${resumeData.profile}\n\n`;
  }
  
  // Tech Stack
  if (sections.includes('techStack')) {
    markdown += '## Technical Skills\n';
    markdown += resumeData.techStack.map(tech => `- ${tech}`).join('\n');
    markdown += '\n\n';
  }
  
  // Experience
  if (sections.includes('experience')) {
    markdown += '## Professional Experience\n\n';
    resumeData.experience.forEach(exp => {
      markdown += `### ${exp.title} at ${exp.company}\n`;
      markdown += `*${exp.dates}*\n\n`;
      exp.bullets.forEach(bullet => {
        markdown += `- ${bullet}\n`;
      });
      markdown += '\n';
    });
  }
  
  // Projects
  if (sections.includes('projects')) {
    markdown += '## Projects\n\n';
    resumeData.projects.forEach(project => {
      markdown += `### ${project.name}\n`;
      markdown += `${project.desc}\n\n`;
      markdown += `**Technologies:** ${project.tech}\n\n`;
    });
  }
  
  // Education
  if (sections.includes('education')) {
    markdown += '## Education\n\n';
    resumeData.education.forEach(edu => {
      markdown += `### ${edu.degree}\n`;
      markdown += `**${edu.school}** | *${edu.dates}*\n\n`;
      if (edu.details.length > 0) {
        edu.details.forEach(detail => {
          markdown += `- ${detail}\n`;
        });
        markdown += '\n';
      }
    });
  }
  
  // Leadership
  if (sections.includes('leadership') && resumeData.leadership.length > 0) {
    markdown += '## Leadership & Activities\n\n';
    resumeData.leadership.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += '\n';
  }
  
  // Open Source
  if (sections.includes('openSource') && resumeData.openSource.length > 0) {
    markdown += '## Open Source Contributions\n\n';
    resumeData.openSource.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += '\n';
  }
  
  return markdown;
}

function exportToLatex(resumeData: ResumeData, template?: TemplateConfig, customSections?: SectionKey[], includeContact = true): string {
  const sections = customSections || template?.sections || Object.keys(resumeData) as SectionKey[];
  let latex = '';
  
  // Document class and packages
  latex += '\\documentclass[11pt,a4paper]{article}\n';
  latex += '\\usepackage[utf8]{inputenc}\n';
  latex += '\\usepackage[margin=1in]{geometry}\n';
  latex += '\\usepackage{enumitem}\n';
  latex += '\\usepackage{hyperref}\n';
  latex += '\\usepackage{titlesec}\n';
  latex += '\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]\n';
  latex += '\\titleformat{\\subsection}{\\normalsize\\bfseries}{}{0em}{}\n';
  latex += '\\setlength{\\parindent}{0pt}\n';
  latex += '\\setlength{\\parskip}{6pt}\n\n';
  
  latex += '\\begin{document}\n\n';
  
  // Header
  latex += `\\begin{center}\n`;
  latex += `{\\LARGE \\textbf{${escapeLatex(resumeData.personal.name)}}}\\\\[0.5em]\n`;
  latex += `{\\large ${escapeLatex(resumeData.personal.role)}}\\\\[0.5em]\n`;
  
  if (includeContact) {
    latex += `${escapeLatex(resumeData.personal.location)} $\\bullet$ `;
    latex += `\\href{mailto:${resumeData.personal.email}}{${escapeLatex(resumeData.personal.email)}} $\\bullet$ `;
    latex += `\\href{${resumeData.personal.linkedin}}{LinkedIn} $\\bullet$ `;
    latex += `\\href{${resumeData.personal.github}}{GitHub}`;
    if (resumeData.personal.portfolio) {
      latex += ` $\\bullet$ \\href{${resumeData.personal.portfolio}}{Portfolio}`;
    }
    latex += '\\\\[1em]\n';
  }
  
  latex += '\\end{center}\n\n';
  
  // Profile/Summary
  if (sections.includes('profile')) {
    latex += '\\section{Summary}\n';
    latex += `${escapeLatex(resumeData.profile)}\n\n`;
  }
  
  // Education (typically first in academic CVs)
  if (sections.includes('education')) {
    latex += '\\section{Education}\n';
    resumeData.education.forEach(edu => {
      latex += `\\subsection{${escapeLatex(edu.degree)}}\n`;
      latex += `\\textbf{${escapeLatex(edu.school)}} \\hfill ${escapeLatex(edu.dates)}\n\n`;
      if (edu.details.length > 0) {
        latex += '\\begin{itemize}[leftmargin=*]\n';
        edu.details.forEach(detail => {
          latex += `\\item ${escapeLatex(detail)}\n`;
        });
        latex += '\\end{itemize}\n\n';
      }
    });
  }
  
  // Experience
  if (sections.includes('experience')) {
    latex += '\\section{Professional Experience}\n';
    resumeData.experience.forEach(exp => {
      latex += `\\subsection{${escapeLatex(exp.title)}}\n`;
      latex += `\\textbf{${escapeLatex(exp.company)}} \\hfill ${escapeLatex(exp.dates)}\n\n`;
      latex += '\\begin{itemize}[leftmargin=*]\n';
      exp.bullets.forEach(bullet => {
        latex += `\\item ${escapeLatex(bullet)}\n`;
      });
      latex += '\\end{itemize}\n\n';
    });
  }
  
  // Technical Skills
  if (sections.includes('techStack')) {
    latex += '\\section{Technical Skills}\n';
    latex += '\\begin{itemize}[leftmargin=*]\n';
    resumeData.techStack.forEach(tech => {
      latex += `\\item ${escapeLatex(tech)}\n`;
    });
    latex += '\\end{itemize}\n\n';
  }
  
  // Projects
  if (sections.includes('projects')) {
    latex += '\\section{Projects}\n';
    resumeData.projects.forEach(project => {
      latex += `\\subsection{${escapeLatex(project.name)}}\n`;
      latex += `${escapeLatex(project.desc)}\n\n`;
      latex += `\\textbf{Technologies:} ${escapeLatex(project.tech)}\n\n`;
    });
  }
  
  // Open Source
  if (sections.includes('openSource') && resumeData.openSource.length > 0) {
    latex += '\\section{Open Source Contributions}\n';
    latex += '\\begin{itemize}[leftmargin=*]\n';
    resumeData.openSource.forEach(item => {
      latex += `\\item ${escapeLatex(item)}\n`;
    });
    latex += '\\end{itemize}\n\n';
  }
  
  // Leadership
  if (sections.includes('leadership') && resumeData.leadership.length > 0) {
    latex += '\\section{Leadership \\& Activities}\n';
    latex += '\\begin{itemize}[leftmargin=*]\n';
    resumeData.leadership.forEach(item => {
      latex += `\\item ${escapeLatex(item)}\n`;
    });
    latex += '\\end{itemize}\n\n';
  }
  
  latex += '\\end{document}\n';
  
  return latex;
}

function exportToLinkedIn(resumeData: ResumeData, maxLength = 2000): string {
  let summary = '';
  
  // Professional headline
  summary += `${resumeData.personal.role} | `;
  
  // Key technologies (first 3-4)
  const keyTech = resumeData.techStack.slice(0, 4).join(', ');
  summary += `${keyTech}\n\n`;
  
  // Profile summary (truncated if needed)
  let profileText = resumeData.profile;
  if (profileText.length > 300) {
    profileText = profileText.substring(0, 297) + '...';
  }
  summary += `${profileText}\n\n`;
  
  // Key achievements from experience
  summary += '🚀 Key Achievements:\n';
  const achievements = resumeData.experience
    .flatMap(exp => exp.bullets)
    .slice(0, 3)
    .map(bullet => `• ${bullet}`);
  summary += achievements.join('\n') + '\n\n';
  
  // Notable projects
  if (resumeData.projects.length > 0) {
    summary += '💼 Notable Projects:\n';
    const topProjects = resumeData.projects.slice(0, 2);
    topProjects.forEach(project => {
      summary += `• ${project.name}: ${project.desc}\n`;
    });
    summary += '\n';
  }
  
  // Contact call-to-action
  summary += "Let's connect and discuss opportunities!";
  
  // Truncate if too long
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength - 3) + '...';
  }
  
  return summary;
}

function exportToTwitter(resumeData: ResumeData, maxLength = 160): string {
  let bio = '';
  
  // Role and key tech
  bio += `${resumeData.personal.role} | `;
  
  // Top 2-3 technologies
  const topTech = resumeData.techStack.slice(0, 3).join(', ');
  bio += `${topTech} | `;
  
  // Location
  bio += `📍 ${resumeData.personal.location}`;
  
  // Add portfolio/github if space allows
  const remaining = maxLength - bio.length;
  if (remaining > 20 && resumeData.personal.portfolio) {
    bio += ` | 🌐 ${resumeData.personal.portfolio}`;
  } else if (remaining > 20 && resumeData.personal.github) {
    bio += ` | 💻 ${resumeData.personal.github}`;
  }
  
  // Truncate if needed
  if (bio.length > maxLength) {
    bio = bio.substring(0, maxLength - 3) + '...';
  }
  
  return bio;
}

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[{}]/g, '\\$&')
    .replace(/[$%&_#^]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

export function getAvailableTemplates(): TemplateConfig[] {
  return Object.values(EXPORT_TEMPLATES);
}

export function getTemplateByName(name: string): TemplateConfig | undefined {
  return EXPORT_TEMPLATES[name];
}

/**
 * Export resume as JSON-LD structured data for SEO optimization
 */
function exportToJsonLD(resumeData: ResumeData, template?: TemplateConfig, customSections?: SectionKey[], includeContact = true): string {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": resumeData.personal.name,
    "jobTitle": resumeData.personal.role,
    "description": resumeData.profile,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": resumeData.personal.location
    },
    "email": resumeData.personal.email,
    "telephone": resumeData.personal.phone,
    "url": resumeData.personal.portfolio,
    "sameAs": [
      resumeData.personal.linkedin,
      resumeData.personal.github
    ],
    "knowsAbout": resumeData.techStack,
    "worksFor": resumeData.experience.map(exp => ({
      "@type": "Organization",
      "name": exp.company,
      "jobTitle": exp.title,
      "startDate": exp.dates.split(' - ')[0],
      "endDate": exp.dates.split(' - ')[1] || "Present"
    })),
    "alumniOf": resumeData.education.map(edu => ({
      "@type": "EducationalOrganization",
      "name": edu.school,
      "degree": edu.degree
    })),
    "hasCredential": resumeData.projects.map(project => ({
      "@type": "CreativeWork",
      "name": project.name,
      "description": project.desc,
      "keywords": project.tech
    }))
  };

  return JSON.stringify(jsonLD, null, 2);
}

/**
 * Export resume in ATS-friendly format (plain text, keyword optimized)
 */
function exportToATS(resumeData: ResumeData, template?: TemplateConfig, customSections?: SectionKey[], includeContact = true): string {
  const sections = customSections || template?.sections || Object.keys(resumeData) as SectionKey[];
  let atsText = '';

  // Header with contact info
  atsText += `${resumeData.personal.name}\n`;
  atsText += `${resumeData.personal.role}\n`;
  if (includeContact) {
    atsText += `${resumeData.personal.location}\n`;
    atsText += `${resumeData.personal.email} | ${resumeData.personal.phone}\n`;
    atsText += `${resumeData.personal.linkedin}\n`;
    atsText += `${resumeData.personal.github}\n`;
    if (resumeData.personal.portfolio) {
      atsText += `${resumeData.personal.portfolio}\n`;
    }
  }
  atsText += '\n';

  // Professional Summary
  if (sections.includes('profile')) {
    atsText += 'PROFESSIONAL SUMMARY\n';
    atsText += `${resumeData.profile}\n\n`;
  }

  // Technical Skills
  if (sections.includes('techStack')) {
    atsText += 'TECHNICAL SKILLS\n';
    atsText += resumeData.techStack.join(', ');
    atsText += '\n\n';
  }

  // Professional Experience
  if (sections.includes('experience')) {
    atsText += 'PROFESSIONAL EXPERIENCE\n';
    resumeData.experience.forEach(exp => {
      atsText += `${exp.title} | ${exp.company} | ${exp.dates}\n`;
      exp.bullets.forEach(bullet => {
        atsText += `• ${bullet}\n`;
      });
      atsText += '\n';
    });
  }

  // Projects
  if (sections.includes('projects')) {
    atsText += 'KEY PROJECTS\n';
    resumeData.projects.forEach(project => {
      atsText += `${project.name}\n`;
      atsText += `${project.desc}\n`;
      atsText += `Technologies: ${project.tech}\n\n`;
    });
  }

  // Education
  if (sections.includes('education')) {
    atsText += 'EDUCATION\n';
    resumeData.education.forEach(edu => {
      atsText += `${edu.degree} | ${edu.school} | ${edu.dates}\n`;
      if (edu.details.length > 0) {
        edu.details.forEach(detail => {
          atsText += `• ${detail}\n`;
        });
      }
      atsText += '\n';
    });
  }

  return atsText;
}

/**
 * Generate a complete portfolio website
 */
function exportToPortfolio(resumeData: ResumeData, template?: TemplateConfig, customSections?: SectionKey[], includeContact = true): string {
  const sections = customSections || template?.sections || Object.keys(resumeData) as SectionKey[];
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personal.name} - Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 60px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .header h1 { font-size: 3rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .section { margin: 60px 0; }
        .section h2 { font-size: 2rem; margin-bottom: 30px; color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .contact-item { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }
        .tech-stack { display: flex; flex-wrap: wrap; gap: 10px; }
        .tech-item { background: #3498db; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; }
        .experience-item, .project-item { background: #fff; border: 1px solid #e1e8ed; border-radius: 8px; padding: 25px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .experience-item h3, .project-item h3 { color: #2c3e50; margin-bottom: 10px; }
        .experience-meta { color: #7f8c8d; font-style: italic; margin-bottom: 15px; }
        .bullet-list { list-style: none; }
        .bullet-list li { margin: 8px 0; padding-left: 20px; position: relative; }
        .bullet-list li:before { content: '▸'; position: absolute; left: 0; color: #3498db; font-weight: bold; }
        .footer { text-align: center; padding: 40px 0; background: #2c3e50; color: white; margin-top: 60px; }
        @media (max-width: 768px) { .header h1 { font-size: 2rem; } .container { padding: 10px; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>${resumeData.personal.name}</h1>
            <p>${resumeData.personal.role}</p>
        </div>
    </div>

    <div class="container">
        ${includeContact ? `
        <div class="section">
            <h2>Contact</h2>
            <div class="contact-grid">
                <div class="contact-item">
                    <strong>Location</strong><br>${resumeData.personal.location}
                </div>
                <div class="contact-item">
                    <strong>Email</strong><br><a href="mailto:${resumeData.personal.email}">${resumeData.personal.email}</a>
                </div>
                <div class="contact-item">
                    <strong>LinkedIn</strong><br><a href="${resumeData.personal.linkedin}" target="_blank">View Profile</a>
                </div>
                <div class="contact-item">
                    <strong>GitHub</strong><br><a href="${resumeData.personal.github}" target="_blank">View Projects</a>
                </div>
            </div>
        </div>` : ''}

        ${sections.includes('profile') ? `
        <div class="section">
            <h2>About Me</h2>
            <p style="font-size: 1.1rem; line-height: 1.8;">${resumeData.profile}</p>
        </div>` : ''}

        ${sections.includes('techStack') ? `
        <div class="section">
            <h2>Technical Skills</h2>
            <div class="tech-stack">
                ${resumeData.techStack.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
            </div>
        </div>` : ''}

        ${sections.includes('experience') ? `
        <div class="section">
            <h2>Professional Experience</h2>
            ${resumeData.experience.map(exp => `
            <div class="experience-item">
                <h3>${exp.title}</h3>
                <div class="experience-meta">${exp.company} • ${exp.dates}</div>
                <ul class="bullet-list">
                    ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
            </div>`).join('')}
        </div>` : ''}

        ${sections.includes('projects') ? `
        <div class="section">
            <h2>Key Projects</h2>
            ${resumeData.projects.map(project => `
            <div class="project-item">
                <h3>${project.name}</h3>
                <p>${project.desc}</p>
                <p><strong>Technologies:</strong> ${project.tech}</p>
            </div>`).join('')}
        </div>` : ''}

        ${sections.includes('education') ? `
        <div class="section">
            <h2>Education</h2>
            ${resumeData.education.map(edu => `
            <div class="experience-item">
                <h3>${edu.degree}</h3>
                <div class="experience-meta">${edu.school} • ${edu.dates}</div>
                ${edu.details.length > 0 ? `
                <ul class="bullet-list">
                    ${edu.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>` : ''}
            </div>`).join('')}
        </div>` : ''}
    </div>

    <div class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${resumeData.personal.name}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

/**
 * Generate REST API endpoints for resume data
 */
function exportToAPI(resumeData: ResumeData, template?: TemplateConfig, customSections?: SectionKey[], includeContact = true): string {
  const apiSpec = {
    openapi: "3.0.0",
    info: {
      title: `${resumeData.personal.name} Resume API`,
      version: "1.0.0",
      description: "REST API for accessing resume data",
      contact: {
        name: resumeData.personal.name,
        email: resumeData.personal.email
      }
    },
    servers: [
      {
        url: "https://api.resume.dev",
        description: "Production server"
      }
    ],
    paths: {
      "/resume": {
        get: {
          summary: "Get complete resume data",
          responses: {
            "200": {
              description: "Complete resume information",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      personal: { type: "object" },
                      profile: { type: "string" },
                      techStack: { type: "array", items: { type: "string" } },
                      experience: { type: "array" },
                      projects: { type: "array" },
                      education: { type: "array" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resume/contact": {
        get: {
          summary: "Get contact information",
          responses: {
            "200": {
              description: "Contact details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      email: { type: "string" },
                      location: { type: "string" },
                      linkedin: { type: "string" },
                      github: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resume/experience": {
        get: {
          summary: "Get professional experience",
          responses: {
            "200": {
              description: "Work experience list",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        company: { type: "string" },
                        title: { type: "string" },
                        dates: { type: "string" },
                        bullets: { type: "array", items: { type: "string" } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/resume/skills": {
        get: {
          summary: "Get technical skills",
          responses: {
            "200": {
              description: "Technical skills list",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Resume: {
          type: "object",
          properties: {
            personal: {
              type: "object",
              properties: {
                name: { type: "string" },
                role: { type: "string" },
                location: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                linkedin: { type: "string" },
                github: { type: "string" },
                portfolio: { type: "string" }
              }
            },
            profile: { type: "string" },
            techStack: {
              type: "array",
              items: { type: "string" }
            },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  company: { type: "string" },
                  title: { type: "string" },
                  dates: { type: "string" },
                  bullets: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return JSON.stringify(apiSpec, null, 2);
}
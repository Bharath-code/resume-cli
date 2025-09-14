// Predefined templates for different industries and purposes
export const EXPORT_TEMPLATES = {
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
export function exportResume(resumeData, options) {
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
        default:
            throw new Error(`Unsupported export format: ${format}`);
    }
}
function exportToMarkdown(resumeData, template, customSections, includeContact = true) {
    const sections = customSections || template?.sections || Object.keys(resumeData);
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
function exportToLatex(resumeData, template, customSections, includeContact = true) {
    const sections = customSections || template?.sections || Object.keys(resumeData);
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
function exportToLinkedIn(resumeData, maxLength = 2000) {
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
function exportToTwitter(resumeData, maxLength = 160) {
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
    }
    else if (remaining > 20 && resumeData.personal.github) {
        bio += ` | 💻 ${resumeData.personal.github}`;
    }
    // Truncate if needed
    if (bio.length > maxLength) {
        bio = bio.substring(0, maxLength - 3) + '...';
    }
    return bio;
}
function escapeLatex(text) {
    return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/[{}]/g, '\\$&')
        .replace(/[$%&_#^]/g, '\\$&')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
}
export function getAvailableTemplates() {
    return Object.values(EXPORT_TEMPLATES);
}
export function getTemplateByName(name) {
    return Object.values(EXPORT_TEMPLATES).find(template => template.name === name);
}
//# sourceMappingURL=export.js.map
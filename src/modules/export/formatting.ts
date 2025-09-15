import chalk from 'chalk';
import boxen from 'boxen';
import puppeteer from 'puppeteer';
import { ResumeData, SectionKey, OutputFormat } from '../../data/types.js';
import { ThemeEngine } from '../theming/theme-engine.js';
import { ThemeModeManager } from '../theming/theme-mode.js';
import { loadConfig } from '../core/config.js';
import { 
  formatBoldText, 
  createSectionHeader, 
  formatBulletList, 
  formatContactInfo, 
  formatTechStack, 
  formatExperience, 
  formatProject, 
  formatEducation,
  stripMarkdown,
  markdownToHtml
} from '../../utils/formatting.js';

/**
 * Format resume with colors for terminal display
 */
export function formatColoredResume(data: ResumeData, sections?: SectionKey[]): string {
  const selectedSections = sections || ['personal', 'profile', 'techStack', 'experience', 'projects', 'leadership', 'openSource', 'education'];
  
  let output = '';
  
  if (selectedSections.includes('personal')) {
    const title = chalk.bold.hex("#ff6b6b")(data.personal.name);
    const role = chalk.bold(data.personal.role);
    const location = chalk.green(data.personal.location);
    const email = chalk.cyan(data.personal.email);
    const phone = chalk.yellow(data.personal.phone);
    const linkedin = chalk.blue(data.personal.linkedin);
    const github = chalk.blue(data.personal.github);
    const portfolio = chalk.underline(data.personal.portfolio);
    
    output += `${title}\n${role} ${chalk.white("•")} ${location}\n\n`;
    output += `${chalk.bold("Contact")}\n${email}  •  ${phone}\n${linkedin}\n${github}\n${portfolio}\n\n`;
  }
  
  if (selectedSections.includes('techStack')) {
    const techStackStr = data.techStack.join("  •  ");
    const boxedTech = boxen(chalk.yellowBright(techStackStr), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      textAlignment: "center"
    });
    output += `${boxedTech}\n\n`;
  }
  
  if (selectedSections.includes('profile')) {
    output += `${chalk.cyanBright.bold("Profile")}\n${chalk.white(data.profile)}\n\n`;
  }
  
  if (selectedSections.includes('experience')) {
    output += `${chalk.greenBright.bold("Experience")}\n`;
    data.experience.forEach(job => {
      const bullets = job.bullets.map(bullet => `    • ${formatBoldText(bullet)}`).join('\n');
      output += `\n  ${chalk.bold(job.company)} — ${job.title} (${job.dates})\n${bullets}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('projects')) {
    output += `${chalk.magentaBright.bold("Key Projects")}\n`;
    data.projects.forEach(project => {
      output += `\n  ${chalk.bold(project.name)}\n    ${project.desc}\n    ${chalk.dim(project.tech)}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('leadership')) {
    output += `${chalk.blueBright.bold("Leadership & Mentoring")}\n`;
    data.leadership.forEach(item => {
      output += `  • ${item}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('openSource')) {
    output += `${chalk.cyanBright.bold("Open-source & Community")}\n`;
    data.openSource.forEach(item => {
      output += `  • ${item}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('education')) {
    output += `${chalk.whiteBright.bold("Education")}\n`;
    data.education.forEach(edu => {
      const details = edu.details.map(detail => `    • ${detail}`).join('\n');
      output += `\n  ${chalk.bold(edu.degree)}\n  ${edu.school} (${edu.dates})\n${details}\n`;
    });
    output += '\n';
  }
  
  output += `${chalk.dim("Run 'npx bharathkumar-palanisamy' to print this resume.")}\n`;
  return output.trim();
}

/**
 * Format resume as plain text without colors
 */
export function formatPlainResume(data: ResumeData, sections?: SectionKey[]): string {
  const selectedSections = sections || ['personal', 'profile', 'techStack', 'experience', 'projects', 'leadership', 'openSource', 'education'];
  
  let output = '';
  
  if (selectedSections.includes('personal')) {
    output += `${data.personal.name}\n${data.personal.role} • ${data.personal.location}\n\n`;
    output += `Contact\n${data.personal.email}  •  ${data.personal.phone}\n${data.personal.linkedin}\n${data.personal.github}\n${data.personal.portfolio}\n\n`;
  }
  
  if (selectedSections.includes('techStack')) {
    const techStackStr = data.techStack.join("  •  ");
    output += `Tech Stack\n${techStackStr}\n\n`;
  }
  
  if (selectedSections.includes('profile')) {
    output += `Profile\n${stripMarkdown(data.profile)}\n\n`;
  }
  
  if (selectedSections.includes('experience')) {
    output += `Experience\n`;
    data.experience.forEach(job => {
      const bullets = job.bullets.map(bullet => `    • ${stripMarkdown(bullet)}`).join('\n');
      output += `\n  ${job.company} — ${job.title} (${job.dates})\n${bullets}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('projects')) {
    output += `Key Projects\n`;
    data.projects.forEach(project => {
      output += `\n  ${project.name}\n    ${stripMarkdown(project.desc)}\n    ${project.tech}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('leadership')) {
    output += `Leadership & Mentoring\n`;
    data.leadership.forEach(item => {
      output += `  • ${item}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('openSource')) {
    output += `Open-source & Community\n`;
    data.openSource.forEach(item => {
      output += `  • ${item}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('education')) {
    output += `Education\n`;
    data.education.forEach(edu => {
      const details = edu.details.map(detail => `    • ${detail}`).join('\n');
      output += `\n  ${edu.degree}\n  ${edu.school} (${edu.dates})\n${details}\n`;
    });
    output += '\n';
  }
  
  output += `Run 'npx bharathkumar-palanisamy' to print this resume.\n`;
  return output.trim();
}

/**
 * Format resume as JSON
 */
export function formatJsonResume(data: ResumeData, sections?: SectionKey[]): string {
  const selectedSections = sections || ['personal', 'profile', 'techStack', 'experience', 'projects', 'leadership', 'openSource', 'education'];
  
  const filteredData: Partial<ResumeData> = {};
  
  selectedSections.forEach(section => {
    if (data[section]) {
      (filteredData as any)[section] = data[section];
    }
  });
  
  return JSON.stringify(filteredData, null, 2);
}

export function formatHtmlResume(data: ResumeData, sections?: SectionKey[]): string {
  const selectedSections = sections || ['personal', 'profile', 'techStack', 'experience', 'projects', 'leadership', 'openSource', 'education'];
  
  // Load user config and get current theme
  const config = loadConfig();
  const currentTheme = ThemeEngine.getThemeById(config.theme) || ThemeEngine.getThemeById('modern-professional');
  const themeMode = ThemeModeManager.getCurrentMode();
  
  let htmlContent = '';
  
  if (selectedSections.includes('personal')) {
    htmlContent += `
    <header class="header">
      <h1 class="name">${data.personal.name}</h1>
      <p class="role">${data.personal.role}</p>
      <p class="location">${data.personal.location}</p>
      <div class="contact">
        <a href="mailto:${data.personal.email}">${data.personal.email}</a>
        <span>${data.personal.phone}</span>
        <a href="${data.personal.linkedin}" target="_blank">LinkedIn</a>
        <a href="${data.personal.github}" target="_blank">GitHub</a>
        <a href="${data.personal.portfolio}" target="_blank">Portfolio</a>
      </div>
    </header>`;
  }
  
  if (selectedSections.includes('profile')) {
    htmlContent += `
    <section class="section">
      <h2>Profile</h2>
      <p class="profile-text">${data.profile}</p>
    </section>`;
  }
  
  if (selectedSections.includes('techStack')) {
    htmlContent += `
    <section class="section">
      <h2>Tech Stack</h2>
      <div class="tech-stack">
        ${data.techStack.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
      </div>
    </section>`;
  }
  
  if (selectedSections.includes('experience')) {
    htmlContent += `
    <section class="section">
      <h2>Experience</h2>
      ${data.experience.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <h3>${exp.company}</h3>
            <span class="dates">${exp.dates}</span>
          </div>
          <p class="job-title">${exp.title}</p>
          <ul class="bullets">
            ${exp.bullets.map(bullet => `<li>${bullet.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>`;
  }
  
  if (selectedSections.includes('projects')) {
    htmlContent += `
    <section class="section">
      <h2>Key Projects</h2>
      ${data.projects.map(project => `
        <div class="project-item">
          <h3>${project.name}</h3>
          <p class="project-desc">${project.desc}</p>
          <p class="project-tech">${project.tech}</p>
        </div>
      `).join('')}
    </section>`;
  }
  
  if (selectedSections.includes('leadership')) {
    htmlContent += `
    <section class="section">
      <h2>Leadership & Mentoring</h2>
      <ul class="simple-list">
        ${data.leadership.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </section>`;
  }
  
  if (selectedSections.includes('openSource')) {
    htmlContent += `
    <section class="section">
      <h2>Open-source & Community</h2>
      <ul class="simple-list">
        ${data.openSource.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </section>`;
  }
  
  if (selectedSections.includes('education')) {
    htmlContent += `
    <section class="section">
      <h2>Education</h2>
      ${data.education.map(edu => `
        <div class="education-item">
          <h3>${edu.degree}</h3>
          <p class="school">${edu.school} (${edu.dates})</p>
          <ul class="simple-list">
            ${edu.details.map(detail => `<li>${detail}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>`;
  }
  
  // Apply theme to HTML content
  if (currentTheme) {
    const effectiveMode = themeMode === 'auto' ? ThemeModeManager.getEffectiveMode() : (themeMode === 'dark' ? 'dark' : 'light');
    return ThemeEngine.applyThemeToHTML(htmlContent, currentTheme, effectiveMode);
  }
  
  return htmlContent;
}

export async function formatPdfResume(data: ResumeData, sections?: SectionKey[]): Promise<Buffer> {
  const htmlContent = formatHtmlResume(data, sections);
  
  try {
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (error: any) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}
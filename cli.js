#!/usr/bin/env node
import chalk from "chalk";
import boxen from "boxen";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import qrcode from "qrcode";
import clipboardy from "clipboardy";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

/**
 * Full CLI resume for: Bharathkumar Palanisamy
 * - Full-Stack Engineer (JavaScript ecosystem)
 * - 5 years professional experience
 * - Career gap framed positively with projects / learning
 */

// Resume data structure
export const resumeData = {
  personal: {
    name: "Bharathkumar Palanisamy",
    role: "Full-Stack Engineer (JavaScript / Node.js & React)",
    location: "Bengaluru, India",
    email: "kumarbharath63@icloud.com",
    phone: "+91 8667861408",
    linkedin: "https://linkedin.com/in/bharathkumar-palanisamy",
    github: "https://github.com/Bharath-code/",
    portfolio: "https://bharathkumar.dev"
  },
  
  techStack: [
    "Node.js", "Express", "TypeScript", "Sveltekit", "React", "Next.js", "Astro", "Tailwind", "shadcnUI",
    "Postgres", "MongoDB", "Redis", "Docker", "Kubernetes",
    "GraphQL", "REST", "GitHub Actions", "AWS"
  ],
  
  profile: [
    "Full-Stack Engineer with 5 years of professional experience across the JavaScript ecosystem.",
    "I build end-to-end web applications and production APIs using Node.js, Express, React/Next.js and modern databases.",
    "I took a planned career break to focus on personal priorities while actively upskilling — building personal projects, contributing to open source, and staying current with modern tooling.",
    "Now actively seeking to re-enter the workforce and contribute as a focused, production-minded engineer."
  ].join(" "),

  experience: [
    {
      company: "Accenture",
      title: "Full-Stack Engineer",
      dates: "2019 — 2021",
      bullets: [
        "Built an enterprise-level **Code Scan Platform** from scratch that identified vulnerabilities in large-scale applications and suggested potential fixes.",
        "Designed and implemented secure, scalable REST APIs with **Node.js, Express, and MongoDB** to handle high-volume scan data.",
        "Developed **pixel-perfect frontends** by converting Figma designs into responsive React + Redux dashboards, ensuring design consistency and accessibility.",
        "Integrated CI/CD pipelines using **GitHub Actions and Docker**, reducing deployment times by 60% and minimizing production errors.",
        "Collaborated with product managers, security teams, and designers to deliver a compliant and enterprise-ready product."
      ]
    },
    {
      company: "Infosys",
      title: "Full-Stack Engineer",
      dates: "2015 — 2019",
      bullets: [
        "Worked with **major national banks** to design and deliver secure, high-performance features for customer-facing applications.",
        "Developed backend services in **Node.js/Express with PostgreSQL**, optimized queries, and introduced **Redis caching** to improve performance by 40%.",
        "Implemented **authentication flows (JWT, OAuth2)** and role-based access to meet banking compliance and security standards.",
        "Converted business requirements and **Figma wireframes into production-grade UIs** using React, HTML5, and CSS3.",
        "Collaborated in Agile sprints with QA and frontend teams to deliver new banking modules within strict deadlines."
      ]
    }
  ],

  projects: [
    {
      name: "Task & Reminder App (Personal)",
      desc: "Full-stack productivity app with grouping, reminders, and AI-generated subtasks to help focus and complete work.",
      tech: "Next.js • Node.js • MongoDB • TailwindCSS • Vercel"
    },
    {
      name: "Tab Focus Chrome Extension",
      desc: "Chrome extension to manage open tabs by encouraging focus and closing unused tabs (Manifest V3).",
      tech: "JavaScript • Chrome Extension APIs"
    },
    {
      name: "Portfolio & Blog",
      desc: "Personal portfolio built to showcase projects and write technical posts about modern JS tooling.",
      tech: "SvelteKit • Vercel • Markdown"
    }
  ],

  leadership: [
    "Mentored junior developers and reviewed PRs to improve code quality.",
    "Collaborated cross-functionally with QA and designers to ship polished features."
  ],

  openSource: [
    "Small npm package published for internal CI helpers.",
    "Contributed documentation fixes and small patches to open-source JavaScript libraries."
  ],

  education: [
    {
      degree: "B.E in Electrical and Electronics",
      school: "Sri Krishna College of Engineering and Technology",
      dates: "2011 – 2015",
      details: [
        "Graduated with First Class Honours"
      ]
    }
  ]
};

// Formatting helpers
function formatBoldText(text, useColors = true) {
  if (!useColors) {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  }
  return text.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
    return chalk.bold(p1);
  });
}

// Output formatters
function formatColoredResume(sections = null) {
  const data = resumeData;
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

function formatPlainResume(sections = null) {
  const data = resumeData;
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
    output += `Profile\n${data.profile}\n\n`;
  }
  
  if (selectedSections.includes('experience')) {
    output += `Experience\n`;
    data.experience.forEach(job => {
      const bullets = job.bullets.map(bullet => `    • ${formatBoldText(bullet, false)}`).join('\n');
      output += `\n  ${job.company} — ${job.title} (${job.dates})\n${bullets}\n`;
    });
    output += '\n';
  }
  
  if (selectedSections.includes('projects')) {
    output += `Key Projects\n`;
    data.projects.forEach(project => {
      output += `\n  ${project.name}\n    ${project.desc}\n    ${project.tech}\n`;
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

function formatJsonResume(sections = null) {
  const data = { ...resumeData };
  
  if (sections && sections.length > 0) {
    const filteredData = {};
    sections.forEach(section => {
      if (data[section]) {
        filteredData[section] = data[section];
      }
    });
    return JSON.stringify(filteredData, null, 2);
  }
  
  return JSON.stringify(data, null, 2);
}

function formatHtmlResume(sections = null) {
  const data = resumeData;
  const selectedSections = sections || ['personal', 'profile', 'techStack', 'experience', 'projects', 'leadership', 'openSource', 'education'];
  
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
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.personal.name} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .name {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .role {
      font-size: 1.3rem;
      color: #3498db;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .location {
      color: #7f8c8d;
      margin-bottom: 20px;
    }
    
    .contact {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .contact a, .contact span {
      color: #3498db;
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 5px;
      background: #ecf0f1;
      transition: background 0.3s;
    }
    
    .contact a:hover {
      background: #3498db;
      color: white;
    }
    
    .section {
      margin-bottom: 35px;
    }
    
    .section h2 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #bdc3c7;
    }
    
    .profile-text {
      font-size: 1.1rem;
      line-height: 1.7;
      color: #555;
    }
    
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .tech-item {
      background: #3498db;
      color: white;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .experience-item, .project-item, .education-item {
      margin-bottom: 25px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    
    .experience-header h3 {
      color: #2c3e50;
      font-size: 1.2rem;
    }
    
    .dates {
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .job-title {
      color: #3498db;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .bullets, .simple-list {
      list-style: none;
      padding-left: 0;
    }
    
    .bullets li, .simple-list li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    
    .bullets li:before {
      content: '▸';
      color: #3498db;
      position: absolute;
      left: 0;
    }
    
    .simple-list li:before {
      content: '•';
      color: #3498db;
      position: absolute;
      left: 0;
    }
    
    .project-item h3, .education-item h3 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .project-desc {
      margin-bottom: 10px;
      line-height: 1.6;
    }
    
    .project-tech {
      color: #7f8c8d;
      font-style: italic;
    }
    
    .school {
      color: #3498db;
      font-weight: 500;
      margin-bottom: 10px;
    }
    
    @media (max-width: 600px) {
      .contact {
        flex-direction: column;
        align-items: center;
      }
      
      .experience-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .name {
        font-size: 2rem;
      }
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .contact a {
        color: #333 !important;
      }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}

async function formatPdfResume(sections = null) {
  const htmlContent = formatHtmlResume(sections);
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
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
    return pdfBuffer;
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

// Command line interface
const program = new Command();

program
  .name('bharathkumar-palanisamy')
  .description('CLI resume for Bharathkumar Palanisamy - Full-Stack Engineer')
  .version(packageJson.version);

program
  .option('-f, --format <type>', 'output format (colored, plain, json, html, pdf)', 'colored')
  .option('-s, --section <sections...>', 'specific sections to display (personal, profile, techStack, experience, projects, leadership, openSource, education)')
  .option('-o, --output <file>', 'save resume to file')
  .option('-i, --interactive', 'enable interactive navigation mode')
  .action(async (options) => {
    // Handle interactive mode
    if (options.interactive) {
      await runInteractiveMode();
      return;
    }
    
    let output;
    let isBuffer = false;
    const sections = options.section;
    
    // Validate sections if provided
    if (sections) {
      const validSections = ['personal', 'profile', 'techStack', 'experience', 'projects', 'leadership', 'openSource', 'education'];
      const invalidSections = sections.filter(s => !validSections.includes(s));
      if (invalidSections.length > 0) {
        console.error(`Invalid sections: ${invalidSections.join(', ')}`);
        console.error(`Valid sections: ${validSections.join(', ')}`);
        process.exit(1);
      }
    }
    
    // Generate output based on format
    switch (options.format) {
      case 'json':
        output = formatJsonResume(sections);
        break;
      case 'plain':
        output = formatPlainResume(sections);
        break;
      case 'html':
        output = formatHtmlResume(sections);
        break;
      case 'pdf':
        try {
          output = await formatPdfResume(sections);
          isBuffer = true;
        } catch (error) {
          console.error(`Error generating PDF: ${error.message}`);
          process.exit(1);
        }
        break;
      case 'colored':
      default:
        output = formatColoredResume(sections);
        break;
    }
    
    // Output to file or console
    if (options.output) {
      try {
        if (isBuffer) {
          fs.writeFileSync(options.output, output);
        } else {
          fs.writeFileSync(options.output, output, 'utf8');
        }
        console.log(`Resume saved to ${options.output}`);
      } catch (error) {
        console.error(`Error writing to file: ${error.message}`);
        process.exit(1);
      }
    } else {
      if (isBuffer) {
        console.log('PDF format requires an output file. Use -o option to specify output file.');
      } else {
        console.log(output);
      }
    }
  });

// Interactive mode function
async function runInteractiveMode() {
  console.log(chalk.cyanBright.bold('\n🚀 Interactive Resume Navigator\n'));
  
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '📄 View Resume Sections', value: 'sections' },
          { name: '📱 Generate QR Codes', value: 'qr' },
          { name: '📋 Copy Contact Info', value: 'clipboard' },
          { name: '💾 Export Resume', value: 'export' },
          { name: '❌ Exit', value: 'exit' }
        ]
      }
    ]);
    
    switch (action) {
      case 'sections':
        await navigateSections();
        break;
      case 'qr':
        await generateQRCodes();
        break;
      case 'clipboard':
        await copyToClipboard();
        break;
      case 'export':
        await exportResume();
        break;
      case 'exit':
        console.log(chalk.greenBright('\n👋 Thanks for using the interactive resume!\n'));
        return;
    }
  }
}

// Navigate through resume sections
async function navigateSections() {
  const sectionChoices = [
    { name: '👤 Personal Info', value: 'personal' },
    { name: '📝 Profile', value: 'profile' },
    { name: '⚡ Tech Stack', value: 'techStack' },
    { name: '💼 Experience', value: 'experience' },
    { name: '🚀 Projects', value: 'projects' },
    { name: '👥 Leadership', value: 'leadership' },
    { name: '🌟 Open Source', value: 'openSource' },
    { name: '🎓 Education', value: 'education' },
    { name: '📄 Full Resume', value: 'full' },
    { name: '⬅️  Back to Main Menu', value: 'back' }
  ];
  
  while (true) {
    const { section } = await inquirer.prompt([
      {
        type: 'list',
        name: 'section',
        message: 'Which section would you like to view?',
        choices: sectionChoices
      }
    ]);
    
    if (section === 'back') break;
    
    console.log('\n' + '='.repeat(50));
    if (section === 'full') {
      console.log(formatColoredResume());
    } else {
      console.log(formatColoredResume([section]));
    }
    console.log('='.repeat(50) + '\n');
    
    // Ask if user wants to continue viewing sections
    const { continueViewing } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueViewing',
        message: 'Would you like to view another section?',
        default: true
      }
    ]);
    
    if (!continueViewing) break;
  }
}

// Generate QR codes for contact information
async function generateQRCodes() {
  const qrChoices = [
    { name: '📧 Email', value: 'email' },
    { name: '📱 Phone', value: 'phone' },
    { name: '💼 LinkedIn', value: 'linkedin' },
    { name: '🐙 GitHub', value: 'github' },
    { name: '🌐 Portfolio', value: 'portfolio' },
    { name: '⬅️  Back to Main Menu', value: 'back' }
  ];
  
  while (true) {
    const { contact } = await inquirer.prompt([
      {
        type: 'list',
        name: 'contact',
        message: 'Generate QR code for which contact method?',
        choices: qrChoices
      }
    ]);
    
    if (contact === 'back') break;
    
    let contactData = '';
    let contactLabel = '';
    
    switch (contact) {
      case 'email':
        contactData = `mailto:${resumeData.personal.email.replace('📧 ', '')}`;
        contactLabel = 'Email';
        break;
      case 'phone':
        contactData = `tel:${resumeData.personal.phone.replace('📱 ', '')}`;
        contactLabel = 'Phone';
        break;
      case 'linkedin':
        contactData = resumeData.personal.linkedin.replace('🔗 ', '');
        contactLabel = 'LinkedIn';
        break;
      case 'github':
        contactData = resumeData.personal.github.replace('🐙 ', '');
        contactLabel = 'GitHub';
        break;
      case 'portfolio':
        contactData = resumeData.personal.portfolio.replace('🌐 ', '');
        contactLabel = 'Portfolio';
        break;
    }
    
    try {
      console.log(`\n${chalk.cyanBright.bold(`QR Code for ${contactLabel}:`)}`);
      console.log(chalk.dim(`Data: ${contactData}\n`));
      
      const qrString = await qrcode.toString(contactData, {
        type: 'terminal',
        small: true
      });
      
      console.log(qrString);
      console.log(chalk.yellowBright('📱 Scan with your phone to access this contact info!\n'));
      
    } catch (error) {
      console.error(chalk.red(`Error generating QR code: ${error.message}`));
    }
    
    // Ask if user wants to generate another QR code
    const { continueQR } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueQR',
        message: 'Would you like to generate another QR code?',
        default: true
      }
    ]);
    
    if (!continueQR) break;
  }
}

// Copy contact information to clipboard
async function copyToClipboard() {
  const clipboardChoices = [
    { name: '📧 Email Address', value: 'email' },
    { name: '📱 Phone Number', value: 'phone' },
    { name: '💼 LinkedIn URL', value: 'linkedin' },
    { name: '🐙 GitHub URL', value: 'github' },
    { name: '🌐 Portfolio URL', value: 'portfolio' },
    { name: '📄 All Contact Info', value: 'all' },
    { name: '⬅️  Back to Main Menu', value: 'back' }
  ];
  
  while (true) {
    const { contact } = await inquirer.prompt([
      {
        type: 'list',
        name: 'contact',
        message: 'What would you like to copy to clipboard?',
        choices: clipboardChoices
      }
    ]);
    
    if (contact === 'back') break;
    
    let clipboardData = '';
    let contactLabel = '';
    
    switch (contact) {
      case 'email':
        clipboardData = resumeData.personal.email.replace('📧 ', '');
        contactLabel = 'Email address';
        break;
      case 'phone':
        clipboardData = resumeData.personal.phone.replace('📱 ', '');
        contactLabel = 'Phone number';
        break;
      case 'linkedin':
        clipboardData = resumeData.personal.linkedin.replace('🔗 ', '');
        contactLabel = 'LinkedIn URL';
        break;
      case 'github':
        clipboardData = resumeData.personal.github.replace('🐙 ', '');
        contactLabel = 'GitHub URL';
        break;
      case 'portfolio':
        clipboardData = resumeData.personal.portfolio.replace('🌐 ', '');
        contactLabel = 'Portfolio URL';
        break;
      case 'all':
        clipboardData = `Email: ${resumeData.personal.email.replace('📧 ', '')}\nPhone: ${resumeData.personal.phone.replace('📱 ', '')}\nLinkedIn: ${resumeData.personal.linkedin.replace('🔗 ', '')}\nGitHub: ${resumeData.personal.github.replace('🐙 ', '')}\nPortfolio: ${resumeData.personal.portfolio.replace('🌐 ', '')}`;
        contactLabel = 'All contact information';
        break;
    }
    
    try {
      await clipboardy.write(clipboardData);
      console.log(chalk.greenBright(`\n✅ ${contactLabel} copied to clipboard!`));
      console.log(chalk.dim(`Copied: ${clipboardData.split('\n')[0]}${clipboardData.includes('\n') ? '...' : ''}\n`));
    } catch (error) {
      console.error(chalk.red(`Error copying to clipboard: ${error.message}`));
    }
    
    // Ask if user wants to copy something else
    const { continueCopy } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continueCopy',
        message: 'Would you like to copy something else?',
        default: true
      }
    ]);
    
    if (!continueCopy) break;
  }
}

// Export resume in different formats
async function exportResume() {
  const { format } = await inquirer.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'Which format would you like to export?',
      choices: [
        { name: '🎨 Colored (Terminal)', value: 'colored' },
        { name: '📝 Plain Text', value: 'plain' },
        { name: '📊 JSON', value: 'json' },
        { name: '🌐 HTML (Web)', value: 'html' },
        { name: '📄 PDF (Print)', value: 'pdf' }
      ]
    }
  ]);
  
  const { filename } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filename',
      message: 'Enter filename (without extension):',
      default: 'bharathkumar-resume'
    }
  ]);
  
  const extensions = { colored: 'txt', plain: 'txt', json: 'json', html: 'html', pdf: 'pdf' };
  const fullFilename = `${filename}.${extensions[format]}`;
  
  let output;
  let isBuffer = false;
  
  try {
    switch (format) {
      case 'json':
        output = formatJsonResume();
        break;
      case 'plain':
        output = formatPlainResume();
        break;
      case 'html':
        output = formatHtmlResume();
        break;
      case 'pdf':
        console.log(chalk.yellowBright('\n⏳ Generating PDF... This may take a moment.'));
        output = await formatPdfResume();
        isBuffer = true;
        break;
      case 'colored':
      default:
        output = formatColoredResume();
        break;
    }
    
    if (isBuffer) {
      fs.writeFileSync(fullFilename, output);
    } else {
      fs.writeFileSync(fullFilename, output, 'utf8');
    }
    
    console.log(chalk.greenBright(`\n✅ Resume exported to ${fullFilename}!\n`));
    
    if (format === 'html') {
      console.log(chalk.cyanBright('💡 Tip: Open the HTML file in your browser to view the styled resume.\n'));
    } else if (format === 'pdf') {
      console.log(chalk.cyanBright('💡 Tip: The PDF is ready for printing or sharing professionally.\n'));
    }
  } catch (error) {
    console.error(chalk.red(`\nError exporting resume: ${error.message}\n`));
  }
}

program.parse();

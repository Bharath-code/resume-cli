#!/usr/bin/env node
import chalk from "chalk";
import boxen from "boxen";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
const resumeData = {
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

// Command line interface
const program = new Command();

program
  .name('bharathkumar-palanisamy')
  .description('CLI resume for Bharathkumar Palanisamy - Full-Stack Engineer')
  .version(packageJson.version);

program
  .option('-f, --format <type>', 'output format (colored, plain, json)', 'colored')
  .option('-s, --section <sections...>', 'specific sections to display (personal, profile, techStack, experience, projects, leadership, openSource, education)')
  .option('-o, --output <file>', 'save resume to file')
  .action((options) => {
    let output;
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
      case 'colored':
      default:
        output = formatColoredResume(sections);
        break;
    }
    
    // Output to file or console
    if (options.output) {
      try {
        fs.writeFileSync(options.output, output);
        console.log(`Resume saved to ${options.output}`);
      } catch (error) {
        console.error(`Error writing to file: ${error.message}`);
        process.exit(1);
      }
    } else {
      console.log(output);
    }
  });

program.parse();

#!/usr/bin/env node
import chalk from "chalk";
import boxen from "boxen";

/**
 * Full CLI resume for: Bharathkumar Palanisamy
 * - Full-Stack Engineer (JavaScript ecosystem)
 * - 5 years professional experience
 * - Career gap framed positively with projects / learning
 *
 * NOTE: replace placeholders (email, phone, github, portfolio) before publishing.
 */

const title = chalk.bold.hex("#ff6b6b")("Bharathkumar Palanisamy");
const role = chalk.bold("Full-Stack Engineer (JavaScript / Node.js & React)");
const location = chalk.green("Bengaluru, India");

const email = chalk.cyan("kumarbharath63@icloud.com");
const phone = chalk.yellow("+91 8667861408");
const linkedin = chalk.blue("https://linkedin.com/in/bharathkumar-palanisamy");
const github = chalk.blue("https://github.com/Bharath-code/");
const portfolio = chalk.underline("https://bharathkumar.dev");

/* Tech stack */
const techStack = [
  "Node.js", "Express", "TypeScript","Sveltekit", "React", "Next.js","Astro","Tailwind","shadcnUI",
  "Postgres", "MongoDB", "Redis", "Docker", "Kubernetes",
  "GraphQL", "REST", "GitHub Actions", "AWS"
].join("  •  ");

/* Profile (includes career gap framing) */
const profile = [
  "Full-Stack Engineer with 5 years of professional experience across the JavaScript ecosystem.",
  "I build end-to-end web applications and production APIs using Node.js, Express, React/Next.js and modern databases.",
  "I took a planned career break to focus on personal priorities while actively upskilling — building personal projects, contributing to open source, and staying current with modern tooling.",
  "Now actively seeking to re-enter the workforce and contribute as a focused, production-minded engineer."
].join(" ");

/* Experience (strong 5-year history) */
const experience = [
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
];


/* Projects (bridge the gap; recent personal work) */
const projects = [
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
];

/* Leadership & mentoring (concise) */
const leadership = [
  "Mentored junior developers and reviewed PRs to improve code quality.",
  "Collaborated cross-functionally with QA and designers to ship polished features."
];

/* Open source */
const openSource = [
  "Small npm package published for internal CI helpers.",
  "Contributed documentation fixes and small patches to open-source JavaScript libraries."
];

/* Education (bright, no dim) */
const education = [
  {
    degree: "B.E in Electrical and Electronics",
    school: "Sri Krishna College of Engineering and Technology",
    dates: "2011 – 2015",
    details: [
      "Graduated with First Class Honours",
    ]
  }
];

/* Formatting helpers */
function formatBoldText(text) {
  return text.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    return chalk.yellowBright.bold(content);
  });
}

function formatExperience() {
  return experience.map(e => {
    const header = chalk.greenBright.bold(`${e.company} — ${e.title} (${e.dates})`);
    const bullets = e.bullets.map(b => {
      const formattedText = formatBoldText(b);
      return chalk.white(`  • ${formattedText}`);
    }).join("\n");
    return `${header}\n${bullets}\n`;
  }).join("\n");
}

function formatProjects() {
  return projects.map(p => {
    const name = chalk.magentaBright.bold(p.name);
    const desc = chalk.white(`  • ${p.desc}`);
    const tech = chalk.white(`  • ${p.tech}`);
    return `${name}\n${desc}\n${tech}\n`;
  }).join("\n");
}

function formatList(arr, colorFn) {
  return arr.map(i => chalk.white(`  • ${i}`)).join("\n");
}

function formatEducation() {
  return education.map(ed => {
    const header = chalk.whiteBright.bold(`${ed.degree} — ${ed.school} (${ed.dates})`);
    const details = ed.details.map(d => chalk.white(`  • ${d}`)).join("\n");
    return `${header}\n${details}\n`;
  }).join("\n");
}

/* box for tech stack (high contrast yellow bright) */
const boxedTech = boxen(chalk.yellowBright(techStack), {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  textAlignment: "center"
});

/* Build final output with high-contrast headings and bright content */
const output = `
${title}
${role} ${chalk.white("•")} ${location}

${chalk.bold("Contact")}
${email}  •  ${phone}
${linkedin}
${github}
${portfolio}

${boxedTech}

${chalk.cyanBright.bold("Profile")}
${chalk.white(profile)}

${chalk.yellowBright.bold("Core Skills")}
${chalk.white(techStack)}

${chalk.greenBright.bold("Experience")}
${formatExperience()}

${chalk.magentaBright.bold("Key Projects")}
${formatProjects()}

${chalk.blueBright.bold("Leadership & Mentoring")}
${formatList(leadership)}

${chalk.cyanBright.bold("Open-source & Community")}
${formatList(openSource)}

${chalk.whiteBright.bold("Education")}
${formatEducation()}

${chalk.dim("Run 'npx @bharathkumar-palanisamy' to print this resume.")}
`.trim();

/* Print to terminal */
console.log(output);

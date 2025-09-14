import chalk from 'chalk';
/**
 * Format bold text with optional colors
 */
export function formatBoldText(text, useColors = true) {
    return text.replace(/\*\*(.*?)\*\*/g, (match, content) => {
        return useColors ? chalk.bold.cyan(content) : content;
    });
}
/**
 * Create a section header with consistent styling
 */
export function createSectionHeader(title, useColors = true) {
    if (useColors) {
        return chalk.bold.blue(`\n${title.toUpperCase()}`);
    }
    return `\n${title.toUpperCase()}`;
}
/**
 * Format a list of items with bullet points
 */
export function formatBulletList(items, useColors = true) {
    return items.map(item => {
        const formattedItem = formatBoldText(item, useColors);
        return useColors ? `  ${chalk.dim('•')} ${formattedItem}` : `  • ${formattedItem}`;
    }).join('\n');
}
/**
 * Format contact information
 */
export function formatContactInfo(label, value, useColors = true) {
    if (useColors) {
        return `${chalk.bold.yellow(label)}: ${chalk.cyan(value)}`;
    }
    return `${label}: ${value}`;
}
/**
 * Format tech stack as a comma-separated list
 */
export function formatTechStack(techStack, useColors = true) {
    if (useColors) {
        return techStack.map(tech => chalk.green(tech)).join(', ');
    }
    return techStack.join(', ');
}
/**
 * Format experience entry
 */
export function formatExperience(company, title, dates, bullets, useColors = true) {
    const header = useColors
        ? `${chalk.bold.white(company)} — ${chalk.italic.gray(title)} (${chalk.dim(dates)})`
        : `${company} — ${title} (${dates})`;
    const bulletList = formatBulletList(bullets, useColors);
    return `${header}\n${bulletList}`;
}
/**
 * Format project entry
 */
export function formatProject(name, desc, tech, useColors = true) {
    const header = useColors ? chalk.bold.white(name) : name;
    const description = formatBoldText(desc, useColors);
    const techLine = useColors ? chalk.dim(`Tech: ${tech}`) : `Tech: ${tech}`;
    return `${header}\n  ${description}\n  ${techLine}`;
}
/**
 * Format education entry
 */
export function formatEducation(degree, school, dates, details, useColors = true) {
    const header = useColors
        ? `${chalk.bold.white(degree)} — ${chalk.italic.gray(school)} (${chalk.dim(dates)})`
        : `${degree} — ${school} (${dates})`;
    if (details.length === 0) {
        return header;
    }
    const detailsList = formatBulletList(details, useColors);
    return `${header}\n${detailsList}`;
}
/**
 * Remove markdown formatting for plain text output
 */
export function stripMarkdown(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
}
/**
 * Convert markdown to HTML
 */
export function markdownToHtml(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
//# sourceMappingURL=formatting.js.map
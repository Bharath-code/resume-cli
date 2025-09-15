import chalk from 'chalk';
import { getThemeColors } from '../core/config.js';
/**
 * Calculate resume statistics
 */
export function calculateResumeStats(resumeData) {
    // Calculate years of experience
    const yearsOfExperience = calculateYearsOfExperience(resumeData.experience);
    // Count projects
    const projectCount = resumeData.projects.length;
    // Count tech stack size
    const techStackSize = resumeData.techStack.length;
    // Count total companies
    const totalCompanies = resumeData.experience.length;
    // Count education entries
    const educationCount = resumeData.education.length;
    return {
        yearsOfExperience,
        projectCount,
        techStackSize,
        totalCompanies,
        educationCount
    };
}
/**
 * Calculate years of experience from experience array
 */
function calculateYearsOfExperience(experience) {
    let totalMonths = 0;
    experience.forEach(exp => {
        const months = parseExperienceDates(exp.dates);
        totalMonths += months;
    });
    return Math.round((totalMonths / 12) * 10) / 10; // Round to 1 decimal place
}
/**
 * Parse experience dates and calculate months
 */
function parseExperienceDates(dates) {
    try {
        // Handle formats like "2019 — 2021" or "2015 — 2019"
        const parts = dates.split(' — ');
        if (parts.length !== 2)
            return 0;
        const startYear = parseInt(parts[0].trim());
        const endYear = parseInt(parts[1].trim());
        if (isNaN(startYear) || isNaN(endYear))
            return 0;
        // Assume full years for simplicity
        return (endYear - startYear) * 12;
    }
    catch (error) {
        return 0;
    }
}
/**
 * Display formatted resume statistics
 */
export function displayResumeStats(stats, config) {
    const colors = config ? getStatsColors(config) : {
        primary: 'cyanBright',
        secondary: 'blueBright',
        accent: 'greenBright'
    };
    const primaryColor = chalk[colors.primary] || chalk.cyan;
    console.log(primaryColor.bold('\n📊 Resume Statistics\n'));
    const statsData = [
        { label: '💼 Years of Experience', value: `${stats.yearsOfExperience} years`, color: colors.accent },
        { label: '🚀 Projects Completed', value: stats.projectCount.toString(), color: colors.secondary },
        { label: '⚡ Technologies Mastered', value: stats.techStackSize.toString(), color: colors.accent },
        { label: '🏢 Companies Worked', value: stats.totalCompanies.toString(), color: colors.secondary },
        { label: '🎓 Education Credentials', value: stats.educationCount.toString(), color: colors.accent }
    ];
    statsData.forEach(stat => {
        const statColor = chalk[stat.color] || chalk.green;
        console.log(`${chalk.white(stat.label)}: ${statColor.bold(stat.value)}`);
    });
    console.log();
}
/**
 * Get detailed technology breakdown
 */
export function getTechBreakdown(resumeData) {
    const breakdown = {
        'Frontend': [],
        'Backend': [],
        'Database': [],
        'DevOps': [],
        'Other': []
    };
    const categories = {
        'Frontend': ['React', 'Next.js', 'Sveltekit', 'Astro', 'Tailwind', 'shadcnUI', 'HTML', 'CSS', 'JavaScript', 'TypeScript'],
        'Backend': ['Node.js', 'Express', 'GraphQL', 'REST'],
        'Database': ['Postgres', 'MongoDB', 'Redis'],
        'DevOps': ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS']
    };
    resumeData.techStack.forEach(tech => {
        let categorized = false;
        for (const [category, techs] of Object.entries(categories)) {
            if (techs.some(t => tech.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(tech.toLowerCase()))) {
                breakdown[category].push(tech);
                categorized = true;
                break;
            }
        }
        if (!categorized) {
            breakdown['Other'].push(tech);
        }
    });
    return breakdown;
}
/**
 * Display technology breakdown
 */
export function displayTechBreakdown(resumeData, config) {
    const breakdown = getTechBreakdown(resumeData);
    const colors = config ? getStatsColors(config) : {
        primary: 'cyanBright',
        secondary: 'blueBright',
        accent: 'greenBright'
    };
    const primaryColor = chalk[colors.primary] || chalk.cyan;
    const secondaryColor = chalk[colors.secondary] || chalk.blue;
    const accentColor = chalk[colors.accent] || chalk.green;
    console.log(primaryColor.bold('\n🛠️  Technology Breakdown\n'));
    Object.entries(breakdown).forEach(([category, techs]) => {
        if (techs.length > 0) {
            console.log(`${secondaryColor.bold(category)} (${techs.length}):`);
            console.log(`  ${techs.map(tech => accentColor(tech)).join(', ')}\n`);
        }
    });
}
/**
 * Get experience timeline
 */
export function getExperienceTimeline(resumeData) {
    return resumeData.experience.map(exp => ({
        company: exp.company,
        title: exp.title,
        duration: exp.dates,
        years: parseExperienceDates(exp.dates) / 12
    })).sort((a, b) => {
        // Sort by start year (extract from duration)
        const aYear = parseInt(a.duration.split(' — ')[0]);
        const bYear = parseInt(b.duration.split(' — ')[0]);
        return bYear - aYear; // Most recent first
    });
}
/**
 * Display experience timeline
 */
export function displayExperienceTimeline(resumeData, config) {
    const timeline = getExperienceTimeline(resumeData);
    const colors = config ? getStatsColors(config) : {
        primary: 'cyanBright',
        secondary: 'blueBright',
        accent: 'greenBright'
    };
    const primaryColor = chalk[colors.primary] || chalk.cyan;
    const secondaryColor = chalk[colors.secondary] || chalk.blue;
    const accentColor = chalk[colors.accent] || chalk.green;
    console.log(primaryColor.bold('\n📅 Experience Timeline\n'));
    timeline.forEach((exp, index) => {
        const yearText = exp.years === 1 ? 'year' : 'years';
        console.log(`${secondaryColor.bold(`${index + 1}. ${exp.company}`)}`);
        console.log(`   ${chalk.white(exp.title)}`);
        console.log(`   ${accentColor(exp.duration)} (${exp.years} ${yearText})\n`);
    });
}
/**
 * Get stats colors based on theme
 */
function getStatsColors(config) {
    return getThemeColors(config);
}
//# sourceMappingURL=statistics.js.map
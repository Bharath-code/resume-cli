import chalk from 'chalk';
import inquirer from 'inquirer';
import { getThemeColors } from '../core/config.js';
import { ATSScoreCalculator } from '../analysis/ats-score.js';
import { KeywordOptimizer } from '../analysis/keyword-optimizer.js';
import { calculateResumeStats, displayResumeStats, displayTechBreakdown, displayExperienceTimeline } from '../export/statistics.js';
import { GitHubAnalyticsEngine } from '../analysis/github-analytics.js';
/**
 * Show comprehensive statistics
 */
export async function showStatistics(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    while (true) {
        const { statsAction } = await inquirer.prompt([
            {
                type: 'list',
                name: 'statsAction',
                message: 'Statistics & Analytics:',
                choices: [
                    { name: '📊 Resume Analytics Dashboard', value: 'dashboard' },
                    { name: '🎯 ATS Compatibility Score', value: 'ats' },
                    { name: '🔍 Keyword Analysis', value: 'keywords' },
                    { name: '📏 Resume Length Analysis', value: 'length' },
                    { name: '📈 Performance Metrics', value: 'performance' },
                    { name: '🐙 GitHub Analytics', value: 'github' },
                    { name: '🔙 Back to Main Menu', value: 'back' }
                ]
            }
        ]);
        if (statsAction === 'back') {
            return;
        }
        switch (statsAction) {
            case 'dashboard':
                await showAnalyticsDashboard(resumeData);
                break;
            case 'ats':
                await showATSScore(resumeData);
                break;
            case 'keywords':
                await analyzeKeywords(resumeData);
                break;
            case 'length':
                await analyzeLengthMetrics(resumeData);
                break;
            case 'github':
                await analyzeGitHubProfile(resumeData);
                break;
            case 'performance':
                await showPerformanceMetrics(resumeData);
                break;
        }
    }
}
/**
 * Show analytics dashboard
 */
export async function showAnalyticsDashboard(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📊 Resume Analytics Dashboard\n'));
    // Display comprehensive resume statistics
    const stats = calculateResumeStats(resumeData);
    displayResumeStats(stats);
    // Display technology breakdown
    console.log(chalk[colors.primary].bold('\n🔧 Technology Breakdown'));
    displayTechBreakdown(resumeData);
    // Display experience timeline
    console.log(chalk[colors.primary].bold('\n📈 Experience Timeline'));
    displayExperienceTimeline(resumeData);
    // Quick ATS preview
    const atsCalculator = new ATSScoreCalculator();
    const mockJob = {
        title: 'Software Engineer',
        company: 'Tech Company',
        description: 'Software development position',
        requirements: ['JavaScript', 'React', 'Node.js'],
        preferredSkills: ['TypeScript', 'AWS', 'Docker'],
        keywords: ['development', 'programming', 'software']
    };
    const atsResult = atsCalculator.calculateScore(resumeData, mockJob);
    console.log(chalk[colors.primary].bold('\n🎯 Quick ATS Score Preview'));
    console.log(chalk[colors.accent](`Overall Score: ${atsResult.overallScore}%`));
    console.log(chalk[colors.secondary]('💡 Use "ATS Compatibility Score" for detailed analysis\n'));
}
/**
 * Show ATS compatibility score
 */
export async function showATSScore(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n🎯 ATS Compatibility Analysis\n'));
    // Get job description from user
    const { jobDescription } = await inquirer.prompt([
        {
            type: 'input',
            name: 'jobDescription',
            message: 'Enter job description (or press Enter for general analysis):',
            default: ''
        }
    ]);
    const atsCalculator = new ATSScoreCalculator();
    if (jobDescription.trim()) {
        // Analyze against specific job description
        const job = {
            title: 'Target Position',
            company: 'Target Company',
            description: jobDescription,
            requirements: extractKeywords(jobDescription, 'requirements'),
            preferredSkills: extractKeywords(jobDescription, 'skills'),
            keywords: extractKeywords(jobDescription, 'general')
        };
        const result = atsCalculator.calculateScore(resumeData, job);
        displayATSResults(result, colors);
    }
    else {
        // General ATS analysis
        const generalJob = {
            title: 'Software Engineer',
            company: 'Tech Company',
            description: 'General software development position requiring programming skills',
            requirements: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
            preferredSkills: ['TypeScript', 'AWS', 'Docker', 'Git', 'Agile'],
            keywords: ['development', 'programming', 'software', 'engineering', 'coding']
        };
        const result = atsCalculator.calculateScore(resumeData, generalJob);
        console.log(chalk[colors.secondary]('📋 General ATS Analysis (Software Engineering Focus)\n'));
        displayATSResults(result, colors);
    }
}
/**
 * Analyze keywords
 */
export async function analyzeKeywords(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n🔍 Keyword Analysis\n'));
    const { industry, role } = await inquirer.prompt([
        {
            type: 'list',
            name: 'industry',
            message: 'Select your target industry:',
            choices: [
                { name: '💻 Technology', value: 'technology' },
                { name: '📈 Marketing', value: 'marketing' },
                { name: '💰 Finance', value: 'finance' },
                { name: '🔧 General Analysis', value: 'general' }
            ]
        },
        {
            type: 'input',
            name: 'role',
            message: 'Enter target role (optional):',
            default: ''
        }
    ]);
    const keywordOptimizer = new KeywordOptimizer();
    const options = {
        industry: industry === 'general' ? undefined : industry,
        role: role.trim() || undefined
    };
    const analysis = keywordOptimizer.analyzeKeywords(resumeData, undefined, options);
    // Display results
    console.log(chalk[colors.accent].bold(`📊 Keyword Score: ${analysis.score}%\n`));
    console.log(chalk[colors.primary].bold('✅ Current Keywords:'));
    analysis.currentKeywords.slice(0, 10).forEach(keyword => {
        console.log(chalk[colors.secondary](`  • ${keyword}`));
    });
    if (analysis.missingKeywords.length > 0) {
        console.log(chalk[colors.primary].bold('\n❌ Missing High-Impact Keywords:'));
        analysis.missingKeywords.slice(0, 8).forEach(suggestion => {
            const priorityColor = suggestion.priority === 'high' ? colors.accent :
                suggestion.priority === 'medium' ? colors.secondary : colors.muted;
            console.log(chalk[priorityColor](`  • ${suggestion.keyword} (${suggestion.category})`));
        });
    }
    if (analysis.overusedKeywords.length > 0) {
        console.log(chalk[colors.primary].bold('\n⚠️  Overused Keywords:'));
        analysis.overusedKeywords.forEach(keyword => {
            console.log(chalk[colors.muted](`  • ${keyword}`));
        });
    }
    console.log();
}
/**
 * Analyze length metrics
 */
export async function analyzeLengthMetrics(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📏 Resume Length Analysis\n'));
    // Calculate content lengths
    const summaryLength = resumeData.profile.length;
    const experienceLength = resumeData.experience.reduce((total, exp) => total + exp.bullets.join(' ').length, 0);
    const projectsLength = resumeData.projects.reduce((total, proj) => total + proj.desc.length, 0);
    const totalLength = summaryLength + experienceLength + projectsLength;
    console.log(chalk[colors.accent].bold('📊 Content Length Analysis:'));
    console.log(chalk[colors.secondary](`📝 Summary: ${summaryLength} characters`));
    console.log(chalk[colors.secondary](`💼 Experience: ${experienceLength} characters`));
    console.log(chalk[colors.secondary](`🚀 Projects: ${projectsLength} characters`));
    console.log(chalk[colors.primary].bold(`📏 Total Content: ${totalLength} characters\n`));
    // Provide recommendations
    console.log(chalk[colors.primary].bold('💡 Recommendations:'));
    if (summaryLength < 100) {
        console.log(chalk[colors.accent]('  • Consider expanding your summary (aim for 100-200 characters)'));
    }
    else if (summaryLength > 300) {
        console.log(chalk[colors.accent]('  • Consider condensing your summary (aim for 100-200 characters)'));
    }
    else {
        console.log(chalk[colors.secondary]('  ✅ Summary length is optimal'));
    }
    if (totalLength < 1000) {
        console.log(chalk[colors.accent]('  • Add more detail to experience and projects'));
    }
    else if (totalLength > 3000) {
        console.log(chalk[colors.accent]('  • Consider condensing content for better readability'));
    }
    else {
        console.log(chalk[colors.secondary]('  ✅ Overall content length is good'));
    }
    console.log();
}
/**
 * Show performance metrics
 */
export async function showPerformanceMetrics(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📈 Performance Metrics\n'));
    // Calculate various performance metrics
    const stats = calculateResumeStats(resumeData);
    const keywordOptimizer = new KeywordOptimizer();
    const keywordAnalysis = keywordOptimizer.analyzeKeywords(resumeData);
    console.log(chalk[colors.accent].bold('🎯 Resume Performance Score:'));
    // Overall performance calculation
    const experienceScore = Math.min(stats.yearsOfExperience * 10, 100);
    const projectScore = Math.min(stats.projectCount * 15, 100);
    const techScore = Math.min(stats.techStackSize * 5, 100);
    const keywordScore = keywordAnalysis.score;
    const overallScore = Math.round((experienceScore + projectScore + techScore + keywordScore) / 4);
    console.log(chalk[colors.primary](`📊 Overall Score: ${overallScore}%`));
    console.log(chalk[colors.secondary](`💼 Experience Score: ${experienceScore}%`));
    console.log(chalk[colors.secondary](`🚀 Project Score: ${projectScore}%`));
    console.log(chalk[colors.secondary](`⚡ Technology Score: ${techScore}%`));
    console.log(chalk[colors.secondary](`🔍 Keyword Score: ${keywordScore}%\n`));
    // Performance insights
    console.log(chalk[colors.primary].bold('💡 Performance Insights:'));
    if (overallScore >= 80) {
        console.log(chalk[colors.accent]('  🌟 Excellent! Your resume shows strong performance across all metrics'));
    }
    else if (overallScore >= 60) {
        console.log(chalk[colors.secondary]('  👍 Good performance with room for improvement'));
    }
    else {
        console.log(chalk[colors.accent]('  📈 Consider focusing on the lower-scoring areas for improvement'));
    }
    // Specific recommendations
    if (experienceScore < 50) {
        console.log(chalk[colors.secondary]('  • Add more detailed experience descriptions'));
    }
    if (projectScore < 50) {
        console.log(chalk[colors.secondary]('  • Include more projects to showcase your skills'));
    }
    if (techScore < 50) {
        console.log(chalk[colors.secondary]('  • Expand your technology stack section'));
    }
    if (keywordScore < 50) {
        console.log(chalk[colors.secondary]('  • Optimize keywords for better ATS compatibility'));
    }
    console.log();
}
/**
 * Analyze GitHub profile
 */
export async function analyzeGitHubProfile(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📊 GitHub Analytics\n'));
    // Extract GitHub username from resume data
    let githubUsername = '';
    if (resumeData.personal?.github) {
        const githubUrl = resumeData.personal.github;
        const match = githubUrl.match(/github\.com\/([^/]+)/);
        if (match) {
            githubUsername = match[1];
        }
    }
    if (!githubUsername) {
        const { username } = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Enter GitHub username:',
                validate: (input) => {
                    if (!input.trim())
                        return 'GitHub username is required';
                    return true;
                }
            }
        ]);
        githubUsername = username;
    }
    try {
        console.log(chalk[colors.secondary](`Fetching GitHub analytics for ${githubUsername}...\n`));
        const githubEngine = new GitHubAnalyticsEngine();
        const options = {
            username: githubUsername,
            maxRepos: 10
        };
        const analytics = await githubEngine.generateAnalytics(options);
        const formattedAnalytics = githubEngine.formatAnalyticsForDisplay(analytics);
        console.log(formattedAnalytics);
        // Ask if user wants to integrate GitHub data into resume
        const { integrate } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'integrate',
                message: 'Would you like to integrate this GitHub data into your resume?',
                default: false
            }
        ]);
        if (integrate) {
            const enhancedResumeData = await githubEngine.exportToResumeData(analytics, resumeData);
            console.log(chalk[colors.success]('\n✅ GitHub data integrated into resume successfully!\n'));
            // Show what was added
            console.log(chalk[colors.primary]('📝 Changes made:'));
            console.log(chalk[colors.secondary](`• Added ${analytics.topRepositories.length} top repositories to projects`));
            console.log(chalk[colors.secondary](`• Updated tech stack with ${Object.keys(analytics.stats.mostUsedLanguages).length} languages`));
            console.log('');
        }
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error fetching GitHub analytics: ${error.message}\n`));
        if (error.message.includes('404')) {
            console.log(chalk[colors.secondary]('• Make sure the GitHub username is correct'));
            console.log(chalk[colors.secondary]('• Check if the profile is public\n'));
        }
        else if (error.message.includes('rate limit')) {
            console.log(chalk[colors.secondary]('• GitHub API rate limit exceeded'));
            console.log(chalk[colors.secondary]('• Try again later or provide a GitHub token\n'));
        }
    }
}
/**
 * Helper function to extract keywords from job description
 */
function extractKeywords(text, type) {
    const words = text.toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2);
    const commonTechKeywords = [
        'javascript', 'python', 'java', 'react', 'node', 'aws', 'docker',
        'kubernetes', 'git', 'sql', 'nosql', 'api', 'rest', 'graphql',
        'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'redis'
    ];
    const skillKeywords = [
        'leadership', 'management', 'communication', 'teamwork', 'agile',
        'scrum', 'problem-solving', 'analytical', 'creative', 'innovative'
    ];
    switch (type) {
        case 'requirements':
            return words.filter(word => commonTechKeywords.includes(word)).slice(0, 10);
        case 'skills':
            return words.filter(word => commonTechKeywords.includes(word) || skillKeywords.includes(word)).slice(0, 10);
        case 'general':
        default:
            return words.filter(word => commonTechKeywords.includes(word) ||
                skillKeywords.includes(word) ||
                ['development', 'programming', 'software', 'engineering', 'coding'].includes(word)).slice(0, 15);
    }
}
/**
 * Helper function to display ATS results
 */
function displayATSResults(result, colors) {
    console.log(chalk[colors.accent].bold(`🎯 Overall ATS Score: ${result.overallScore}%\n`));
    console.log(chalk[colors.primary].bold('📊 Score Breakdown:'));
    console.log(chalk[colors.secondary](`🔍 Keyword Match: ${result.breakdown.keywordMatch}%`));
    console.log(chalk[colors.secondary](`⚡ Skills Match: ${result.breakdown.skillsMatch}%`));
    console.log(chalk[colors.secondary](`💼 Experience Match: ${result.breakdown.experienceMatch}%`));
    console.log(chalk[colors.secondary](`📄 Format Score: ${result.breakdown.formatScore}%\n`));
    if (result.matchedKeywords.length > 0) {
        console.log(chalk[colors.primary].bold('✅ Matched Keywords:'));
        result.matchedKeywords.slice(0, 8).forEach((keyword) => {
            console.log(chalk[colors.accent](`  • ${keyword}`));
        });
        console.log();
    }
    if (result.missingKeywords.length > 0) {
        console.log(chalk[colors.primary].bold('❌ Missing Keywords:'));
        result.missingKeywords.slice(0, 8).forEach((keyword) => {
            console.log(chalk[colors.secondary](`  • ${keyword}`));
        });
        console.log();
    }
    if (result.suggestions.length > 0) {
        console.log(chalk[colors.primary].bold('💡 Improvement Suggestions:'));
        result.suggestions.slice(0, 5).forEach((suggestion) => {
            console.log(chalk[colors.secondary](`  • ${suggestion}`));
        });
        console.log();
    }
}
//# sourceMappingURL=interactive-statistics.js.map
import chalk from 'chalk';
import inquirer from 'inquirer';
import { getThemeColors } from './config.js';
/**
 * Optimize keywords interactively
 */
export async function optimizeKeywords(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    while (true) {
        const { keywordAction } = await inquirer.prompt([
            {
                type: 'list',
                name: 'keywordAction',
                message: 'Keyword Optimization Options:',
                choices: [
                    { name: '🎯 Job Description Analysis', value: 'job-analysis' },
                    { name: '🔍 Industry Keyword Research', value: 'industry-research' },
                    { name: '📊 Current Keyword Analysis', value: 'current-analysis' },
                    { name: '💡 Keyword Suggestions', value: 'suggestions' },
                    { name: '⚡ Auto-Optimize Keywords', value: 'auto-optimize' },
                    { name: '🔙 Back to Main Menu', value: 'back' }
                ]
            }
        ]);
        if (keywordAction === 'back') {
            return;
        }
        switch (keywordAction) {
            case 'job-analysis':
                await analyzeJobDescription(resumeData);
                break;
            case 'industry-research':
                await researchIndustryKeywords(resumeData);
                break;
            case 'current-analysis':
                await analyzeCurrentKeywords(resumeData);
                break;
            case 'suggestions':
                await generateKeywordSuggestions(resumeData);
                break;
            case 'auto-optimize':
                await autoOptimizeKeywords(resumeData);
                break;
        }
    }
}
/**
 * Analyze job description for keywords
 */
export async function analyzeJobDescription(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n🎯 Job Description Analysis\n'));
    const { jobDescription } = await inquirer.prompt([
        {
            type: 'editor',
            name: 'jobDescription',
            message: 'Paste the job description here:',
            validate: (input) => input.trim().length > 0 || 'Job description is required'
        }
    ]);
    try {
        // const optimizer = new KeywordOptimizer();
        console.log(chalk[colors.secondary]('Keyword optimization not available in modular version.\n'));
        return;
        // // const analysis = await optimizer.analyzeJobDescription(jobDescription);
        // // Extract key requirements
        // console.log((chalk as any)[colors.primary]('📋 Key Requirements Found:'));
        // if (analysis.requirements && analysis.requirements.length > 0) {
        //   analysis.requirements.slice(0, 8).forEach((req, index) => {
        //     console.log(`${index + 1}. ${req}`);
        //   });
        // }
        // console.log();
        // // Important keywords
        // console.log((chalk as any)[colors.primary]('🔑 Important Keywords:'));
        // if (analysis.keywords && analysis.keywords.length > 0) {
        //   analysis.keywords.slice(0, 12).forEach((keyword, index) => {
        //     console.log(`• ${keyword}`);
        //   });
        // }
        // console.log();
        // // Skills mentioned
        // console.log((chalk as any)[colors.primary]('💻 Technical Skills:'));
        // if (analysis.technicalSkills && analysis.technicalSkills.length > 0) {
        //   analysis.technicalSkills.slice(0, 10).forEach((skill, index) => {
        //     console.log(`• ${skill}`);
        //   });
        // }
        // console.log();
        // // Match analysis
        // const matchScore = analysis.matchScore || 0;
        // const matchColor = matchScore >= 80 ? colors.success : matchScore >= 60 ? colors.warning : colors.error;
        // console.log((chalk as any)[colors.primary]('📊 Resume Match Analysis:'));
        // console.log(`Match Score: ${(chalk as any)[matchColor](matchScore + '%')}`);
        // if (analysis.missingKeywords && analysis.missingKeywords.length > 0) {
        //   console.log((chalk as any)[colors.warning]('\n⚠️ Missing Keywords:'));
        //   analysis.missingKeywords.slice(0, 6).forEach((keyword, index) => {
        //     console.log(`${index + 1}. ${keyword}`);
        //   });
        // }
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error analyzing job description: ${error}\n`));
    }
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}
/**
 * Research industry keywords
 */
export async function researchIndustryKeywords(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n🔍 Industry Keyword Research\n'));
    const { industry, role } = await inquirer.prompt([
        {
            type: 'list',
            name: 'industry',
            message: 'Select your industry:',
            choices: [
                'Technology', 'Finance', 'Healthcare', 'Education',
                'Marketing', 'Engineering', 'Design', 'Sales',
                'Operations', 'Legal', 'Consulting', 'Other'
            ]
        },
        {
            type: 'input',
            name: 'role',
            message: 'Enter your target role:',
            validate: (input) => input.trim().length > 0 || 'Role is required'
        }
    ]);
    try {
        // const optimizer = new KeywordOptimizer();
        // const research = await optimizer.researchIndustryKeywords(industry, role);
        console.log(chalk[colors.secondary]('Industry keyword research not available in modular version.\n'));
        return;
        // // Trending keywords
        // console.log((chalk as any)[colors.primary]('📈 Trending Keywords:'));
        // if (research.trendingKeywords && research.trendingKeywords.length > 0) {
        //   research.trendingKeywords.slice(0, 10).forEach((keyword, index) => {
        //     console.log(`${index + 1}. ${keyword}`);
        //   });
        // }
        // console.log();
        // // Essential skills
        // console.log((chalk as any)[colors.primary]('⭐ Essential Skills:'));
        // if (research.essentialSkills && research.essentialSkills.length > 0) {
        //   research.essentialSkills.slice(0, 8).forEach((skill, index) => {
        //     console.log(`• ${skill}`);
        //   });
        // }
        // console.log();
        // // Emerging technologies
        // console.log((chalk as any)[colors.primary]('🚀 Emerging Technologies:'));
        // if (research.emergingTech && research.emergingTech.length > 0) {
        //   research.emergingTech.slice(0, 6).forEach((tech, index) => {
        //     console.log(`• ${tech}`);
        //   });
        // }
        // console.log();
        // // Industry-specific terms
        // console.log((chalk as any)[colors.primary]('🏢 Industry-Specific Terms:'));
        // if (research.industryTerms && research.industryTerms.length > 0) {
        //   research.industryTerms.slice(0, 8).forEach((term, index) => {
        //     console.log(`• ${term}`);
        //   });
        // }
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error researching keywords: ${error}\n`));
    }
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}
/**
 * Analyze current keywords
 */
export async function analyzeCurrentKeywords(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📊 Current Keyword Analysis\n'));
    try {
        // const optimizer = new KeywordOptimizer();
        // const analysis = await optimizer.analyzeKeywords(resumeData);
        console.log(chalk[colors.secondary]('Current keyword analysis not available in modular version.\n'));
        return;
        // // Keyword frequency
        // console.log((chalk as any)[colors.primary]('📊 Keyword Frequency:'));
        // if (analysis.keywordFrequency) {
        //   Object.entries(analysis.keywordFrequency)
        //     .sort(([,a], [,b]) => (b as number) - (a as number))
        //     .slice(0, 15)
        //     .forEach(([keyword, count]) => {
        //       const bars = '█'.repeat(Math.min(Math.floor((count as number) / 2), 20));
        //       console.log(`${keyword.padEnd(20)} ${bars.padEnd(20)} ${count}`);
        //     });
        // }
        // console.log();
        // // Keyword density
        // console.log((chalk as any)[colors.primary]('📈 Keyword Density:'));
        // if (analysis.keywordDensity) {
        //   Object.entries(analysis.keywordDensity)
        //     .sort(([,a], [,b]) => (b as number) - (a as number))
        //     .slice(0, 10)
        //     .forEach(([keyword, density]) => {
        //       const densityNum = typeof density === 'number' ? density : 0;
        //       const color = densityNum > 3 ? colors.warning : colors.success;
        //       console.log(`${keyword.padEnd(20)} ${(chalk as any)[color](densityNum.toFixed(2) + '%')}`);
        //     });
        // }
        // console.log();
        // // Keyword categories
        // console.log((chalk as any)[colors.primary]('📂 Keyword Categories:'));
        // if (analysis.categories) {
        //   Object.entries(analysis.categories).forEach(([category, keywords]) => {
        //     console.log(`${category}: ${(keywords as string[]).slice(0, 5).join(', ')}`);
        //   });
        // }
        // console.log();
        // // Optimization score
        // const score = analysis.optimizationScore || 0;
        // const scoreColor = score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.error;
        // console.log((chalk as any)[colors.primary]('🎯 Optimization Score:'));
        // console.log(`${(chalk as any)[scoreColor].bold(score + '%')} - ${analysis.optimizationLevel || 'Unknown'}\n`);
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error analyzing keywords: ${error}\n`));
    }
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}
/**
 * Generate keyword suggestions
 */
export async function generateKeywordSuggestions(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n💡 Keyword Suggestions\n'));
    try {
        // const optimizer = new KeywordOptimizer();
        // const suggestions = await optimizer.generateSuggestions(resumeData);
        console.log(chalk[colors.secondary]('Keyword suggestions not available in modular version.\n'));
        return;
        // // High-impact keywords
        // console.log((chalk as any)[colors.primary]('🎯 High-Impact Keywords:'));
        // if (suggestions.highImpact && suggestions.highImpact.length > 0) {
        //   suggestions.highImpact.slice(0, 8).forEach((keyword, index) => {
        //     console.log(`${index + 1}. ${(chalk as any)[colors.success](keyword)}`);
        //   });
        // }
        // console.log();
        // // Technical skills to add
        // console.log((chalk as any)[colors.primary]('💻 Technical Skills to Add:'));
        // if (suggestions.technicalSkills && suggestions.technicalSkills.length > 0) {
        //   suggestions.technicalSkills.slice(0, 10).forEach((skill, index) => {
        //     console.log(`• ${skill}`);
        //   });
        // }
        // console.log();
        // // Soft skills
        // console.log((chalk as any)[colors.primary]('🤝 Soft Skills:'));
        // if (suggestions.softSkills && suggestions.softSkills.length > 0) {
        //   suggestions.softSkills.slice(0, 6).forEach((skill, index) => {
        //     console.log(`• ${skill}`);
        //   });
        // }
        // console.log();
        // // Industry buzzwords
        // console.log((chalk as any)[colors.primary]('🔥 Industry Buzzwords:'));
        // if (suggestions.buzzwords && suggestions.buzzwords.length > 0) {
        //   suggestions.buzzwords.slice(0, 8).forEach((word, index) => {
        //     console.log(`• ${word}`);
        //   });
        // }
        // console.log();
        // // Action verbs
        // console.log((chalk as any)[colors.primary]('⚡ Power Action Verbs:'));
        // if (suggestions.actionVerbs && suggestions.actionVerbs.length > 0) {
        //   suggestions.actionVerbs.slice(0, 12).forEach((verb, index) => {
        //     console.log(`• ${verb}`);
        //   });
        // }
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error generating suggestions: ${error}\n`));
    }
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}
/**
 * Auto-optimize keywords
 */
export async function autoOptimizeKeywords(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n⚡ Auto-Optimize Keywords\n'));
    const { confirmOptimization } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmOptimization',
            message: 'This will automatically optimize your resume keywords. Continue?',
            default: true
        }
    ]);
    if (!confirmOptimization) {
        return;
    }
    try {
        console.log(chalk[colors.primary]('🔄 Analyzing current keywords...'));
        // const optimizer = new KeywordOptimizer();
        // const optimization = await optimizer.autoOptimize(resumeData);
        console.log(chalk[colors.secondary]('Auto-optimization not available in modular version.\n'));
        return;
        // console.log((chalk as any)[colors.success]('✅ Analysis complete!\n'));
        // // Show optimization results
        // console.log((chalk as any)[colors.primary]('📊 Optimization Results:'));
        // console.log(`Keywords Added: ${optimization.addedKeywords?.length || 0}`);
        // console.log(`Keywords Removed: ${optimization.removedKeywords?.length || 0}`);
        // console.log(`Keywords Modified: ${optimization.modifiedKeywords?.length || 0}`);
        // console.log(`Optimization Score: ${optimization.newScore || 0}% (was ${optimization.oldScore || 0}%)\n`);
        // // Added keywords
        // if (optimization.addedKeywords && optimization.addedKeywords.length > 0) {
        //   console.log((chalk as any)[colors.success]('➕ Added Keywords:'));
        //   optimization.addedKeywords.slice(0, 8).forEach((keyword, index) => {
        //     console.log(`${index + 1}. ${keyword}`);
        //   });
        //   console.log();
        // }
        // // Removed keywords
        // if (optimization.removedKeywords && optimization.removedKeywords.length > 0) {
        //   console.log((chalk as any)[colors.warning]('➖ Removed Keywords:'));
        //   optimization.removedKeywords.slice(0, 5).forEach((keyword, index) => {
        //     console.log(`${index + 1}. ${keyword}`);
        //   });
        //   console.log();
        // }
        // // Recommendations
        // if (optimization.recommendations && optimization.recommendations.length > 0) {
        //   console.log((chalk as any)[colors.primary]('💡 Additional Recommendations:'));
        //   optimization.recommendations.slice(0, 5).forEach((rec, index) => {
        //     console.log(`${index + 1}. ${rec}`);
        //   });
        //   console.log();
        // }
        // const { saveChanges } = await inquirer.prompt([
        //   {
        //     type: 'confirm',
        //     name: 'saveChanges',
        //     message: 'Save these optimizations?',
        //     default: true
        //   }
        // ]);
        // if (saveChanges) {
        //   console.log((chalk as any)[colors.success]('\n💾 Optimizations saved successfully!\n'));
        // } else {
        //   console.log((chalk as any)[colors.secondary]('\n❌ Optimizations discarded.\n'));
        // }
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error during auto-optimization: ${error}\n`));
    }
}
/**
 * Analyze resume length and provide optimization suggestions
 */
export async function analyzeLengthOptimization(resumeData) {
    const colors = getThemeColors({ theme: 'colorful', favorites: [] });
    console.log(chalk[colors.primary].bold('\n📏 Length Optimization Analysis\n'));
    try {
        // const analyzer = new ResumeAnalyzer();
        console.log(chalk[colors.secondary]('Resume analysis not available in modular version.\n'));
        return;
        // const lengthAnalysis = await analyzer.analyzeLengthOptimization(resumeData);
        // // Current metrics
        // console.log((chalk as any)[colors.primary]('📊 Current Metrics:'));
        // console.log(`Total Words: ${lengthAnalysis.currentMetrics?.totalWords || 0}`);
        // console.log(`Total Pages: ${lengthAnalysis.currentMetrics?.totalPages || 0}`);
        // console.log(`Reading Time: ${lengthAnalysis.currentMetrics?.readingTime || 0} minutes`);
        // console.log(`Density Score: ${lengthAnalysis.currentMetrics?.densityScore || 0}%\n`);
        // 
        // // Recommendations
        // const recommendation = lengthAnalysis.recommendation || 'maintain';
        // const recColor = recommendation === 'shorten' ? colors.warning : 
        //                 recommendation === 'expand' ? colors.primary : colors.success;
        // 
        // console.log((chalk as any)[colors.primary]('💡 Length Recommendation:'));
        // console.log(`${(chalk as any)[recColor].bold(recommendation.toUpperCase())} - ${lengthAnalysis.reason || 'No specific reason'}\n`);
        // 
        // // Section analysis
        // if (lengthAnalysis.sectionAnalysis) {
        //   console.log((chalk as any)[colors.primary]('📋 Section Analysis:'));
        //   Object.entries(lengthAnalysis.sectionAnalysis).forEach(([section, analysis]) => {
        //     const sectionAnalysis = analysis as any;
        //     const status = sectionAnalysis.status || 'optimal';
        //     const statusColor = status === 'too_long' ? colors.warning : 
        //                        status === 'too_short' ? colors.error : colors.success;
        //     console.log(`${section.padEnd(20)} ${(chalk as any)[statusColor](status)} (${sectionAnalysis.wordCount || 0} words)`);
        //   });
        //   console.log();
        // }
        // 
        // // Optimization suggestions
        // if (lengthAnalysis.optimizationSuggestions && lengthAnalysis.optimizationSuggestions.length > 0) {
        //   console.log((chalk as any)[colors.primary]('🎯 Optimization Suggestions:'));
        //   lengthAnalysis.optimizationSuggestions.forEach((suggestion, index) => {
        //     console.log(`${index + 1}. ${suggestion}`);
        //   });
        //   console.log();
        // }
        // 
        // // Target metrics
        // if (lengthAnalysis.targetMetrics) {
        //   console.log((chalk as any)[colors.primary]('🎯 Target Metrics:'));
        //   console.log(`Target Words: ${lengthAnalysis.targetMetrics.targetWords || 0}`);
        //   console.log(`Target Pages: ${lengthAnalysis.targetMetrics.targetPages || 0}`);
        //   console.log(`Words to Remove: ${lengthAnalysis.targetMetrics.wordsToRemove || 0}`);
        //   console.log(`Words to Add: ${lengthAnalysis.targetMetrics.wordsToAdd || 0}\n`);
        // }
    }
    catch (error) {
        console.log(chalk[colors.error](`\n❌ Error analyzing length optimization: ${error}\n`));
    }
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
}
//# sourceMappingURL=interactive-analysis.js.map
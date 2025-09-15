export class KeywordOptimizer {
    constructor() {
        this.industryKeywords = {
            'technology': {
                technical: [
                    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker',
                    'Kubernetes', 'Git', 'SQL', 'NoSQL', 'API', 'REST', 'GraphQL',
                    'Microservices', 'CI/CD', 'DevOps', 'Agile', 'Scrum', 'TDD',
                    'Machine Learning', 'AI', 'Data Science', 'Cloud Computing',
                    'Cybersecurity', 'Blockchain', 'IoT', 'Mobile Development'
                ],
                soft: [
                    'Problem Solving', 'Critical Thinking', 'Communication', 'Leadership',
                    'Team Collaboration', 'Project Management', 'Analytical Skills',
                    'Innovation', 'Adaptability', 'Time Management'
                ],
                industry: [
                    'Software Development', 'Web Development', 'Mobile Apps', 'SaaS',
                    'Fintech', 'E-commerce', 'Healthcare Tech', 'EdTech', 'Gaming',
                    'Enterprise Software', 'Startup', 'Digital Transformation'
                ],
                roles: [
                    'Software Engineer', 'Full Stack Developer', 'Frontend Developer',
                    'Backend Developer', 'DevOps Engineer', 'Data Scientist',
                    'Product Manager', 'Technical Lead', 'Architect', 'CTO'
                ],
                certifications: [
                    'AWS Certified', 'Google Cloud', 'Azure', 'Kubernetes Certified',
                    'Scrum Master', 'PMP', 'CISSP', 'CompTIA', 'Oracle Certified'
                ]
            },
            'marketing': {
                technical: [
                    'Google Analytics', 'SEO', 'SEM', 'Social Media Marketing',
                    'Content Marketing', 'Email Marketing', 'Marketing Automation',
                    'CRM', 'Salesforce', 'HubSpot', 'Adobe Creative Suite',
                    'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'A/B Testing'
                ],
                soft: [
                    'Creativity', 'Strategic Thinking', 'Communication', 'Brand Management',
                    'Customer Focus', 'Data Analysis', 'Project Management',
                    'Storytelling', 'Negotiation', 'Relationship Building'
                ],
                industry: [
                    'Digital Marketing', 'Brand Marketing', 'Performance Marketing',
                    'Content Strategy', 'Growth Marketing', 'Influencer Marketing',
                    'Event Marketing', 'Product Marketing', 'B2B Marketing', 'B2C Marketing'
                ],
                roles: [
                    'Marketing Manager', 'Digital Marketing Specialist', 'Content Manager',
                    'SEO Specialist', 'Social Media Manager', 'Brand Manager',
                    'Growth Hacker', 'Marketing Director', 'CMO'
                ],
                certifications: [
                    'Google Ads Certified', 'Google Analytics', 'HubSpot Certified',
                    'Facebook Blueprint', 'Salesforce Certified', 'Adobe Certified'
                ]
            },
            'finance': {
                technical: [
                    'Financial Modeling', 'Excel', 'SQL', 'Python', 'R', 'Tableau',
                    'Bloomberg Terminal', 'SAP', 'QuickBooks', 'Financial Analysis',
                    'Risk Management', 'Portfolio Management', 'Trading', 'Derivatives'
                ],
                soft: [
                    'Analytical Skills', 'Attention to Detail', 'Problem Solving',
                    'Communication', 'Ethics', 'Decision Making', 'Time Management',
                    'Leadership', 'Negotiation', 'Client Relations'
                ],
                industry: [
                    'Investment Banking', 'Private Equity', 'Hedge Funds', 'Asset Management',
                    'Corporate Finance', 'Financial Planning', 'Insurance', 'Banking',
                    'Fintech', 'Cryptocurrency', 'Real Estate Finance'
                ],
                roles: [
                    'Financial Analyst', 'Investment Banker', 'Portfolio Manager',
                    'Risk Analyst', 'Financial Advisor', 'Controller', 'CFO',
                    'Quantitative Analyst', 'Credit Analyst'
                ],
                certifications: [
                    'CFA', 'CPA', 'FRM', 'PMP', 'Series 7', 'Series 66',
                    'CAIA', 'CFP', 'CIA', 'CISA'
                ]
            }
        };
        this.emergingTechKeywords = [
            'Artificial Intelligence', 'Machine Learning', 'Deep Learning',
            'Natural Language Processing', 'Computer Vision', 'Blockchain',
            'Cryptocurrency', 'NFT', 'Web3', 'Metaverse', 'AR/VR',
            'Quantum Computing', 'Edge Computing', 'Serverless',
            'Microservices', 'Container Orchestration', 'GitOps'
        ];
        this.actionVerbs = [
            'Developed', 'Implemented', 'Designed', 'Created', 'Built', 'Led',
            'Managed', 'Optimized', 'Improved', 'Increased', 'Reduced',
            'Streamlined', 'Automated', 'Collaborated', 'Delivered',
            'Achieved', 'Exceeded', 'Transformed', 'Innovated', 'Scaled'
        ];
    }
    /**
     * Analyze resume keywords and suggest improvements
     */
    analyzeKeywords(resume, jobDescription, options = {}) {
        const resumeText = this.extractResumeText(resume);
        const currentKeywords = this.extractKeywords(resumeText);
        const keywordDensity = this.calculateKeywordDensity(resumeText, currentKeywords);
        let targetKeywords = [];
        if (jobDescription) {
            targetKeywords = this.extractKeywords(jobDescription);
        }
        if (options.industry) {
            const industryKeywords = this.getIndustryKeywords(options.industry);
            targetKeywords = [...targetKeywords, ...industryKeywords];
        }
        const missingKeywords = this.findMissingKeywords(currentKeywords, targetKeywords, options);
        const suggestions = this.generateSuggestions(resume, missingKeywords, options);
        const overusedKeywords = this.findOverusedKeywords(keywordDensity);
        const score = this.calculateKeywordScore(currentKeywords, targetKeywords, keywordDensity);
        return {
            currentKeywords,
            missingKeywords,
            suggestions,
            overusedKeywords,
            keywordDensity,
            score
        };
    }
    /**
     * Generate keyword suggestions for specific sections
     */
    suggestSectionKeywords(section, content, options = {}) {
        const suggestions = [];
        const industryKeywords = options.industry ? this.getIndustryKeywords(options.industry) : [];
        switch (section) {
            case 'experience':
                suggestions.push(...this.suggestExperienceKeywords(content, industryKeywords, options));
                break;
            case 'projects':
                suggestions.push(...this.suggestProjectKeywords(content, industryKeywords, options));
                break;
            case 'skills':
                suggestions.push(...this.suggestSkillKeywords(content, industryKeywords, options));
                break;
            case 'summary':
                suggestions.push(...this.suggestSummaryKeywords(content, industryKeywords, options));
                break;
        }
        return suggestions.sort((a, b) => b.relevance - a.relevance);
    }
    /**
     * Optimize resume content by suggesting keyword placements
     */
    optimizeContent(resume, targetKeywords, options = {}) {
        const changes = [];
        const optimizedResume = JSON.parse(JSON.stringify(resume));
        // Optimize profile/summary
        if (optimizedResume.profile) {
            const optimizedProfile = this.optimizeText(optimizedResume.profile, targetKeywords, 'summary');
            if (optimizedProfile.text !== optimizedResume.profile) {
                changes.push({
                    section: 'profile',
                    original: optimizedResume.profile,
                    optimized: optimizedProfile.text,
                    addedKeywords: optimizedProfile.addedKeywords
                });
                optimizedResume.profile = optimizedProfile.text;
            }
        }
        // Optimize experience bullets
        optimizedResume.experience.forEach((exp, expIndex) => {
            exp.bullets.forEach((bullet, bulletIndex) => {
                const optimizedBullet = this.optimizeText(bullet, targetKeywords, 'experience');
                if (optimizedBullet.text !== bullet) {
                    changes.push({
                        section: `experience[${expIndex}].bullets[${bulletIndex}]`,
                        original: bullet,
                        optimized: optimizedBullet.text,
                        addedKeywords: optimizedBullet.addedKeywords
                    });
                    exp.bullets[bulletIndex] = optimizedBullet.text;
                }
            });
        });
        // Optimize project descriptions
        optimizedResume.projects.forEach((project, projectIndex) => {
            const optimizedDesc = this.optimizeText(project.desc, targetKeywords, 'projects');
            if (optimizedDesc.text !== project.desc) {
                changes.push({
                    section: `projects[${projectIndex}].desc`,
                    original: project.desc,
                    optimized: optimizedDesc.text,
                    addedKeywords: optimizedDesc.addedKeywords
                });
                project.desc = optimizedDesc.text;
            }
        });
        return { optimizedResume, changes };
    }
    /**
     * Generate industry-specific keyword recommendations
     */
    getIndustryRecommendations(industry, role) {
        const industryData = this.industryKeywords[industry.toLowerCase()];
        if (!industryData) {
            return { mustHave: [], recommended: [], emerging: [] };
        }
        const mustHave = this.createKeywordSuggestions(industryData.technical.slice(0, 10), 'technical', 'high');
        const recommended = [
            ...this.createKeywordSuggestions(industryData.soft.slice(0, 5), 'soft', 'medium'),
            ...this.createKeywordSuggestions(industryData.industry.slice(0, 5), 'industry', 'medium')
        ];
        const emerging = this.createKeywordSuggestions(this.emergingTechKeywords.filter(keyword => industryData.technical.some(tech => keyword.toLowerCase().includes(tech.toLowerCase()) ||
            tech.toLowerCase().includes(keyword.toLowerCase()))).slice(0, 5), 'technical', 'low');
        return { mustHave, recommended, emerging };
    }
    extractResumeText(resume) {
        const sections = [
            resume.personal.name,
            resume.personal.role,
            resume.profile || '',
            resume.techStack?.join(' ') || '',
            resume.experience?.map(exp => `${exp.title} ${exp.company} ${exp.bullets.join(' ')}`).join(' ') || '',
            resume.projects?.map(proj => `${proj.name} ${proj.desc} ${proj.tech}`).join(' ') || '',
            resume.education?.map(edu => `${edu.degree} ${edu.school} ${edu.details.join(' ')}`).join(' ') || ''
        ];
        return sections.join(' ');
    }
    extractKeywords(text) {
        // Remove common words and extract meaningful keywords
        const commonWords = new Set([
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
            'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
            'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was',
            'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
            'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
            'can', 'shall', 'a', 'an', 'this', 'that', 'these', 'those'
        ]);
        const words = text.toLowerCase()
            .replace(/[^a-zA-Z0-9\s+#.-]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !commonWords.has(word));
        // Extract multi-word phrases and technologies
        const phrases = this.extractPhrases(text);
        return [...new Set([...words, ...phrases])];
    }
    extractPhrases(text) {
        const techPhrases = [
            /\b(machine learning|artificial intelligence|data science|web development|software engineering|project management|user experience|user interface|full stack|front end|back end|devops|ci\/cd)\b/gi,
            /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/g, // Capitalized phrases
            /\b([a-zA-Z]+\.[a-zA-Z]+)\b/g, // Tech with dots (e.g., Node.js)
            /\b([a-zA-Z]+\/[a-zA-Z]+)\b/g // Tech with slashes (e.g., CI/CD)
        ];
        const phrases = [];
        techPhrases.forEach(regex => {
            const matches = text.match(regex);
            if (matches) {
                phrases.push(...matches.map(match => match.toLowerCase()));
            }
        });
        return phrases;
    }
    calculateKeywordDensity(text, keywords) {
        const wordCount = text.split(/\s+/).length;
        const density = {};
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            const matches = text.match(regex);
            const count = matches ? matches.length : 0;
            density[keyword] = (count / wordCount) * 100;
        });
        return density;
    }
    getIndustryKeywords(industry) {
        const industryData = this.industryKeywords[industry.toLowerCase()];
        if (!industryData)
            return [];
        return [
            ...industryData.technical,
            ...industryData.soft,
            ...industryData.industry,
            ...industryData.roles,
            ...industryData.certifications
        ];
    }
    findMissingKeywords(currentKeywords, targetKeywords, options) {
        const currentSet = new Set(currentKeywords.map(k => k.toLowerCase()));
        const missing = [];
        targetKeywords.forEach(keyword => {
            if (!currentSet.has(keyword.toLowerCase())) {
                missing.push({
                    keyword,
                    relevance: this.calculateRelevance(keyword, options),
                    category: this.categorizeKeyword(keyword),
                    context: this.getKeywordContext(keyword),
                    priority: this.getKeywordPriority(keyword, options)
                });
            }
        });
        return missing.sort((a, b) => b.relevance - a.relevance);
    }
    generateSuggestions(resume, missingKeywords, options) {
        const suggestions = [];
        const targetCount = options.targetKeywordCount || 20;
        // Add top missing keywords
        suggestions.push(...missingKeywords.slice(0, Math.min(targetCount, missingKeywords.length)));
        // Add emerging tech keywords if requested
        if (options.includeEmergingTech) {
            const emergingKeywords = this.emergingTechKeywords
                .filter(keyword => !resume.techStack?.includes(keyword))
                .slice(0, 5)
                .map(keyword => ({
                keyword,
                relevance: 70,
                category: 'technical',
                context: 'Emerging technology trend',
                priority: 'medium'
            }));
            suggestions.push(...emergingKeywords);
        }
        return suggestions;
    }
    findOverusedKeywords(keywordDensity) {
        const threshold = 2.0; // 2% density threshold
        return Object.entries(keywordDensity)
            .filter(([_, density]) => density > threshold)
            .map(([keyword, _]) => keyword);
    }
    calculateKeywordScore(currentKeywords, targetKeywords, keywordDensity) {
        if (targetKeywords.length === 0)
            return 85; // Default score when no targets
        const currentSet = new Set(currentKeywords.map(k => k.toLowerCase()));
        const targetSet = new Set(targetKeywords.map(k => k.toLowerCase()));
        const matchCount = Array.from(targetSet).filter(keyword => currentSet.has(keyword)).length;
        const matchRatio = matchCount / targetKeywords.length;
        // Penalty for overused keywords
        const overusedPenalty = Object.values(keywordDensity).filter(density => density > 2.0).length * 5;
        const baseScore = matchRatio * 100;
        return Math.max(0, Math.min(100, baseScore - overusedPenalty));
    }
    optimizeText(text, targetKeywords, section) {
        let optimizedText = text;
        const addedKeywords = [];
        const textLower = text.toLowerCase();
        // Find keywords that can be naturally integrated
        const relevantKeywords = targetKeywords.filter(keyword => {
            const keywordLower = keyword.toLowerCase();
            return !textLower.includes(keywordLower) && this.canIntegrateKeyword(text, keyword, section);
        });
        // Add up to 3 keywords per text block to avoid keyword stuffing
        relevantKeywords.slice(0, 3).forEach(keyword => {
            const integration = this.integrateKeyword(optimizedText, keyword, section);
            if (integration) {
                optimizedText = integration;
                addedKeywords.push(keyword);
            }
        });
        return { text: optimizedText, addedKeywords };
    }
    canIntegrateKeyword(text, keyword, section) {
        // Simple heuristic to determine if a keyword can be naturally integrated
        const keywordLower = keyword.toLowerCase();
        const textLower = text.toLowerCase();
        // Check if keyword is contextually relevant
        if (section === 'experience' && this.isTechnicalKeyword(keyword)) {
            return textLower.includes('develop') || textLower.includes('implement') || textLower.includes('build');
        }
        if (section === 'summary' && this.isSoftSkillKeyword(keyword)) {
            return textLower.includes('experience') || textLower.includes('skilled') || textLower.includes('professional');
        }
        return true; // Default to allowing integration
    }
    integrateKeyword(text, keyword, section) {
        // Simple keyword integration - this could be made more sophisticated
        if (section === 'experience') {
            if (text.includes('using') || text.includes('with')) {
                return text.replace(/(using|with)\s+/, `$1 ${keyword} and `);
            }
        }
        if (section === 'summary') {
            if (text.includes('experience in')) {
                return text.replace('experience in', `experience in ${keyword} and`);
            }
        }
        // Fallback: append to end
        return `${text} (${keyword})`;
    }
    suggestExperienceKeywords(content, industryKeywords, options) {
        const suggestions = [];
        // Suggest action verbs if missing
        const hasActionVerb = this.actionVerbs.some(verb => content.toLowerCase().includes(verb.toLowerCase()));
        if (!hasActionVerb) {
            suggestions.push({
                keyword: this.actionVerbs[Math.floor(Math.random() * this.actionVerbs.length)],
                relevance: 90,
                category: 'role',
                context: 'Start bullet points with strong action verbs',
                priority: 'high'
            });
        }
        // Suggest technical keywords
        const relevantTech = industryKeywords.filter(keyword => this.isTechnicalKeyword(keyword) && !content.toLowerCase().includes(keyword.toLowerCase())).slice(0, 3);
        relevantTech.forEach(keyword => {
            suggestions.push({
                keyword,
                relevance: 85,
                category: 'technical',
                context: 'Add relevant technical skills to experience descriptions',
                priority: 'high'
            });
        });
        return suggestions;
    }
    suggestProjectKeywords(content, industryKeywords, options) {
        const suggestions = [];
        // Suggest project-related keywords
        const projectKeywords = ['developed', 'built', 'created', 'designed', 'implemented'];
        const hasProjectVerb = projectKeywords.some(verb => content.toLowerCase().includes(verb));
        if (!hasProjectVerb) {
            suggestions.push({
                keyword: 'developed',
                relevance: 88,
                category: 'role',
                context: 'Use action verbs to describe project work',
                priority: 'high'
            });
        }
        return suggestions;
    }
    suggestSkillKeywords(content, industryKeywords, options) {
        const suggestions = [];
        // Suggest missing technical skills
        const missingTech = industryKeywords.filter(keyword => this.isTechnicalKeyword(keyword) && !content.toLowerCase().includes(keyword.toLowerCase())).slice(0, 5);
        missingTech.forEach(keyword => {
            suggestions.push({
                keyword,
                relevance: 92,
                category: 'technical',
                context: 'Add to technical skills section',
                priority: 'high'
            });
        });
        return suggestions;
    }
    suggestSummaryKeywords(content, industryKeywords, options) {
        const suggestions = [];
        // Suggest role-specific keywords
        if (options.role) {
            const roleKeywords = this.getRoleKeywords(options.role);
            roleKeywords.forEach(keyword => {
                if (!content.toLowerCase().includes(keyword.toLowerCase())) {
                    suggestions.push({
                        keyword,
                        relevance: 95,
                        category: 'role',
                        context: 'Include role-specific terms in summary',
                        priority: 'high'
                    });
                }
            });
        }
        return suggestions;
    }
    createKeywordSuggestions(keywords, category, priority) {
        return keywords.map(keyword => ({
            keyword,
            relevance: priority === 'high' ? 90 : priority === 'medium' ? 70 : 50,
            category,
            context: this.getKeywordContext(keyword),
            priority
        }));
    }
    calculateRelevance(keyword, options) {
        let relevance = 50; // Base relevance
        if (options.industry && this.isIndustryKeyword(keyword, options.industry)) {
            relevance += 30;
        }
        if (options.role && this.isRoleKeyword(keyword, options.role)) {
            relevance += 25;
        }
        if (this.isTechnicalKeyword(keyword)) {
            relevance += 15;
        }
        return Math.min(100, relevance);
    }
    categorizeKeyword(keyword) {
        if (this.isTechnicalKeyword(keyword))
            return 'technical';
        if (this.isSoftSkillKeyword(keyword))
            return 'soft';
        if (this.isCertificationKeyword(keyword))
            return 'certification';
        if (this.isRoleKeyword(keyword))
            return 'role';
        return 'industry';
    }
    getKeywordContext(keyword) {
        if (this.isTechnicalKeyword(keyword)) {
            return 'Technical skill or technology';
        }
        if (this.isSoftSkillKeyword(keyword)) {
            return 'Soft skill or competency';
        }
        if (this.isCertificationKeyword(keyword)) {
            return 'Professional certification';
        }
        return 'Industry or role-specific term';
    }
    getKeywordPriority(keyword, options) {
        if (options.role && this.isRoleKeyword(keyword, options.role)) {
            return 'high';
        }
        if (this.isTechnicalKeyword(keyword)) {
            return 'high';
        }
        if (this.isSoftSkillKeyword(keyword)) {
            return 'medium';
        }
        return 'low';
    }
    isTechnicalKeyword(keyword) {
        const techPatterns = [
            /\b(javascript|python|java|react|node|aws|docker|kubernetes|sql|api|git)\b/i,
            /\b[A-Z]{2,}\b/, // Acronyms
            /\.[a-z]+$/i, // File extensions or tech with dots
            /\/[a-z]+/i // Tech with slashes
        ];
        return techPatterns.some(pattern => pattern.test(keyword));
    }
    isSoftSkillKeyword(keyword) {
        const softSkills = [
            'leadership', 'communication', 'teamwork', 'problem solving',
            'critical thinking', 'creativity', 'adaptability', 'time management',
            'project management', 'analytical', 'collaboration'
        ];
        return softSkills.some(skill => keyword.toLowerCase().includes(skill));
    }
    isCertificationKeyword(keyword) {
        const certPatterns = [
            /certified/i, /certification/i, /\b(cfa|cpa|pmp|cissp|aws|azure|google)\b/i
        ];
        return certPatterns.some(pattern => pattern.test(keyword));
    }
    isIndustryKeyword(keyword, industry) {
        const industryData = this.industryKeywords[industry.toLowerCase()];
        if (!industryData)
            return false;
        const allKeywords = [
            ...industryData.technical,
            ...industryData.industry,
            ...industryData.roles
        ].map(k => k.toLowerCase());
        return allKeywords.includes(keyword.toLowerCase());
    }
    isRoleKeyword(keyword, role) {
        if (!role)
            return false;
        // Simple role matching - could be enhanced
        return keyword.toLowerCase().includes(role.toLowerCase()) ||
            role.toLowerCase().includes(keyword.toLowerCase());
    }
    getRoleKeywords(role) {
        const roleKeywordMap = {
            'software engineer': ['software', 'engineer', 'development', 'programming', 'coding'],
            'data scientist': ['data', 'science', 'analytics', 'machine learning', 'statistics'],
            'product manager': ['product', 'management', 'strategy', 'roadmap', 'stakeholder'],
            'marketing manager': ['marketing', 'campaign', 'brand', 'digital', 'growth']
        };
        return roleKeywordMap[role.toLowerCase()] || [];
    }
    /**
     * Export keyword analysis to different formats
     */
    exportAnalysis(analysis, format = 'json') {
        switch (format) {
            case 'text':
                return this.exportToText(analysis);
            case 'csv':
                return this.exportToCSV(analysis);
            default:
                return JSON.stringify(analysis, null, 2);
        }
    }
    exportToText(analysis) {
        return `
Keyword Analysis Report
======================

Overall Score: ${analysis.score}/100

Current Keywords (${analysis.currentKeywords.length}):
${analysis.currentKeywords.join(', ')}

Missing Keywords (${analysis.missingKeywords.length}):
${analysis.missingKeywords.map(k => `- ${k.keyword} (${k.category}, ${k.priority} priority)`).join('\n')}

Suggestions (${analysis.suggestions.length}):
${analysis.suggestions.map(s => `- ${s.keyword}: ${s.context}`).join('\n')}

Overused Keywords:
${analysis.overusedKeywords.map(k => `- ${k} (${analysis.keywordDensity[k].toFixed(2)}% density)`).join('\n')}
`;
    }
    exportToCSV(analysis) {
        const headers = 'Keyword,Category,Priority,Relevance,Context\n';
        const rows = analysis.suggestions.map(s => `"${s.keyword}","${s.category}","${s.priority}",${s.relevance},"${s.context}"`).join('\n');
        return headers + rows;
    }
}
//# sourceMappingURL=keyword-optimizer.js.map
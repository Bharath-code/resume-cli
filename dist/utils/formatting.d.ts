/**
 * Format bold text with optional colors
 */
export declare function formatBoldText(text: string, useColors?: boolean): string;
/**
 * Create a section header with consistent styling
 */
export declare function createSectionHeader(title: string, useColors?: boolean): string;
/**
 * Format a list of items with bullet points
 */
export declare function formatBulletList(items: string[], useColors?: boolean): string;
/**
 * Format contact information
 */
export declare function formatContactInfo(label: string, value: string, useColors?: boolean): string;
/**
 * Format tech stack as a comma-separated list
 */
export declare function formatTechStack(techStack: string[], useColors?: boolean): string;
/**
 * Format experience entry
 */
export declare function formatExperience(company: string, title: string, dates: string, bullets: string[], useColors?: boolean): string;
/**
 * Format project entry
 */
export declare function formatProject(name: string, desc: string, tech: string, useColors?: boolean): string;
/**
 * Format education entry
 */
export declare function formatEducation(degree: string, school: string, dates: string, details: string[], useColors?: boolean): string;
/**
 * Remove markdown formatting for plain text output
 */
export declare function stripMarkdown(text: string): string;
/**
 * Convert markdown to HTML
 */
export declare function markdownToHtml(text: string): string;
//# sourceMappingURL=formatting.d.ts.map
import { ResumeData, SectionKey } from '../data/types.js';
/**
 * Format resume with colors for terminal display
 */
export declare function formatColoredResume(data: ResumeData, sections?: SectionKey[]): string;
/**
 * Format resume as plain text without colors
 */
export declare function formatPlainResume(data: ResumeData, sections?: SectionKey[]): string;
/**
 * Format resume as JSON
 */
export declare function formatJsonResume(data: ResumeData, sections?: SectionKey[]): string;
export declare function formatHtmlResume(data: ResumeData, sections?: SectionKey[]): string;
export declare function formatPdfResume(data: ResumeData, sections?: SectionKey[]): Promise<Buffer>;
//# sourceMappingURL=formatting.d.ts.map
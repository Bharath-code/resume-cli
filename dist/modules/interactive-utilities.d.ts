import { ResumeData } from '../data/types.js';
/**
 * Generate QR code for resume or contact info
 */
export declare function generateQRCode(resumeData: ResumeData): Promise<void>;
/**
 * Export contact card in various formats
 */
export declare function exportContactCard(resumeData: ResumeData): Promise<void>;
/**
 * Utility functions for file operations
 */
export declare function createOutputDirectory(): Promise<void>;
/**
 * Get file size in human readable format
 */
export declare function getFileSize(bytes: number): string;
/**
 * Validate URL format
 */
export declare function isValidUrl(string: string): boolean;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
//# sourceMappingURL=interactive-utilities.d.ts.map
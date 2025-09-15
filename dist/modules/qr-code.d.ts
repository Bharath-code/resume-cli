import { ResumeData } from '../data/types.js';
export interface QRCodeOptions {
    type: 'vcard' | 'linkedin' | 'portfolio' | 'github' | 'email' | 'phone';
    format: 'png' | 'svg' | 'terminal';
    size: number;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    margin: number;
    color: {
        dark: string;
        light: string;
    };
}
export interface ContactInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    title?: string;
    company?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
}
export declare class QRCodeGenerator {
    private static defaultOptions;
    /**
     * Generate QR code for vCard format
     */
    static generateVCard(contactInfo: ContactInfo, options?: Partial<QRCodeOptions>): Promise<string>;
    /**
     * Generate QR code for LinkedIn profile
     */
    static generateLinkedIn(linkedinUrl: string, options?: Partial<QRCodeOptions>): Promise<string>;
    /**
     * Generate QR code for portfolio/website
     */
    static generatePortfolio(portfolioUrl: string, options?: Partial<QRCodeOptions>): Promise<string>;
    /**
     * Generate QR code for GitHub profile
     */
    static generateGitHub(githubUrl: string, options?: Partial<QRCodeOptions>): Promise<string>;
    /**
     * Generate QR code for email
     */
    static generateEmail(email: string, subject?: string, body?: string, options?: Partial<QRCodeOptions>): Promise<string>;
    /**
     * Generate QR code for phone number
     */
    static generatePhone(phoneNumber: string, options?: Partial<QRCodeOptions>): Promise<string>;
    /**
     * Generate multiple QR codes from resume data
     */
    static generateFromResumeData(resumeData: ResumeData, types: QRCodeOptions['type'][], options?: Partial<QRCodeOptions>): Promise<{
        [key: string]: string;
    }>;
    /**
     * Save QR code to file
     */
    static saveQRCode(qrCodeData: string, filePath: string, format?: 'png' | 'svg'): Promise<void>;
    /**
     * Generate batch QR codes and save to directory
     */
    static generateBatch(resumeData: ResumeData, outputDir: string, options?: Partial<QRCodeOptions>): Promise<{
        [key: string]: string;
    }>;
    /**
     * Create vCard data string
     */
    private static createVCardData;
    /**
     * Extract contact information from resume data
     */
    private static extractContactInfo;
    /**
     * Core QR code generation method
     */
    private static generateQRCode;
    /**
     * Validate URL format
     */
    static validateUrl(url: string): boolean;
    /**
     * Validate email format
     */
    static validateEmail(email: string): boolean;
    /**
     * Validate phone number format
     */
    static validatePhone(phone: string): boolean;
}
export default QRCodeGenerator;
//# sourceMappingURL=qr-code.d.ts.map
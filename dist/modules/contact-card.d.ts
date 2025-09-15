import { ResumeData } from '../data/types.js';
export interface ContactCardOptions {
    format: 'vcard' | 'json' | 'pdf' | 'html' | 'all';
    includeQR: boolean;
    qrType: 'vcard' | 'linkedin' | 'portfolio' | 'email';
    theme: 'minimal' | 'professional' | 'modern' | 'creative';
    includePhoto: boolean;
    photoPath?: string;
    customFields?: {
        [key: string]: string;
    };
}
export interface DigitalBusinessCard {
    personal: {
        name: string;
        title: string;
        company?: string;
        email: string;
        phone?: string;
        location?: string;
    };
    social: {
        linkedin?: string;
        github?: string;
        portfolio?: string;
        twitter?: string;
    };
    professional: {
        skills: string[];
        experience: string;
        education?: string;
    };
    qrCodes?: {
        vcard?: string;
        linkedin?: string;
        portfolio?: string;
        email?: string;
    };
    metadata: {
        createdAt: string;
        version: string;
        format: string;
    };
}
export declare class ContactCardExporter {
    private static readonly VERSION;
    /**
     * Export contact card in specified format
     */
    static exportCard(resumeData: ResumeData, options: ContactCardOptions): Promise<string | {
        [key: string]: string;
    }>;
    /**
     * Save contact card to file(s)
     */
    static saveCard(resumeData: ResumeData, outputPath: string, options: ContactCardOptions): Promise<string[]>;
    /**
     * Create digital business card from resume data
     */
    private static createBusinessCard;
    /**
     * Generate QR codes for business card
     */
    private static generateQRCodes;
    /**
     * Generate vCard format
     */
    private static generateVCard;
    /**
     * Generate JSON format
     */
    private static generateJSON;
    /**
     * Generate HTML format
     */
    private static generateHTML;
    /**
     * Generate PDF format (simplified HTML-to-PDF approach)
     */
    private static generatePDF;
    /**
     * Generate all formats
     */
    private static generateAll;
    /**
     * Generate QR code HTML
     */
    private static generateQRCodeHTML;
    /**
     * Get theme CSS
     */
    private static getThemeCSS;
    /**
     * Extract contact info from resume data
     */
    private static extractContactInfo;
    /**
     * Calculate years of experience
     */
    private static calculateYearsOfExperience;
    /**
     * Get file extension for format
     */
    private static getFileExtension;
    /**
     * Ensure directory exists
     */
    private static ensureDirectoryExists;
    /**
     * Validate contact card options
     */
    static validateOptions(options: Partial<ContactCardOptions>): ContactCardOptions;
}
export default ContactCardExporter;
//# sourceMappingURL=contact-card.d.ts.map
import { ResumeData } from '../../data/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import QRCodeGenerator, { ContactInfo } from './qr-code.js';

export interface ContactCardOptions {
  format: 'vcard' | 'json' | 'pdf' | 'html' | 'all';
  includeQR: boolean;
  qrType: 'vcard' | 'linkedin' | 'portfolio' | 'email';
  theme: 'minimal' | 'professional' | 'modern' | 'creative';
  includePhoto: boolean;
  photoPath?: string;
  customFields?: { [key: string]: string };
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

export class ContactCardExporter {
  private static readonly VERSION = '1.0.0';

  /**
   * Export contact card in specified format
   */
  static async exportCard(resumeData: ResumeData, options: ContactCardOptions): Promise<string | { [key: string]: string }> {
    const businessCard = await this.createBusinessCard(resumeData, options);

    switch (options.format) {
      case 'vcard':
        return this.generateVCard(businessCard);
      case 'json':
        return this.generateJSON(businessCard);
      case 'pdf':
        return this.generatePDF(businessCard, options);
      case 'html':
        return this.generateHTML(businessCard, options);
      case 'all':
        return this.generateAll(businessCard, options);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Save contact card to file(s)
   */
  static async saveCard(resumeData: ResumeData, outputPath: string, options: ContactCardOptions): Promise<string[]> {
    const result = await this.exportCard(resumeData, options);
    const savedFiles: string[] = [];

    if (typeof result === 'string') {
      // Single format
      const extension = this.getFileExtension(options.format);
      const filePath = outputPath.endsWith(extension) ? outputPath : `${outputPath}.${extension}`;
      await this.ensureDirectoryExists(path.dirname(filePath));
      await fs.writeFile(filePath, result, 'utf8');
      savedFiles.push(filePath);
    } else {
      // Multiple formats
      const baseDir = path.dirname(outputPath);
      const baseName = path.basename(outputPath, path.extname(outputPath));
      
      for (const [format, content] of Object.entries(result)) {
        const extension = this.getFileExtension(format as ContactCardOptions['format']);
        const filePath = path.join(baseDir, `${baseName}.${extension}`);
        await this.ensureDirectoryExists(baseDir);
        await fs.writeFile(filePath, content, 'utf8');
        savedFiles.push(filePath);
      }
    }

    return savedFiles;
  }

  /**
   * Create digital business card from resume data
   */
  private static async createBusinessCard(resumeData: ResumeData, options: ContactCardOptions): Promise<DigitalBusinessCard> {
    const personal = resumeData.personal;
    const experience = resumeData.experience;
    const education = resumeData.education;

    const businessCard: DigitalBusinessCard = {
      personal: {
        name: personal.name,
        title: personal.role,
        company: experience[0]?.company,
        email: personal.email,
        phone: personal.phone,
        location: personal.location
      },
      social: {
        linkedin: personal.linkedin,
        github: personal.github,
        portfolio: personal.portfolio
      },
      professional: {
        skills: resumeData.techStack.slice(0, 8), // Top 8 skills
        experience: `${experience.length} companies, ${this.calculateYearsOfExperience(experience)} years`,
        education: education[0]?.degree
      },
      metadata: {
        createdAt: new Date().toISOString(),
        version: this.VERSION,
        format: options.format
      }
    };

    // Add QR codes if requested
    if (options.includeQR) {
      businessCard.qrCodes = await this.generateQRCodes(resumeData, options.qrType);
    }

    return businessCard;
  }

  /**
   * Generate QR codes for business card
   */
  private static async generateQRCodes(resumeData: ResumeData, qrType: ContactCardOptions['qrType']): Promise<DigitalBusinessCard['qrCodes']> {
    const qrCodes: DigitalBusinessCard['qrCodes'] = {};
    const contactInfo = this.extractContactInfo(resumeData);

    try {
      switch (qrType) {
        case 'vcard':
          qrCodes.vcard = await QRCodeGenerator.generateVCard(contactInfo, { format: 'svg', size: 150 });
          break;
        case 'linkedin':
          if (contactInfo.linkedin) {
            qrCodes.linkedin = await QRCodeGenerator.generateLinkedIn(contactInfo.linkedin, { format: 'svg', size: 150 });
          }
          break;
        case 'portfolio':
          if (contactInfo.website) {
            qrCodes.portfolio = await QRCodeGenerator.generatePortfolio(contactInfo.website, { format: 'svg', size: 150 });
          }
          break;
        case 'email':
          qrCodes.email = await QRCodeGenerator.generateEmail(contactInfo.email, 'Contact Request', '', { format: 'svg', size: 150 });
          break;
      }
    } catch (error) {
      console.warn('Failed to generate QR codes:', error);
    }

    return qrCodes;
  }

  /**
   * Generate vCard format
   */
  private static generateVCard(businessCard: DigitalBusinessCard): string {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${businessCard.personal.name}`,
      `N:${businessCard.personal.name.split(' ').reverse().join(';')};;;`,
    ];

    if (businessCard.personal.title) {
      vcard.push(`TITLE:${businessCard.personal.title}`);
    }

    if (businessCard.personal.company) {
      vcard.push(`ORG:${businessCard.personal.company}`);
    }

    vcard.push(`EMAIL:${businessCard.personal.email}`);

    if (businessCard.personal.phone) {
      vcard.push(`TEL:${businessCard.personal.phone}`);
    }

    if (businessCard.social.linkedin) {
      vcard.push(`URL:${businessCard.social.linkedin}`);
    }

    if (businessCard.social.portfolio) {
      vcard.push(`URL:${businessCard.social.portfolio}`);
    }

    if (businessCard.personal.location) {
      vcard.push(`ADR:;;;;;;${businessCard.personal.location}`);
    }

    // Add skills as notes
    if (businessCard.professional.skills.length > 0) {
      vcard.push(`NOTE:Skills: ${businessCard.professional.skills.join(', ')}`);
    }

    vcard.push('END:VCARD');
    return vcard.join('\n');
  }

  /**
   * Generate JSON format
   */
  private static generateJSON(businessCard: DigitalBusinessCard): string {
    return JSON.stringify(businessCard, null, 2);
  }

  /**
   * Generate HTML format
   */
  private static generateHTML(businessCard: DigitalBusinessCard, options: ContactCardOptions): string {
    const qrCodeHtml = businessCard.qrCodes ? this.generateQRCodeHTML(businessCard.qrCodes) : '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessCard.personal.name} - Digital Business Card</title>
    <style>
        ${this.getThemeCSS(options.theme)}
    </style>
</head>
<body>
    <div class="business-card">
        <div class="header">
            <h1 class="name">${businessCard.personal.name}</h1>
            <h2 class="title">${businessCard.personal.title}</h2>
            ${businessCard.personal.company ? `<h3 class="company">${businessCard.personal.company}</h3>` : ''}
        </div>
        
        <div class="contact-info">
            <div class="contact-item">
                <span class="label">Email:</span>
                <a href="mailto:${businessCard.personal.email}">${businessCard.personal.email}</a>
            </div>
            ${businessCard.personal.phone ? `
            <div class="contact-item">
                <span class="label">Phone:</span>
                <a href="tel:${businessCard.personal.phone}">${businessCard.personal.phone}</a>
            </div>` : ''}
            ${businessCard.personal.location ? `
            <div class="contact-item">
                <span class="label">Location:</span>
                <span>${businessCard.personal.location}</span>
            </div>` : ''}
        </div>
        
        <div class="social-links">
            ${businessCard.social.linkedin ? `<a href="${businessCard.social.linkedin}" class="social-link linkedin">LinkedIn</a>` : ''}
            ${businessCard.social.github ? `<a href="${businessCard.social.github}" class="social-link github">GitHub</a>` : ''}
            ${businessCard.social.portfolio ? `<a href="${businessCard.social.portfolio}" class="social-link portfolio">Portfolio</a>` : ''}
        </div>
        
        <div class="professional-info">
            <div class="skills">
                <h4>Skills</h4>
                <div class="skill-tags">
                    ${businessCard.professional.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="experience">
                <h4>Experience</h4>
                <p>${businessCard.professional.experience}</p>
            </div>
        </div>
        
        ${qrCodeHtml}
        
        <div class="footer">
            <p class="generated">Generated on ${new Date(businessCard.metadata.createdAt).toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate PDF format (simplified HTML-to-PDF approach)
   */
  private static generatePDF(businessCard: DigitalBusinessCard, options: ContactCardOptions): string {
    // For now, return HTML that can be converted to PDF
    // In a real implementation, you'd use a library like puppeteer or jsPDF
    const htmlContent = this.generateHTML(businessCard, options);
    return `<!-- PDF Generation Instructions -->
<!-- Use a tool like puppeteer, wkhtmltopdf, or browser print to convert this HTML to PDF -->
${htmlContent}`;
  }

  /**
   * Generate all formats
   */
  private static async generateAll(businessCard: DigitalBusinessCard, options: ContactCardOptions): Promise<{ [key: string]: string }> {
    return {
      vcard: this.generateVCard(businessCard),
      json: this.generateJSON(businessCard),
      html: this.generateHTML(businessCard, options),
      pdf: this.generatePDF(businessCard, options)
    };
  }

  /**
   * Generate QR code HTML
   */
  private static generateQRCodeHTML(qrCodes: DigitalBusinessCard['qrCodes']): string {
    if (!qrCodes || Object.keys(qrCodes).length === 0) return '';
    
    const qrItems = Object.entries(qrCodes)
      .filter(([_, code]) => code)
      .map(([type, code]) => `
        <div class="qr-item">
            <h5>${type.toUpperCase()}</h5>
            <div class="qr-code">${code}</div>
        </div>`)
      .join('');
    
    return `
        <div class="qr-codes">
            <h4>QR Codes</h4>
            <div class="qr-grid">${qrItems}
            </div>
        </div>`;
  }

  /**
   * Get theme CSS
   */
  private static getThemeCSS(theme: ContactCardOptions['theme']): string {
    const baseCSS = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
        .business-card { max-width: 600px; margin: 20px auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .name { font-size: 2.5em; margin-bottom: 10px; }
        .title { font-size: 1.3em; margin-bottom: 5px; }
        .company { font-size: 1.1em; opacity: 0.8; }
        .contact-info { margin-bottom: 25px; }
        .contact-item { margin-bottom: 10px; }
        .label { font-weight: bold; margin-right: 10px; }
        .social-links { margin-bottom: 25px; text-align: center; }
        .social-link { display: inline-block; margin: 0 10px; padding: 8px 16px; text-decoration: none; border-radius: 6px; }
        .professional-info { margin-bottom: 25px; }
        .skills h4, .experience h4 { margin-bottom: 10px; }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 0.9em; }
        .qr-codes { margin-bottom: 20px; }
        .qr-grid { display: flex; gap: 20px; justify-content: center; }
        .qr-item { text-align: center; }
        .qr-code svg { width: 100px; height: 100px; }
        .footer { text-align: center; font-size: 0.8em; opacity: 0.6; }
    `;

    const themeColors = {
      minimal: { primary: '#333', secondary: '#666', accent: '#007acc', bg: '#fff' },
      professional: { primary: '#1a1a1a', secondary: '#4a4a4a', accent: '#0066cc', bg: '#f8f9fa' },
      modern: { primary: '#2d3748', secondary: '#4a5568', accent: '#3182ce', bg: '#ffffff' },
      creative: { primary: '#2b6cb0', secondary: '#3182ce', accent: '#ed8936', bg: '#f7fafc' }
    };

    const colors = themeColors[theme];
    
    return baseCSS + `
        .business-card { background: ${colors.bg}; color: ${colors.primary}; }
        .name { color: ${colors.primary}; }
        .title { color: ${colors.secondary}; }
        .company { color: ${colors.secondary}; }
        .social-link { background: ${colors.accent}; color: white; }
        .social-link:hover { opacity: 0.8; }
        .skill-tag { background: ${colors.accent}20; color: ${colors.primary}; }
        a { color: ${colors.accent}; }
    `;
  }

  /**
   * Extract contact info from resume data
   */
  private static extractContactInfo(resumeData: ResumeData): ContactInfo {
    const personal = resumeData.personal;
    const nameParts = personal.name.split(' ');
    
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: personal.email,
      phone: personal.phone,
      website: personal.portfolio,
      linkedin: personal.linkedin,
      github: personal.github,
      title: personal.role,
      company: resumeData.experience?.[0]?.company
    };
  }

  /**
   * Calculate years of experience
   */
  private static calculateYearsOfExperience(experience: ResumeData['experience']): number {
    // Simple calculation based on number of positions
    // In a real implementation, you'd parse the dates
    return Math.max(1, experience.length * 1.5);
  }

  /**
   * Get file extension for format
   */
  private static getFileExtension(format: ContactCardOptions['format']): string {
    const extensions = {
      vcard: 'vcf',
      json: 'json',
      pdf: 'pdf',
      html: 'html',
      all: 'zip' // Would need zip implementation
    };
    return extensions[format] || 'txt';
  }

  /**
   * Ensure directory exists
   */
  private static async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  /**
   * Validate contact card options
   */
  static validateOptions(options: Partial<ContactCardOptions>): ContactCardOptions {
    return {
      format: options.format || 'json',
      includeQR: options.includeQR ?? true,
      qrType: options.qrType || 'vcard',
      theme: options.theme || 'professional',
      includePhoto: options.includePhoto ?? false,
      photoPath: options.photoPath,
      customFields: options.customFields || {}
    };
  }
}

export default ContactCardExporter;
import QRCode from 'qrcode';
import { ResumeData } from '../data/types.js';
import { promises as fs } from 'fs';
import path from 'path';

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

export class QRCodeGenerator {
  private static defaultOptions: QRCodeOptions = {
    type: 'vcard',
    format: 'png',
    size: 200,
    errorCorrectionLevel: 'M',
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  };

  /**
   * Generate QR code for vCard format
   */
  static async generateVCard(contactInfo: ContactInfo, options: Partial<QRCodeOptions> = {}): Promise<string> {
    const vCardData = this.createVCardData(contactInfo);
    const qrOptions = { ...this.defaultOptions, ...options, type: 'vcard' as const };
    return this.generateQRCode(vCardData, qrOptions);
  }

  /**
   * Generate QR code for LinkedIn profile
   */
  static async generateLinkedIn(linkedinUrl: string, options: Partial<QRCodeOptions> = {}): Promise<string> {
    const qrOptions = { ...this.defaultOptions, ...options, type: 'linkedin' as const };
    return this.generateQRCode(linkedinUrl, qrOptions);
  }

  /**
   * Generate QR code for portfolio/website
   */
  static async generatePortfolio(portfolioUrl: string, options: Partial<QRCodeOptions> = {}): Promise<string> {
    const qrOptions = { ...this.defaultOptions, ...options, type: 'portfolio' as const };
    return this.generateQRCode(portfolioUrl, qrOptions);
  }

  /**
   * Generate QR code for GitHub profile
   */
  static async generateGitHub(githubUrl: string, options: Partial<QRCodeOptions> = {}): Promise<string> {
    const qrOptions = { ...this.defaultOptions, ...options, type: 'github' as const };
    return this.generateQRCode(githubUrl, qrOptions);
  }

  /**
   * Generate QR code for email
   */
  static async generateEmail(email: string, subject?: string, body?: string, options: Partial<QRCodeOptions> = {}): Promise<string> {
    let emailData = `mailto:${email}`;
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    if (params.length > 0) {
      emailData += `?${params.join('&')}`;
    }
    
    const qrOptions = { ...this.defaultOptions, ...options, type: 'email' as const };
    return this.generateQRCode(emailData, qrOptions);
  }

  /**
   * Generate QR code for phone number
   */
  static async generatePhone(phoneNumber: string, options: Partial<QRCodeOptions> = {}): Promise<string> {
    const phoneData = `tel:${phoneNumber.replace(/[^+\d]/g, '')}`;
    const qrOptions = { ...this.defaultOptions, ...options, type: 'phone' as const };
    return this.generateQRCode(phoneData, qrOptions);
  }

  /**
   * Generate multiple QR codes from resume data
   */
  static async generateFromResumeData(resumeData: ResumeData, types: QRCodeOptions['type'][], options: Partial<QRCodeOptions> = {}): Promise<{ [key: string]: string }> {
    const results: { [key: string]: string } = {};
    const contactInfo = this.extractContactInfo(resumeData);

    for (const type of types) {
      try {
        switch (type) {
          case 'vcard':
            results.vcard = await this.generateVCard(contactInfo, options);
            break;
          case 'linkedin':
            if (contactInfo.linkedin) {
              results.linkedin = await this.generateLinkedIn(contactInfo.linkedin, options);
            }
            break;
          case 'portfolio':
            if (contactInfo.website) {
              results.portfolio = await this.generatePortfolio(contactInfo.website, options);
            }
            break;
          case 'github':
            if (contactInfo.github) {
              results.github = await this.generateGitHub(contactInfo.github, options);
            }
            break;
          case 'email':
            results.email = await this.generateEmail(contactInfo.email, 'Contact Request', '', options);
            break;
          case 'phone':
            if (contactInfo.phone) {
              results.phone = await this.generatePhone(contactInfo.phone, options);
            }
            break;
        }
      } catch (error) {
        console.warn(`Failed to generate ${type} QR code:`, error);
      }
    }

    return results;
  }

  /**
   * Save QR code to file
   */
  static async saveQRCode(qrCodeData: string, filePath: string, format: 'png' | 'svg' = 'png'): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    if (format === 'png') {
      // Remove data URL prefix for PNG
      const base64Data = qrCodeData.replace(/^data:image\/png;base64,/, '');
      await fs.writeFile(filePath, base64Data, 'base64');
    } else {
      // SVG is already in text format
      await fs.writeFile(filePath, qrCodeData, 'utf8');
    }
  }

  /**
   * Generate batch QR codes and save to directory
   */
  static async generateBatch(resumeData: ResumeData, outputDir: string, options: Partial<QRCodeOptions> = {}): Promise<{ [key: string]: string }> {
    const types: QRCodeOptions['type'][] = ['vcard', 'linkedin', 'portfolio', 'github', 'email', 'phone'];
    const qrCodes = await this.generateFromResumeData(resumeData, types, options);
    const filePaths: { [key: string]: string } = {};
    const format = options.format === 'terminal' ? 'png' : (options.format || 'png');

    for (const [type, qrData] of Object.entries(qrCodes)) {
      const fileName = `${type}-qr.${format}`;
      const filePath = path.join(outputDir, fileName);
      await this.saveQRCode(qrData, filePath, format);
      filePaths[type] = filePath;
    }

    return filePaths;
  }

  /**
   * Create vCard data string
   */
  private static createVCardData(contactInfo: ContactInfo): string {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contactInfo.firstName} ${contactInfo.lastName}`,
      `N:${contactInfo.lastName};${contactInfo.firstName};;;`,
    ];

    if (contactInfo.title) {
      vcard.push(`TITLE:${contactInfo.title}`);
    }

    if (contactInfo.company) {
      vcard.push(`ORG:${contactInfo.company}`);
    }

    vcard.push(`EMAIL:${contactInfo.email}`);

    if (contactInfo.phone) {
      vcard.push(`TEL:${contactInfo.phone}`);
    }

    if (contactInfo.website) {
      vcard.push(`URL:${contactInfo.website}`);
    }

    if (contactInfo.linkedin) {
      vcard.push(`URL:${contactInfo.linkedin}`);
    }

    if (contactInfo.address) {
      const addr = contactInfo.address;
      const addrLine = `ADR:;;${addr.street || ''};${addr.city || ''};${addr.state || ''};${addr.zip || ''};${addr.country || ''}`;
      vcard.push(addrLine);
    }

    vcard.push('END:VCARD');
    return vcard.join('\n');
  }

  /**
   * Extract contact information from resume data
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
      company: resumeData.experience?.[0]?.company,
      address: {
        city: personal.location,
        country: 'US' // Default, could be made configurable
      }
    };
  }

  /**
   * Core QR code generation method
   */
  private static async generateQRCode(data: string, options: QRCodeOptions): Promise<string> {
    if (options.format === 'terminal') {
      return QRCode.toString(data, { type: 'terminal', small: true });
    } else if (options.format === 'svg') {
      return QRCode.toString(data, {
        type: 'svg',
        errorCorrectionLevel: options.errorCorrectionLevel,
        margin: options.margin,
        color: options.color,
        width: options.size
      });
    } else {
      return QRCode.toDataURL(data, {
        errorCorrectionLevel: options.errorCorrectionLevel,
        margin: options.margin,
        color: options.color,
        width: options.size
      });
    }
  }

  /**
   * Validate URL format
   */
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[^+\d]/g, ''));
  }
}

export default QRCodeGenerator;
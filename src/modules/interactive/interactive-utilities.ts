import chalk from 'chalk';
import inquirer from 'inquirer';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';
import { UserConfig, ResumeData } from '../../data/types.js';
import { getThemeColors } from '../core/config.js';

/**
 * Generate QR code for resume or contact info
 */
export async function generateQRCode(resumeData: ResumeData): Promise<void> {
  const colors = getThemeColors({ theme: 'colorful', favorites: [] });
  
  console.log((chalk as any)[colors.primary].bold('\n📱 QR Code Generator\n'));
  
  const { qrType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'qrType',
      message: 'What would you like to generate a QR code for?',
      choices: [
        { name: '🌐 Resume Website/Portfolio', value: 'website' },
        { name: '📧 Email Contact', value: 'email' },
        { name: '📱 Phone Number', value: 'phone' },
        { name: '💼 LinkedIn Profile', value: 'linkedin' },
        { name: '🐙 GitHub Profile', value: 'github' },
        { name: '📄 Resume PDF Link', value: 'pdf' },
        { name: '📇 vCard Contact', value: 'vcard' },
        { name: '🔗 Custom URL', value: 'custom' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (qrType === 'back') return;
  
  try {
    let qrData = '';
    let filename = '';
    
    switch (qrType) {
      case 'website':
        qrData = await getWebsiteQRData(resumeData, colors);
        filename = 'resume-website-qr.png';
        break;
      case 'email':
        qrData = await getEmailQRData(resumeData, colors);
        filename = 'email-contact-qr.png';
        break;
      case 'phone':
        qrData = await getPhoneQRData(resumeData, colors);
        filename = 'phone-contact-qr.png';
        break;
      case 'linkedin':
        qrData = await getLinkedInQRData(resumeData, colors);
        filename = 'linkedin-profile-qr.png';
        break;
      case 'github':
        qrData = await getGitHubQRData(resumeData, colors);
        filename = 'github-profile-qr.png';
        break;
      case 'pdf':
        qrData = await getPDFQRData(resumeData, colors);
        filename = 'resume-pdf-qr.png';
        break;
      case 'vcard':
        qrData = await getVCardQRData(resumeData, colors);
        filename = 'vcard-contact-qr.png';
        break;
      case 'custom':
        qrData = await getCustomQRData(resumeData, colors);
        filename = 'custom-qr.png';
        break;
    }
    
    if (qrData) {
      await generateAndSaveQR(qrData, filename, resumeData, colors);
    }
    
  } catch (error) {
    console.log((chalk as any)[colors.error](`\n❌ Error generating QR code: ${error}\n`));
  }
}

/**
 * Get website QR data
 */
async function getWebsiteQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const { websiteUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'websiteUrl',
      message: 'Enter your portfolio/website URL:',
      default: resumeData.personal?.portfolio || '',
      validate: (input: string) => {
        if (!input.trim()) return 'URL is required';
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    }
  ]);
  
  return websiteUrl;
}

/**
 * Get email QR data
 */
async function getEmailQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const { email, subject, body } = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Enter email address:',
      default: resumeData.personal?.email || '',
      validate: (input: string) => {
        if (!input.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || 'Please enter a valid email address';
      }
    },
    {
      type: 'input',
      name: 'subject',
      message: 'Email subject (optional):',
      default: 'Regarding Your Resume'
    },
    {
      type: 'input',
      name: 'body',
      message: 'Email body (optional):',
      default: 'Hello, I found your resume and would like to discuss opportunities.'
    }
  ]);
  
  let mailto = `mailto:${email}`;
  const params = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  if (params.length > 0) {
    mailto += '?' + params.join('&');
  }
  
  return mailto;
}

/**
 * Get phone QR data
 */
async function getPhoneQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const { phone } = await inquirer.prompt([
    {
      type: 'input',
      name: 'phone',
      message: 'Enter phone number:',
      default: resumeData.personal?.phone || '',
      validate: (input: string) => input.trim().length > 0 || 'Phone number is required'
    }
  ]);
  
  return `tel:${phone.replace(/\D/g, '')}`;
}

/**
 * Get LinkedIn QR data
 */
async function getLinkedInQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const { linkedinUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'linkedinUrl',
      message: 'Enter LinkedIn profile URL:',
      default: resumeData.personal?.linkedin || '',
      validate: (input: string) => {
        if (!input.trim()) return 'LinkedIn URL is required';
        if (!input.includes('linkedin.com')) return 'Please enter a valid LinkedIn URL';
        return true;
      }
    }
  ]);
  
  return linkedinUrl;
}

/**
 * Get GitHub QR data
 */
async function getGitHubQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const { githubUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'githubUrl',
      message: 'Enter GitHub profile URL:',
      default: resumeData.personal?.github || '',
      validate: (input: string) => {
        if (!input.trim()) return 'GitHub URL is required';
        if (!input.includes('github.com')) return 'Please enter a valid GitHub URL';
        return true;
      }
    }
  ]);
  
  return githubUrl;
}

/**
 * Get PDF QR data
 */
async function getPDFQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const { pdfUrl } = await inquirer.prompt([
    {
      type: 'input',
      name: 'pdfUrl',
      message: 'Enter resume PDF URL:',
      validate: (input: string) => {
        if (!input.trim()) return 'PDF URL is required';
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    }
  ]);
  
  return pdfUrl;
}

/**
 * Get vCard QR data
 */
async function getVCardQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const personalInfo = resumeData.personal || {};
  
  const { name, email, phone, organization, title, website } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Full name:',
      default: personalInfo.name || '',
      validate: (input: string) => input.trim().length > 0 || 'Name is required'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email:',
      default: personalInfo.email || ''
    },
    {
      type: 'input',
      name: 'phone',
      message: 'Phone:',
      default: personalInfo.phone || ''
    },
    {
      type: 'input',
      name: 'organization',
      message: 'Organization:',
      default: personalInfo.role || ''
    },
    {
      type: 'input',
      name: 'title',
      message: 'Job title:',
      default: personalInfo.role || ''
    },
    {
      type: 'input',
      name: 'website',
      message: 'Website:',
      default: personalInfo.portfolio || ''
    }
  ]);
  
  // Generate vCard format
  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';
  vcard += `FN:${name}\n`;
  if (email) vcard += `EMAIL:${email}\n`;
  if (phone) vcard += `TEL:${phone}\n`;
  if (organization) vcard += `ORG:${organization}\n`;
  if (title) vcard += `TITLE:${title}\n`;
  if (website) vcard += `URL:${website}\n`;
  vcard += 'END:VCARD';
  
  return vcard;
}

/**
 * Get custom QR data
 */
async function getCustomQRData(resumeData: ResumeData, colors: any): Promise<string> {
  const { customData } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customData',
      message: 'Enter custom data for QR code:',
      validate: (input: string) => input.trim().length > 0 || 'Data is required'
    }
  ]);
  
  return customData;
}

/**
 * Generate and save QR code
 */
async function generateAndSaveQR(data: string, filename: string, resumeData: ResumeData, colors: any): Promise<void> {
  const { customFilename, size, errorLevel } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customFilename',
      message: 'Filename:',
      default: filename
    },
    {
      type: 'list',
      name: 'size',
      message: 'QR code size:',
      choices: [
        { name: 'Small (200x200)', value: 200 },
        { name: 'Medium (400x400)', value: 400 },
        { name: 'Large (600x600)', value: 600 },
        { name: 'Extra Large (800x800)', value: 800 }
      ],
      default: 400
    },
    {
      type: 'list',
      name: 'errorLevel',
      message: 'Error correction level:',
      choices: [
        { name: 'Low (~7%)', value: 'L' },
        { name: 'Medium (~15%)', value: 'M' },
        { name: 'Quartile (~25%)', value: 'Q' },
        { name: 'High (~30%)', value: 'H' }
      ],
      default: 'M'
    }
  ]);
  
  try {
    const outputPath = path.join(process.cwd(), 'output', customFilename);
    
    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Generate QR code
    await QRCode.toFile(outputPath, data, {
      width: size,
      errorCorrectionLevel: errorLevel,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log((chalk as any)[colors.success](`\n✅ QR code generated successfully!`));
    console.log((chalk as any)[colors.muted](`📁 Saved to: ${outputPath}`));
    console.log((chalk as any)[colors.muted](`📊 Size: ${size}x${size}px`));
    console.log((chalk as any)[colors.muted](`🔧 Error correction: ${errorLevel}\n`));
    
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`);
  }
}

/**
 * Export contact card in various formats
 */
export async function exportContactCard(resumeData: ResumeData): Promise<void> {
  const colors = getThemeColors({ theme: 'colorful', favorites: [] });
  
  console.log((chalk as any)[colors.primary].bold('\n📇 Export Contact Card\n'));
  
  const { exportFormat } = await inquirer.prompt([
    {
      type: 'list',
      name: 'exportFormat',
      message: 'Select contact card format:',
      choices: [
        { name: '📇 vCard (.vcf)', value: 'vcard' },
        { name: '📄 JSON', value: 'json' },
        { name: '📊 CSV', value: 'csv' },
        { name: '📝 Text', value: 'txt' },
        { name: '🌐 HTML Business Card', value: 'html' },
        { name: '🔙 Back', value: 'back' }
      ]
    }
  ]);
  
  if (exportFormat === 'back') return;
  
  try {
    const personalInfo = resumeData.personal || {};
    
    // Get contact information
    const contactData = await getContactData(personalInfo, colors);
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const baseName = contactData.name.toLowerCase().replace(/\s+/g, '-');
    
    let filename = '';
    let content = '';
    
    switch (exportFormat) {
      case 'vcard':
        filename = `${baseName}-contact.vcf`;
        content = generateVCard(contactData);
        break;
      case 'json':
        filename = `${baseName}-contact.json`;
        content = JSON.stringify(contactData, null, 2);
        break;
      case 'csv':
        filename = `${baseName}-contact.csv`;
        content = generateCSV(contactData);
        break;
      case 'txt':
        filename = `${baseName}-contact.txt`;
        content = generateTextCard(contactData);
        break;
      case 'html':
        filename = `${baseName}-business-card.html`;
        content = generateHTMLCard(contactData, { theme: 'colorful', favorites: [] });
        break;
    }
    
    // Save file
    const outputPath = path.join(process.cwd(), 'output', filename);
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, content, 'utf8');
    
    console.log((chalk as any)[colors.success](`\n✅ Contact card exported successfully!`));
    console.log(chalk.gray(`📁 Saved to: ${outputPath}\n`));
    
  } catch (error) {
    console.log((chalk as any)[colors.error](`\n❌ Error exporting contact card: ${error}\n`));
  }
}

/**
 * Get contact data from user
 */
async function getContactData(personalInfo: any, colors: any): Promise<any> {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Full name:',
      default: personalInfo.name || '',
      validate: (input: string) => input.trim().length > 0 || 'Name is required'
    },
    {
      type: 'input',
      name: 'email',
      message: 'Email:',
      default: personalInfo.email || ''
    },
    {
      type: 'input',
      name: 'phone',
      message: 'Phone:',
      default: personalInfo.phone || ''
    },
    {
      type: 'input',
      name: 'company',
      message: 'Company:',
      default: personalInfo.company || ''
    },
    {
      type: 'input',
      name: 'title',
      message: 'Job title:',
      default: personalInfo.title || ''
    },
    {
      type: 'input',
      name: 'website',
      message: 'Website:',
      default: personalInfo.website || ''
    },
    {
      type: 'input',
      name: 'linkedin',
      message: 'LinkedIn:',
      default: personalInfo.linkedin || ''
    },
    {
      type: 'input',
      name: 'github',
      message: 'GitHub:',
      default: personalInfo.github || ''
    },
    {
      type: 'input',
      name: 'address',
      message: 'Address:',
      default: personalInfo.address || ''
    }
  ]);
}

/**
 * Generate vCard format
 */
function generateVCard(data: any): string {
  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';
  vcard += `FN:${data.name}\n`;
  if (data.email) vcard += `EMAIL:${data.email}\n`;
  if (data.phone) vcard += `TEL:${data.phone}\n`;
  if (data.company) vcard += `ORG:${data.company}\n`;
  if (data.title) vcard += `TITLE:${data.title}\n`;
  if (data.website) vcard += `URL:${data.website}\n`;
  if (data.address) vcard += `ADR:;;${data.address};;;;\n`;
  vcard += 'END:VCARD';
  return vcard;
}

/**
 * Generate CSV format
 */
function generateCSV(data: any): string {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Title', 'Website', 'LinkedIn', 'GitHub', 'Address'];
  const values = [
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.title || '',
    data.website || '',
    data.linkedin || '',
    data.github || '',
    data.address || ''
  ];
  
  return headers.join(',') + '\n' + values.map(v => `"${v}"`).join(',');
}

/**
 * Generate text format
 */
function generateTextCard(data: any): string {
  let text = `CONTACT CARD\n`;
  text += `${'='.repeat(50)}\n\n`;
  text += `Name: ${data.name}\n`;
  if (data.title) text += `Title: ${data.title}\n`;
  if (data.company) text += `Company: ${data.company}\n`;
  if (data.email) text += `Email: ${data.email}\n`;
  if (data.phone) text += `Phone: ${data.phone}\n`;
  if (data.website) text += `Website: ${data.website}\n`;
  if (data.linkedin) text += `LinkedIn: ${data.linkedin}\n`;
  if (data.github) text += `GitHub: ${data.github}\n`;
  if (data.address) text += `Address: ${data.address}\n`;
  text += `\nGenerated on: ${new Date().toLocaleDateString()}\n`;
  return text;
}

/**
 * Generate HTML business card
 */
function generateHTMLCard(data: any, config: UserConfig): string {
  const colors = getThemeColors(config);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Business Card</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .business-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .business-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary});
        }
        
        .name {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        
        .title {
            font-size: 16px;
            color: ${colors.primary};
            margin-bottom: 5px;
        }
        
        .company {
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
        }
        
        .contact-info {
            text-align: left;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 14px;
            color: #555;
        }
        
        .contact-item .icon {
            width: 20px;
            margin-right: 15px;
            text-align: center;
            color: ${colors.primary};
        }
        
        .contact-item a {
            color: ${colors.primary};
            text-decoration: none;
        }
        
        .contact-item a:hover {
            text-decoration: underline;
        }
        
        .social-links {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        
        .social-link {
            display: inline-block;
            padding: 10px;
            background: ${colors.primary};
            color: white;
            border-radius: 50%;
            text-decoration: none;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }
        
        .social-link:hover {
            transform: translateY(-3px);
        }
        
        @media print {
            body {
                background: white;
            }
            
            .business-card {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="business-card">
        <div class="name">${data.name}</div>
        ${data.title ? `<div class="title">${data.title}</div>` : ''}
        ${data.company ? `<div class="company">${data.company}</div>` : ''}
        
        <div class="contact-info">
            ${data.email ? `
            <div class="contact-item">
                <span class="icon">📧</span>
                <a href="mailto:${data.email}">${data.email}</a>
            </div>` : ''}
            
            ${data.phone ? `
            <div class="contact-item">
                <span class="icon">📱</span>
                <a href="tel:${data.phone}">${data.phone}</a>
            </div>` : ''}
            
            ${data.website ? `
            <div class="contact-item">
                <span class="icon">🌐</span>
                <a href="${data.website}" target="_blank">${data.website}</a>
            </div>` : ''}
            
            ${data.address ? `
            <div class="contact-item">
                <span class="icon">📍</span>
                <span>${data.address}</span>
            </div>` : ''}
        </div>
        
        ${(data.linkedin || data.github) ? `
        <div class="social-links">
            ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="social-link">💼</a>` : ''}
            ${data.github ? `<a href="${data.github}" target="_blank" class="social-link">🐙</a>` : ''}
        </div>` : ''}
    </div>
</body>
</html>`;
}

/**
 * Utility functions for file operations
 */
export async function createOutputDirectory(): Promise<void> {
  const outputDir = path.join(process.cwd(), 'output');
  await fs.mkdir(outputDir, { recursive: true });
}

/**
 * Get file size in human readable format
 */
export function getFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate URL format
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
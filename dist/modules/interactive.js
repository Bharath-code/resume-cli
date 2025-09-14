import chalk from 'chalk';
import inquirer from 'inquirer';
import qrcode from 'qrcode';
import clipboardy from 'clipboardy';
import fs from 'fs';
import { formatColoredResume, formatPlainResume, formatJsonResume, formatHtmlResume, formatPdfResume } from './formatting.js';
/**
 * Main interactive mode function
 */
export async function runInteractiveMode(resumeData) {
    console.log(chalk.cyanBright.bold('\n🚀 Interactive Resume Navigator\n'));
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    { name: '📄 View Resume Sections', value: 'sections' },
                    { name: '📱 Generate QR Codes', value: 'qr' },
                    { name: '📋 Copy Contact Info', value: 'clipboard' },
                    { name: '💾 Export Resume', value: 'export' },
                    { name: '❌ Exit', value: 'exit' }
                ]
            }
        ]);
        switch (action) {
            case 'sections':
                await navigateSections(resumeData);
                break;
            case 'qr':
                await generateQRCodes(resumeData);
                break;
            case 'clipboard':
                await copyToClipboard(resumeData);
                break;
            case 'export':
                await exportResume(resumeData);
                break;
            case 'exit':
                console.log(chalk.greenBright('\n👋 Thanks for using the interactive resume!\n'));
                return;
        }
    }
}
/**
 * Navigate through resume sections
 */
export async function navigateSections(resumeData) {
    const sectionChoices = [
        { name: '👤 Personal Info', value: 'personal' },
        { name: '📝 Profile Summary', value: 'profile' },
        { name: '⚡ Tech Stack', value: 'techStack' },
        { name: '💼 Work Experience', value: 'experience' },
        { name: '🚀 Projects', value: 'projects' },
        { name: '👥 Leadership', value: 'leadership' },
        { name: '🌟 Open Source', value: 'openSource' },
        { name: '🎓 Education', value: 'education' },
        { name: '📊 View All Sections', value: 'all' },
        { name: '⬅️  Back to Main Menu', value: 'back' }
    ];
    while (true) {
        const { section } = await inquirer.prompt([
            {
                type: 'list',
                name: 'section',
                message: 'Which section would you like to view?',
                choices: sectionChoices
            }
        ]);
        if (section === 'back')
            break;
        const sections = section === 'all' ? undefined : [section];
        const output = formatColoredResume(resumeData, sections);
        console.log('\n' + output);
        // Ask if user wants to view another section
        const { continueViewing } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueViewing',
                message: 'Would you like to view another section?',
                default: true
            }
        ]);
        if (!continueViewing)
            break;
    }
}
/**
 * Generate QR codes for contact information
 */
export async function generateQRCodes(resumeData) {
    const qrChoices = [
        { name: '📧 Email', value: 'email' },
        { name: '📱 Phone', value: 'phone' },
        { name: '💼 LinkedIn', value: 'linkedin' },
        { name: '🐙 GitHub', value: 'github' },
        { name: '🌐 Portfolio', value: 'portfolio' },
        { name: '⬅️  Back to Main Menu', value: 'back' }
    ];
    while (true) {
        const { contact } = await inquirer.prompt([
            {
                type: 'list',
                name: 'contact',
                message: 'Generate QR code for which contact method?',
                choices: qrChoices
            }
        ]);
        if (contact === 'back')
            break;
        let contactData = '';
        let contactLabel = '';
        switch (contact) {
            case 'email':
                contactData = `mailto:${resumeData.personal.email}`;
                contactLabel = 'Email';
                break;
            case 'phone':
                contactData = `tel:${resumeData.personal.phone}`;
                contactLabel = 'Phone';
                break;
            case 'linkedin':
                contactData = resumeData.personal.linkedin;
                contactLabel = 'LinkedIn';
                break;
            case 'github':
                contactData = resumeData.personal.github;
                contactLabel = 'GitHub';
                break;
            case 'portfolio':
                contactData = resumeData.personal.portfolio;
                contactLabel = 'Portfolio';
                break;
        }
        try {
            console.log(`\n${chalk.cyanBright.bold(`QR Code for ${contactLabel}:`)}`);
            console.log(chalk.dim(`Data: ${contactData}\n`));
            const qrString = await qrcode.toString(contactData, {
                type: 'terminal',
                small: true
            });
            console.log(qrString);
            console.log(chalk.yellowBright('📱 Scan with your phone to access this contact info!\n'));
        }
        catch (error) {
            console.error(chalk.red(`Error generating QR code: ${error.message}`));
        }
        // Ask if user wants to generate another QR code
        const { continueQR } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueQR',
                message: 'Would you like to generate another QR code?',
                default: true
            }
        ]);
        if (!continueQR)
            break;
    }
}
/**
 * Copy contact information to clipboard
 */
export async function copyToClipboard(resumeData) {
    const clipboardChoices = [
        { name: '📧 Email Address', value: 'email' },
        { name: '📱 Phone Number', value: 'phone' },
        { name: '💼 LinkedIn Profile', value: 'linkedin' },
        { name: '🐙 GitHub Profile', value: 'github' },
        { name: '🌐 Portfolio Website', value: 'portfolio' },
        { name: '📝 All Contact Info', value: 'all' },
        { name: '⬅️  Back to Main Menu', value: 'back' }
    ];
    while (true) {
        const { contact } = await inquirer.prompt([
            {
                type: 'list',
                name: 'contact',
                message: 'What would you like to copy to clipboard?',
                choices: clipboardChoices
            }
        ]);
        if (contact === 'back')
            break;
        let clipboardData = '';
        let contactLabel = '';
        switch (contact) {
            case 'email':
                clipboardData = resumeData.personal.email;
                contactLabel = 'Email address';
                break;
            case 'phone':
                clipboardData = resumeData.personal.phone;
                contactLabel = 'Phone number';
                break;
            case 'linkedin':
                clipboardData = resumeData.personal.linkedin;
                contactLabel = 'LinkedIn profile';
                break;
            case 'github':
                clipboardData = resumeData.personal.github;
                contactLabel = 'GitHub profile';
                break;
            case 'portfolio':
                clipboardData = resumeData.personal.portfolio;
                contactLabel = 'Portfolio website';
                break;
            case 'all':
                clipboardData = `${resumeData.personal.name}\n${resumeData.personal.email}\n${resumeData.personal.phone}\n${resumeData.personal.linkedin}\n${resumeData.personal.github}\n${resumeData.personal.portfolio}`;
                contactLabel = 'All contact information';
                break;
        }
        try {
            await clipboardy.write(clipboardData);
            console.log(chalk.greenBright(`\n✅ ${contactLabel} copied to clipboard!\n`));
        }
        catch (error) {
            console.error(chalk.red(`Error copying to clipboard: ${error.message}`));
        }
        // Ask if user wants to copy something else
        const { continueCopy } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueCopy',
                message: 'Would you like to copy something else?',
                default: true
            }
        ]);
        if (!continueCopy)
            break;
    }
}
/**
 * Export resume in different formats
 */
export async function exportResume(resumeData) {
    const { format } = await inquirer.prompt([
        {
            type: 'list',
            name: 'format',
            message: 'Which format would you like to export?',
            choices: [
                { name: '🎨 Colored (Terminal)', value: 'colored' },
                { name: '📝 Plain Text', value: 'plain' },
                { name: '📊 JSON', value: 'json' },
                { name: '🌐 HTML (Web)', value: 'html' },
                { name: '📄 PDF (Print)', value: 'pdf' }
            ]
        }
    ]);
    const { filename } = await inquirer.prompt([
        {
            type: 'input',
            name: 'filename',
            message: 'Enter filename (without extension):',
            default: 'bharathkumar-resume'
        }
    ]);
    const extensions = {
        colored: 'txt',
        plain: 'txt',
        json: 'json',
        html: 'html',
        pdf: 'pdf'
    };
    const fullFilename = `${filename}.${extensions[format]}`;
    let output;
    let isBuffer = false;
    try {
        switch (format) {
            case 'json':
                output = formatJsonResume(resumeData);
                break;
            case 'plain':
                output = formatPlainResume(resumeData);
                break;
            case 'html':
                output = formatHtmlResume(resumeData);
                break;
            case 'pdf':
                console.log(chalk.yellowBright('\n⏳ Generating PDF... This may take a moment.'));
                output = await formatPdfResume(resumeData);
                isBuffer = true;
                break;
            case 'colored':
            default:
                output = formatColoredResume(resumeData);
                break;
        }
        if (isBuffer) {
            fs.writeFileSync(fullFilename, output);
        }
        else {
            fs.writeFileSync(fullFilename, output, 'utf8');
        }
        console.log(chalk.greenBright(`\n✅ Resume exported successfully to ${fullFilename}!\n`));
    }
    catch (error) {
        console.error(chalk.red(`Error exporting resume: ${error.message}`));
    }
}
//# sourceMappingURL=interactive.js.map
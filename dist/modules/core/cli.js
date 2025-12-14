import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadResumeData, validateSections } from './data.js';
import { formatColoredResume, formatPlainResume, formatJsonResume, formatHtmlResume, formatPdfResume } from '../export/formatting.js';
import { runInteractiveMode } from '../interactive/interactive.js';
import { exportResume, getAvailableTemplates, getTemplateByName, EXPORT_TEMPLATES } from '../export/export.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load package.json for version info
const packageJsonPath = path.join(__dirname, '../../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
/**
 * Create and configure the CLI program
 */
export function createProgram() {
    const program = new Command();
    program
        .name('bharathkumar-palanisamy')
        .description('CLI resume for Bharathkumar Palanisamy - Full-Stack Engineer')
        .version(packageJson.version);
    program
        .option('-f, --format <type>', 'output format (colored, plain, json, html, pdf, markdown, latex, linkedin, twitter, jsonld, ats, portfolio, api)', 'colored')
        .option('-s, --section <sections...>', 'specific sections to display (personal, profile, techStack, experience, projects, leadership, openSource, education)')
        .option('-o, --output <file>', 'save resume to file')
        .option('-c, --config <path>', 'path to custom resume.json file')
        .option('-t, --template <name>', 'use predefined template (github_profile, academic_cv, linkedin_summary, twitter_bio, tech_resume, creative_portfolio)')
        .option('-i, --interactive', 'enable interactive navigation mode')
        .option('--list-templates', 'list available templates')
        .action(async (options) => {
        await handleCliAction(options);
    });
    return program;
}
/**
 * Handle CLI action based on provided options
 */
export async function handleCliAction(options) {
    // Handle list templates option
    if (options.listTemplates) {
        console.log('Available templates:');
        const templates = getAvailableTemplates();
        templates.forEach(template => {
            console.log(`  ${template.name} (${template.format}) - ${template.style || 'default'} style`);
            console.log(`    Sections: ${template.sections.join(', ')}`);
            if (template.industry) {
                console.log(`    Industry: ${template.industry}`);
            }
            console.log('');
        });
        return;
    }
    // Handle interactive mode
    if (options.interactive) {
        const resumeData = loadResumeData(options.config);
        await runInteractiveMode(resumeData);
        return;
    }
    let output;
    let isBuffer = false;
    const sections = options.section;
    // Validate sections if provided
    if (sections) {
        const validationResult = validateSections(sections);
        if (validationResult.invalid.length > 0) {
            console.error(`Invalid sections: ${validationResult.invalid.join(', ')}`);
            console.error(`Valid sections: ${validationResult.valid.join(', ')}`);
            process.exit(1);
        }
    }
    // Load resume data
    const resumeData = loadResumeData(options.config);
    // Generate output based on format
    const format = options.format;
    // Handle new export formats
    if (['markdown', 'latex', 'linkedin', 'twitter', 'jsonld', 'ats', 'portfolio', 'api'].includes(format)) {
        let template = undefined;
        // Use specified template or default based on format
        if (options.template) {
            template = getTemplateByName(options.template);
            if (!template) {
                console.error(`Template '${options.template}' not found.`);
                console.error('Use --list-templates to see available templates.');
                process.exit(1);
            }
        }
        else {
            // Auto-select template based on format
            const defaultTemplates = {
                'markdown': 'github_profile',
                'latex': 'academic_cv',
                'linkedin': 'linkedin_summary',
                'twitter': 'twitter_bio',
                'jsonld': 'tech_resume',
                'ats': 'tech_resume',
                'portfolio': 'creative_portfolio',
                'api': 'tech_resume'
            };
            const templateName = defaultTemplates[format];
            template = Object.values(EXPORT_TEMPLATES).find(t => t.name === templateName);
        }
        const exportOptions = {
            format,
            template,
            customSections: sections,
            includeContact: true
        };
        // Set character limits for social media formats
        if (format === 'linkedin') {
            exportOptions.maxLength = 2000;
        }
        else if (format === 'twitter') {
            exportOptions.maxLength = 160;
        }
        try {
            output = exportResume(resumeData, exportOptions);
        }
        catch (error) {
            console.error(`Error generating ${format} export: ${error.message}`);
            process.exit(1);
        }
    }
    else {
        // Handle existing formats
        switch (format) {
            case 'json':
                output = formatJsonResume(resumeData, sections || undefined);
                break;
            case 'plain':
                output = formatPlainResume(resumeData, sections || undefined);
                break;
            case 'html':
                output = formatHtmlResume(resumeData, sections || undefined);
                break;
            case 'pdf':
                try {
                    output = await formatPdfResume(resumeData, sections || undefined);
                    isBuffer = true;
                }
                catch (error) {
                    console.error(`Error generating PDF: ${error.message}`);
                    process.exit(1);
                }
                break;
            case 'colored':
            default:
                output = formatColoredResume(resumeData, sections || undefined);
                break;
        }
    }
    // Output to file or console
    if (options.output) {
        try {
            if (isBuffer) {
                fs.writeFileSync(options.output, output);
            }
            else {
                fs.writeFileSync(options.output, output, 'utf8');
            }
            console.log(`Resume saved to ${options.output}`);
        }
        catch (error) {
            console.error(`Error writing to file: ${error.message}`);
            process.exit(1);
        }
    }
    else {
        if (isBuffer) {
            console.log('PDF format requires an output file. Use -o option to specify output file.');
        }
        else {
            console.log(output);
        }
    }
}
/**
 * Parse command line arguments and run the program
 */
export function runCli() {
    const program = createProgram();
    program.parse();
}
//# sourceMappingURL=cli.js.map
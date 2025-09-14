import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadResumeData, validateSections } from './data.js';
import { formatColoredResume, formatPlainResume, formatJsonResume, formatHtmlResume, formatPdfResume } from './formatting.js';
import { runInteractiveMode } from './interactive.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load package.json for version info
const packageJsonPath = path.join(__dirname, '../../package.json');
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
        .option('-f, --format <type>', 'output format (colored, plain, json, html, pdf)', 'colored')
        .option('-s, --section <sections...>', 'specific sections to display (personal, profile, techStack, experience, projects, leadership, openSource, education)')
        .option('-o, --output <file>', 'save resume to file')
        .option('-i, --interactive', 'enable interactive navigation mode')
        .action(async (options) => {
        await handleCliAction(options);
    });
    return program;
}
/**
 * Handle CLI action based on provided options
 */
export async function handleCliAction(options) {
    // Handle interactive mode
    if (options.interactive) {
        const resumeData = loadResumeData();
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
    const resumeData = loadResumeData();
    // Generate output based on format
    const format = options.format;
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
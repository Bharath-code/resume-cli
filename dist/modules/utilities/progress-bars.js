import cliProgress from 'cli-progress';
import chalk from 'chalk';
import ora from 'ora';
/**
 * Enhanced Progress Bar Manager for resume CLI
 */
export class ProgressBarManager {
    /**
     * Create a new progress bar for operations
     */
    static createProgressBar(title, total = 100, colors) {
        const primaryColor = colors?.primary || '#00ff00';
        const secondaryColor = colors?.secondary || '#ffffff';
        this.progressBar = new cliProgress.SingleBar({
            format: `${chalk.hex(primaryColor)(title)} |${chalk.hex(primaryColor)('{bar}')}| {percentage}% | {value}/{total} | ETA: {eta}s`,
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true,
            barsize: 30,
            stopOnComplete: true,
            clearOnComplete: false
        });
        this.progressBar.start(total, 0);
        return this.progressBar;
    }
    /**
     * Update progress bar value
     */
    static updateProgress(value, payload) {
        if (this.progressBar) {
            this.progressBar.update(value, payload);
        }
    }
    /**
     * Complete and stop progress bar
     */
    static completeProgress() {
        if (this.progressBar) {
            this.progressBar.stop();
            this.progressBar = null;
        }
    }
    /**
     * Create animated spinner for indeterminate operations
     */
    static createSpinner(text, spinnerType = 'dots', color = 'cyan') {
        this.spinner = ora({
            text,
            spinner: spinnerType,
            color
        }).start();
        return this.spinner;
    }
    /**
     * Update spinner text
     */
    static updateSpinner(text) {
        if (this.spinner) {
            this.spinner.text = text;
        }
    }
    /**
     * Complete spinner with success
     */
    static succeedSpinner(text) {
        if (this.spinner) {
            this.spinner.succeed(text);
            this.spinner = null;
        }
    }
    /**
     * Complete spinner with failure
     */
    static failSpinner(text) {
        if (this.spinner) {
            this.spinner.fail(text);
            this.spinner = null;
        }
    }
    /**
     * Stop spinner without status
     */
    static stopSpinner() {
        if (this.spinner) {
            this.spinner.stop();
            this.spinner = null;
        }
    }
    /**
     * Create multi-step progress indicator
     */
    static createMultiStepProgress(steps, colors) {
        return new MultiStepProgress(steps, colors);
    }
}
ProgressBarManager.progressBar = null;
ProgressBarManager.spinner = null;
/**
 * Multi-step progress indicator class
 */
export class MultiStepProgress {
    constructor(steps, colors) {
        this.currentStep = 0;
        this.steps = steps;
        this.colors = colors || {
            primary: '#00ff00',
            secondary: '#ffffff',
            accent: '#ffff00',
            success: '#00ff00',
            error: '#ff0000',
            warning: '#ffff00',
            muted: '#888888'
        };
        this.displayProgress();
    }
    /**
     * Move to next step
     */
    nextStep(customMessage) {
        if (this.currentStep < this.steps.length) {
            this.currentStep++;
            this.displayProgress(customMessage);
        }
    }
    /**
     * Complete all steps
     */
    complete(message = 'All steps completed!') {
        this.currentStep = this.steps.length;
        console.log(`\n${chalk.hex(this.colors.primary)('✅')} ${chalk.hex(this.colors.accent)(message)}\n`);
    }
    /**
     * Display current progress
     */
    displayProgress(customMessage) {
        console.clear();
        console.log(chalk.hex(this.colors.primary).bold('\n📋 Progress Overview\n'));
        this.steps.forEach((step, index) => {
            const stepNumber = index + 1;
            let icon;
            let color;
            let status;
            if (index < this.currentStep) {
                icon = '✅';
                color = this.colors.primary;
                status = 'Completed';
            }
            else if (index === this.currentStep) {
                icon = '🔄';
                color = this.colors.accent;
                status = customMessage || 'In Progress';
            }
            else {
                icon = '⏳';
                color = this.colors.secondary;
                status = 'Pending';
            }
            console.log(`${icon} ${chalk.hex(color)(`Step ${stepNumber}:`)} ${step} - ${chalk.hex(color)(status)}`);
        });
        console.log('');
    }
    /**
     * Get current step information
     */
    getCurrentStep() {
        return {
            step: this.currentStep + 1,
            total: this.steps.length,
            description: this.steps[this.currentStep] || 'Completed'
        };
    }
}
/**
 * Predefined progress configurations for common operations
 */
export const ProgressConfigs = {
    export: {
        steps: [
            'Validating resume data',
            'Applying formatting',
            'Generating output',
            'Writing to file',
            'Finalizing export'
        ],
        spinners: {
            validation: { text: 'Validating resume data...', spinner: 'dots' },
            formatting: { text: 'Applying formatting...', spinner: 'line' },
            generation: { text: 'Generating output...', spinner: 'pipe' },
            writing: { text: 'Writing to file...', spinner: 'star' },
            finalizing: { text: 'Finalizing export...', spinner: 'toggle' }
        }
    },
    analysis: {
        steps: [
            'Loading resume data',
            'Analyzing content',
            'Calculating metrics',
            'Generating insights',
            'Preparing report'
        ],
        spinners: {
            loading: { text: 'Loading resume data...', spinner: 'dots2' },
            analyzing: { text: 'Analyzing content...', spinner: 'dots3' },
            calculating: { text: 'Calculating metrics...', spinner: 'dots4' },
            insights: { text: 'Generating insights...', spinner: 'dots5' },
            report: { text: 'Preparing report...', spinner: 'dots6' }
        }
    },
    search: {
        steps: [
            'Indexing resume content',
            'Processing search query',
            'Finding matches',
            'Ranking results',
            'Formatting output'
        ],
        spinners: {
            indexing: { text: 'Indexing resume content...', spinner: 'bouncingBar' },
            processing: { text: 'Processing search query...', spinner: 'bouncingBall' },
            matching: { text: 'Finding matches...', spinner: 'smiley' },
            ranking: { text: 'Ranking results...', spinner: 'monkey' },
            formatting: { text: 'Formatting output...', spinner: 'hearts' }
        }
    }
};
/**
 * Utility functions for common progress patterns
 */
export const ProgressUtils = {
    /**
     * Simulate progress for demonstration
     */
    async simulateProgress(title, duration = 3000, colors) {
        const progressBar = ProgressBarManager.createProgressBar(title, 100, colors);
        const steps = 100;
        const interval = duration / steps;
        for (let i = 0; i <= steps; i++) {
            await new Promise(resolve => setTimeout(resolve, interval));
            ProgressBarManager.updateProgress(i);
        }
        ProgressBarManager.completeProgress();
    },
    /**
     * Execute function with spinner
     */
    async withSpinner(fn, text, successText, errorText) {
        const spinner = ProgressBarManager.createSpinner(text);
        try {
            const result = await fn();
            ProgressBarManager.succeedSpinner(successText || 'Operation completed!');
            return result;
        }
        catch (error) {
            ProgressBarManager.failSpinner(errorText || 'Operation failed!');
            throw error;
        }
    },
    /**
     * Execute multi-step operation with progress
     */
    async withMultiStepProgress(steps, colors) {
        const stepNames = steps.map(step => step.name);
        const progress = ProgressBarManager.createMultiStepProgress(stepNames, colors);
        const results = [];
        for (const step of steps) {
            try {
                const result = await step.fn();
                results.push(result);
                progress.nextStep(`${step.name} completed`);
            }
            catch (error) {
                console.log(chalk.red(`\n❌ Failed at step: ${step.name}`));
                throw error;
            }
        }
        progress.complete();
        return results;
    }
};
//# sourceMappingURL=progress-bars.js.map
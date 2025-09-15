import cliProgress from 'cli-progress';
import chalk from 'chalk';
import ora from 'ora';
import { ThemeColors } from '../../data/types.js';

type Ora = ReturnType<typeof ora>;
type SpinnerName = 'dots' | 'dots2' | 'dots3' | 'dots4' | 'dots5' | 'dots6' | 'dots7' | 'dots8' | 'dots9' | 'dots10' | 'dots11' | 'dots12' | 'line' | 'line2' | 'pipe' | 'simpleDots' | 'simpleDotsScrolling' | 'star' | 'star2' | 'flip' | 'hamburger' | 'growVertical' | 'growHorizontal' | 'balloon' | 'balloon2' | 'noise' | 'bounce' | 'boxBounce' | 'boxBounce2' | 'triangle' | 'arc' | 'circle' | 'squareCorners' | 'circleQuarters' | 'circleHalves' | 'squish' | 'toggle' | 'toggle2' | 'toggle3' | 'toggle4' | 'toggle5' | 'toggle6' | 'toggle7' | 'toggle8' | 'toggle9' | 'toggle10' | 'toggle11' | 'toggle12' | 'toggle13' | 'arrow' | 'arrow2' | 'arrow3' | 'bouncingBar' | 'bouncingBall' | 'smiley' | 'monkey' | 'hearts' | 'clock' | 'earth' | 'moon' | 'runner' | 'pong' | 'shark' | 'dqpb' | 'weather' | 'christmas';
type SpinnerColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';

/**
 * Enhanced Progress Bar Manager for resume CLI
 */
export class ProgressBarManager {
  private static progressBar: cliProgress.SingleBar | null = null;
  private static spinner: Ora | null = null;

  /**
   * Create a new progress bar for operations
   */
  static createProgressBar(
    title: string,
    total: number = 100,
    colors?: ThemeColors
  ): cliProgress.SingleBar {
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
  static updateProgress(value: number, payload?: any): void {
    if (this.progressBar) {
      this.progressBar.update(value, payload);
    }
  }

  /**
   * Complete and stop progress bar
   */
  static completeProgress(): void {
    if (this.progressBar) {
      this.progressBar.stop();
      this.progressBar = null;
    }
  }

  /**
   * Create animated spinner for indeterminate operations
   */
  static createSpinner(
    text: string,
    spinnerType: SpinnerName = 'dots',
    color: SpinnerColor = 'cyan'
  ): Ora {
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
  static updateSpinner(text: string): void {
    if (this.spinner) {
      this.spinner.text = text;
    }
  }

  /**
   * Complete spinner with success
   */
  static succeedSpinner(text?: string): void {
    if (this.spinner) {
      this.spinner.succeed(text);
      this.spinner = null;
    }
  }

  /**
   * Complete spinner with failure
   */
  static failSpinner(text?: string): void {
    if (this.spinner) {
      this.spinner.fail(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner without status
   */
  static stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  /**
   * Create multi-step progress indicator
   */
  static createMultiStepProgress(
    steps: string[],
    colors?: ThemeColors
  ): MultiStepProgress {
    return new MultiStepProgress(steps, colors);
  }
}

/**
 * Multi-step progress indicator class
 */
export class MultiStepProgress {
  private steps: string[];
  private currentStep: number = 0;
  private colors: ThemeColors;

  constructor(steps: string[], colors?: ThemeColors) {
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
  nextStep(customMessage?: string): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.displayProgress(customMessage);
    }
  }

  /**
   * Complete all steps
   */
  complete(message: string = 'All steps completed!'): void {
    this.currentStep = this.steps.length;
    console.log(`\n${chalk.hex(this.colors.primary)('✅')} ${chalk.hex(this.colors.accent)(message)}\n`);
  }

  /**
   * Display current progress
   */
  private displayProgress(customMessage?: string): void {
    console.clear();
    console.log(chalk.hex(this.colors.primary).bold('\n📋 Progress Overview\n'));

    this.steps.forEach((step, index) => {
      const stepNumber = index + 1;
      let icon: string;
      let color: string;
      let status: string;

      if (index < this.currentStep) {
        icon = '✅';
        color = this.colors.primary;
        status = 'Completed';
      } else if (index === this.currentStep) {
        icon = '🔄';
        color = this.colors.accent;
        status = customMessage || 'In Progress';
      } else {
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
  getCurrentStep(): { step: number; total: number; description: string } {
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
      validation: { text: 'Validating resume data...', spinner: 'dots' as SpinnerName },
      formatting: { text: 'Applying formatting...', spinner: 'line' as SpinnerName },
      generation: { text: 'Generating output...', spinner: 'pipe' as SpinnerName },
      writing: { text: 'Writing to file...', spinner: 'star' as SpinnerName },
      finalizing: { text: 'Finalizing export...', spinner: 'toggle' as SpinnerName }
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
      loading: { text: 'Loading resume data...', spinner: 'dots2' as SpinnerName },
      analyzing: { text: 'Analyzing content...', spinner: 'dots3' as SpinnerName },
      calculating: { text: 'Calculating metrics...', spinner: 'dots4' as SpinnerName },
      insights: { text: 'Generating insights...', spinner: 'dots5' as SpinnerName },
      report: { text: 'Preparing report...', spinner: 'dots6' as SpinnerName }
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
      indexing: { text: 'Indexing resume content...', spinner: 'bouncingBar' as SpinnerName },
      processing: { text: 'Processing search query...', spinner: 'bouncingBall' as SpinnerName },
      matching: { text: 'Finding matches...', spinner: 'smiley' as SpinnerName },
      ranking: { text: 'Ranking results...', spinner: 'monkey' as SpinnerName },
      formatting: { text: 'Formatting output...', spinner: 'hearts' as SpinnerName }
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
  async simulateProgress(
    title: string,
    duration: number = 3000,
    colors?: ThemeColors
  ): Promise<void> {
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
  async withSpinner<T>(
    fn: () => Promise<T>,
    text: string,
    successText?: string,
    errorText?: string
  ): Promise<T> {
    const spinner = ProgressBarManager.createSpinner(text);
    
    try {
      const result = await fn();
      ProgressBarManager.succeedSpinner(successText || 'Operation completed!');
      return result;
    } catch (error) {
      ProgressBarManager.failSpinner(errorText || 'Operation failed!');
      throw error;
    }
  },

  /**
   * Execute multi-step operation with progress
   */
  async withMultiStepProgress<T>(
    steps: Array<{ name: string; fn: () => Promise<any> }>,
    colors?: ThemeColors
  ): Promise<T[]> {
    const stepNames = steps.map(step => step.name);
    const progress = ProgressBarManager.createMultiStepProgress(stepNames, colors);
    const results: T[] = [];

    for (const step of steps) {
      try {
        const result = await step.fn();
        results.push(result);
        progress.nextStep(`${step.name} completed`);
      } catch (error) {
        console.log(chalk.red(`\n❌ Failed at step: ${step.name}`));
        throw error;
      }
    }

    progress.complete();
    return results;
  }
};
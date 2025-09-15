import cliProgress from 'cli-progress';
import ora from 'ora';
import { ThemeColors } from '../../data/types.js';
type Ora = ReturnType<typeof ora>;
type SpinnerName = 'dots' | 'dots2' | 'dots3' | 'dots4' | 'dots5' | 'dots6' | 'dots7' | 'dots8' | 'dots9' | 'dots10' | 'dots11' | 'dots12' | 'line' | 'line2' | 'pipe' | 'simpleDots' | 'simpleDotsScrolling' | 'star' | 'star2' | 'flip' | 'hamburger' | 'growVertical' | 'growHorizontal' | 'balloon' | 'balloon2' | 'noise' | 'bounce' | 'boxBounce' | 'boxBounce2' | 'triangle' | 'arc' | 'circle' | 'squareCorners' | 'circleQuarters' | 'circleHalves' | 'squish' | 'toggle' | 'toggle2' | 'toggle3' | 'toggle4' | 'toggle5' | 'toggle6' | 'toggle7' | 'toggle8' | 'toggle9' | 'toggle10' | 'toggle11' | 'toggle12' | 'toggle13' | 'arrow' | 'arrow2' | 'arrow3' | 'bouncingBar' | 'bouncingBall' | 'smiley' | 'monkey' | 'hearts' | 'clock' | 'earth' | 'moon' | 'runner' | 'pong' | 'shark' | 'dqpb' | 'weather' | 'christmas';
type SpinnerColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';
/**
 * Enhanced Progress Bar Manager for resume CLI
 */
export declare class ProgressBarManager {
    private static progressBar;
    private static spinner;
    /**
     * Create a new progress bar for operations
     */
    static createProgressBar(title: string, total?: number, colors?: ThemeColors): cliProgress.SingleBar;
    /**
     * Update progress bar value
     */
    static updateProgress(value: number, payload?: any): void;
    /**
     * Complete and stop progress bar
     */
    static completeProgress(): void;
    /**
     * Create animated spinner for indeterminate operations
     */
    static createSpinner(text: string, spinnerType?: SpinnerName, color?: SpinnerColor): Ora;
    /**
     * Update spinner text
     */
    static updateSpinner(text: string): void;
    /**
     * Complete spinner with success
     */
    static succeedSpinner(text?: string): void;
    /**
     * Complete spinner with failure
     */
    static failSpinner(text?: string): void;
    /**
     * Stop spinner without status
     */
    static stopSpinner(): void;
    /**
     * Create multi-step progress indicator
     */
    static createMultiStepProgress(steps: string[], colors?: ThemeColors): MultiStepProgress;
}
/**
 * Multi-step progress indicator class
 */
export declare class MultiStepProgress {
    private steps;
    private currentStep;
    private colors;
    constructor(steps: string[], colors?: ThemeColors);
    /**
     * Move to next step
     */
    nextStep(customMessage?: string): void;
    /**
     * Complete all steps
     */
    complete(message?: string): void;
    /**
     * Display current progress
     */
    private displayProgress;
    /**
     * Get current step information
     */
    getCurrentStep(): {
        step: number;
        total: number;
        description: string;
    };
}
/**
 * Predefined progress configurations for common operations
 */
export declare const ProgressConfigs: {
    export: {
        steps: string[];
        spinners: {
            validation: {
                text: string;
                spinner: SpinnerName;
            };
            formatting: {
                text: string;
                spinner: SpinnerName;
            };
            generation: {
                text: string;
                spinner: SpinnerName;
            };
            writing: {
                text: string;
                spinner: SpinnerName;
            };
            finalizing: {
                text: string;
                spinner: SpinnerName;
            };
        };
    };
    analysis: {
        steps: string[];
        spinners: {
            loading: {
                text: string;
                spinner: SpinnerName;
            };
            analyzing: {
                text: string;
                spinner: SpinnerName;
            };
            calculating: {
                text: string;
                spinner: SpinnerName;
            };
            insights: {
                text: string;
                spinner: SpinnerName;
            };
            report: {
                text: string;
                spinner: SpinnerName;
            };
        };
    };
    search: {
        steps: string[];
        spinners: {
            indexing: {
                text: string;
                spinner: SpinnerName;
            };
            processing: {
                text: string;
                spinner: SpinnerName;
            };
            matching: {
                text: string;
                spinner: SpinnerName;
            };
            ranking: {
                text: string;
                spinner: SpinnerName;
            };
            formatting: {
                text: string;
                spinner: SpinnerName;
            };
        };
    };
};
/**
 * Utility functions for common progress patterns
 */
export declare const ProgressUtils: {
    /**
     * Simulate progress for demonstration
     */
    simulateProgress(title: string, duration?: number, colors?: ThemeColors): Promise<void>;
    /**
     * Execute function with spinner
     */
    withSpinner<T>(fn: () => Promise<T>, text: string, successText?: string, errorText?: string): Promise<T>;
    /**
     * Execute multi-step operation with progress
     */
    withMultiStepProgress<T>(steps: Array<{
        name: string;
        fn: () => Promise<any>;
    }>, colors?: ThemeColors): Promise<T[]>;
};
export {};
//# sourceMappingURL=progress-bars.d.ts.map
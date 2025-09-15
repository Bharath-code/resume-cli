import { ThemeColors } from '../../data/types.js';
export interface SpinnerConfig {
    text: string;
    spinner?: string;
    color?: string;
    prefixText?: string;
    suffixText?: string;
}
export declare const SPINNER_THEMES: {
    readonly dots: "dots";
    readonly dots2: "dots2";
    readonly dots3: "dots3";
    readonly dots4: "dots4";
    readonly dots5: "dots5";
    readonly dots6: "dots6";
    readonly dots7: "dots7";
    readonly dots8: "dots8";
    readonly dots9: "dots9";
    readonly dots10: "dots10";
    readonly dots11: "dots11";
    readonly dots12: "dots12";
    readonly line: "line";
    readonly line2: "line2";
    readonly pipe: "pipe";
    readonly simpleDots: "simpleDots";
    readonly simpleDotsScrolling: "simpleDotsScrolling";
    readonly star: "star";
    readonly star2: "star2";
    readonly flip: "flip";
    readonly hamburger: "hamburger";
    readonly growVertical: "growVertical";
    readonly growHorizontal: "growHorizontal";
    readonly balloon: "balloon";
    readonly balloon2: "balloon2";
    readonly noise: "noise";
    readonly bounce: "bounce";
    readonly boxBounce: "boxBounce";
    readonly boxBounce2: "boxBounce2";
    readonly triangle: "triangle";
    readonly arc: "arc";
    readonly circle: "circle";
    readonly squareCorners: "squareCorners";
    readonly circleQuarters: "circleQuarters";
    readonly circleHalves: "circleHalves";
    readonly squish: "squish";
    readonly toggle: "toggle";
    readonly toggle2: "toggle2";
    readonly toggle3: "toggle3";
    readonly toggle4: "toggle4";
    readonly toggle5: "toggle5";
    readonly toggle6: "toggle6";
    readonly toggle7: "toggle7";
    readonly toggle8: "toggle8";
    readonly toggle9: "toggle9";
    readonly toggle10: "toggle10";
    readonly toggle11: "toggle11";
    readonly toggle12: "toggle12";
    readonly toggle13: "toggle13";
    readonly arrow: "arrow";
    readonly arrow2: "arrow2";
    readonly arrow3: "arrow3";
    readonly bouncingBar: "bouncingBar";
    readonly bouncingBall: "bouncingBall";
    readonly smiley: "smiley";
    readonly monkey: "monkey";
    readonly hearts: "hearts";
    readonly clock: "clock";
    readonly earth: "earth";
    readonly moon: "moon";
    readonly runner: "runner";
    readonly pong: "pong";
    readonly shark: "shark";
    readonly dqpb: "dqpb";
    readonly weather: "weather";
    readonly christmas: "christmas";
};
export type SpinnerTheme = keyof typeof SPINNER_THEMES;
export declare const CONTEXT_SPINNERS: {
    readonly loading: {
        readonly text: "Loading...";
        readonly spinner: "dots";
        readonly color: "cyan";
    };
    readonly processing: {
        readonly text: "Processing...";
        readonly spinner: "dots2";
        readonly color: "yellow";
    };
    readonly analyzing: {
        readonly text: "Analyzing...";
        readonly spinner: "dots3";
        readonly color: "magenta";
    };
    readonly generating: {
        readonly text: "Generating...";
        readonly spinner: "dots4";
        readonly color: "blue";
    };
    readonly exporting: {
        readonly text: "Exporting...";
        readonly spinner: "dots5";
        readonly color: "green";
    };
    readonly searching: {
        readonly text: "Searching...";
        readonly spinner: "dots6";
        readonly color: "white";
    };
    readonly optimizing: {
        readonly text: "Optimizing...";
        readonly spinner: "dots7";
        readonly color: "red";
    };
    readonly validating: {
        readonly text: "Validating...";
        readonly spinner: "dots8";
        readonly color: "gray";
    };
    readonly connecting: {
        readonly text: "Connecting...";
        readonly spinner: "earth";
        readonly color: "blue";
    };
    readonly downloading: {
        readonly text: "Downloading...";
        readonly spinner: "arrow3";
        readonly color: "cyan";
    };
    readonly uploading: {
        readonly text: "Uploading...";
        readonly spinner: "arrow2";
        readonly color: "yellow";
    };
    readonly building: {
        readonly text: "Building...";
        readonly spinner: "hamburger";
        readonly color: "magenta";
    };
    readonly testing: {
        readonly text: "Testing...";
        readonly spinner: "toggle";
        readonly color: "green";
    };
    readonly deploying: {
        readonly text: "Deploying...";
        readonly spinner: "arrow";
        readonly color: "red";
    };
};
export type SpinnerContext = keyof typeof CONTEXT_SPINNERS;
/**
 * Enhanced animated loading manager with ora spinners
 */
export declare class AnimatedLoadingManager {
    private static activeSpinners;
    private static defaultTheme;
    private static themeConfigs;
    /**
     * Create a new spinner with context-aware configuration
     */
    static createSpinner(context: SpinnerContext | string, customConfig?: Partial<SpinnerConfig>): string;
    /**
     * Start a spinner
     */
    static startSpinner(spinnerId: string): boolean;
    /**
     * Update spinner text and optionally change spinner type
     */
    static updateSpinner(spinnerId: string, text: string, newSpinner?: SpinnerTheme): boolean;
    /**
     * Stop spinner with success message
     */
    static succeedSpinner(spinnerId: string, message?: string): boolean;
    /**
     * Stop spinner with failure message
     */
    static failSpinner(spinnerId: string, message?: string): boolean;
    /**
     * Stop spinner with warning message
     */
    static warnSpinner(spinnerId: string, message?: string): boolean;
    /**
     * Stop spinner with info message
     */
    static infoSpinner(spinnerId: string, message?: string): boolean;
    /**
     * Stop spinner without any symbol
     */
    static stopSpinner(spinnerId: string, message?: string): boolean;
    /**
     * Create and start a spinner in one call
     */
    static createAndStartSpinner(context: SpinnerContext | string, customConfig?: Partial<SpinnerConfig>): string;
    /**
     * Create a themed spinner sequence for complex operations
     */
    static createSpinnerSequence(steps: Array<{
        context: SpinnerContext | string;
        duration?: number;
        config?: Partial<SpinnerConfig>;
        onComplete?: 'succeed' | 'fail' | 'warn' | 'info' | 'stop';
        completeMessage?: string;
    }>): Promise<void>;
    /**
     * Stop all active spinners
     */
    static stopAllSpinners(): void;
    /**
     * Get count of active spinners
     */
    static getActiveSpinnerCount(): number;
    /**
     * Check if a specific spinner is active
     */
    static isSpinnerActive(spinnerId: string): boolean;
    /**
     * Create a spinner with custom theme colors
     */
    static createThemedSpinner(context: SpinnerContext | string, theme: Partial<ThemeColors>, customConfig?: Partial<SpinnerConfig>): string;
    /**
     * Get appropriate theme color for context
     */
    private static getThemeColorForContext;
}
export declare const createLoadingSpinner: (text?: string) => string;
export declare const createProcessingSpinner: (text?: string) => string;
export declare const createAnalyzingSpinner: (text?: string) => string;
export declare const createGeneratingSpinner: (text?: string) => string;
export declare const createExportingSpinner: (text?: string) => string;
export declare const createSearchingSpinner: (text?: string) => string;
export declare const createOptimizingSpinner: (text?: string) => string;
export declare const createValidatingSpinner: (text?: string) => string;
export declare const createConnectingSpinner: (text?: string) => string;
export declare const createBuildingSpinner: (text?: string) => string;
export declare const createTestingSpinner: (text?: string) => string;
export declare const createDeployingSpinner: (text?: string) => string;
export default AnimatedLoadingManager;
//# sourceMappingURL=animated-loading.d.ts.map
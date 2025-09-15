import ora from 'ora';
// Predefined spinner themes
export const SPINNER_THEMES = {
    dots: 'dots',
    dots2: 'dots2',
    dots3: 'dots3',
    dots4: 'dots4',
    dots5: 'dots5',
    dots6: 'dots6',
    dots7: 'dots7',
    dots8: 'dots8',
    dots9: 'dots9',
    dots10: 'dots10',
    dots11: 'dots11',
    dots12: 'dots12',
    line: 'line',
    line2: 'line2',
    pipe: 'pipe',
    simpleDots: 'simpleDots',
    simpleDotsScrolling: 'simpleDotsScrolling',
    star: 'star',
    star2: 'star2',
    flip: 'flip',
    hamburger: 'hamburger',
    growVertical: 'growVertical',
    growHorizontal: 'growHorizontal',
    balloon: 'balloon',
    balloon2: 'balloon2',
    noise: 'noise',
    bounce: 'bounce',
    boxBounce: 'boxBounce',
    boxBounce2: 'boxBounce2',
    triangle: 'triangle',
    arc: 'arc',
    circle: 'circle',
    squareCorners: 'squareCorners',
    circleQuarters: 'circleQuarters',
    circleHalves: 'circleHalves',
    squish: 'squish',
    toggle: 'toggle',
    toggle2: 'toggle2',
    toggle3: 'toggle3',
    toggle4: 'toggle4',
    toggle5: 'toggle5',
    toggle6: 'toggle6',
    toggle7: 'toggle7',
    toggle8: 'toggle8',
    toggle9: 'toggle9',
    toggle10: 'toggle10',
    toggle11: 'toggle11',
    toggle12: 'toggle12',
    toggle13: 'toggle13',
    arrow: 'arrow',
    arrow2: 'arrow2',
    arrow3: 'arrow3',
    bouncingBar: 'bouncingBar',
    bouncingBall: 'bouncingBall',
    smiley: 'smiley',
    monkey: 'monkey',
    hearts: 'hearts',
    clock: 'clock',
    earth: 'earth',
    moon: 'moon',
    runner: 'runner',
    pong: 'pong',
    shark: 'shark',
    dqpb: 'dqpb',
    weather: 'weather',
    christmas: 'christmas'
};
// Context-specific spinner configurations
export const CONTEXT_SPINNERS = {
    loading: {
        text: 'Loading...',
        spinner: SPINNER_THEMES.dots,
        color: 'cyan'
    },
    processing: {
        text: 'Processing...',
        spinner: SPINNER_THEMES.dots2,
        color: 'yellow'
    },
    analyzing: {
        text: 'Analyzing...',
        spinner: SPINNER_THEMES.dots3,
        color: 'magenta'
    },
    generating: {
        text: 'Generating...',
        spinner: SPINNER_THEMES.dots4,
        color: 'blue'
    },
    exporting: {
        text: 'Exporting...',
        spinner: SPINNER_THEMES.dots5,
        color: 'green'
    },
    searching: {
        text: 'Searching...',
        spinner: SPINNER_THEMES.dots6,
        color: 'white'
    },
    optimizing: {
        text: 'Optimizing...',
        spinner: SPINNER_THEMES.dots7,
        color: 'red'
    },
    validating: {
        text: 'Validating...',
        spinner: SPINNER_THEMES.dots8,
        color: 'gray'
    },
    connecting: {
        text: 'Connecting...',
        spinner: SPINNER_THEMES.earth,
        color: 'blue'
    },
    downloading: {
        text: 'Downloading...',
        spinner: SPINNER_THEMES.arrow3,
        color: 'cyan'
    },
    uploading: {
        text: 'Uploading...',
        spinner: SPINNER_THEMES.arrow2,
        color: 'yellow'
    },
    building: {
        text: 'Building...',
        spinner: SPINNER_THEMES.hamburger,
        color: 'magenta'
    },
    testing: {
        text: 'Testing...',
        spinner: SPINNER_THEMES.toggle,
        color: 'green'
    },
    deploying: {
        text: 'Deploying...',
        spinner: SPINNER_THEMES.arrow,
        color: 'red'
    }
};
/**
 * Enhanced animated loading manager with ora spinners
 */
export class AnimatedLoadingManager {
    /**
     * Create a new spinner with context-aware configuration
     */
    static createSpinner(context, customConfig) {
        const spinnerId = `spinner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let config;
        if (typeof context === 'string' && context in CONTEXT_SPINNERS) {
            config = { ...CONTEXT_SPINNERS[context], ...customConfig };
        }
        else {
            config = {
                text: typeof context === 'string' ? context : 'Loading...',
                spinner: SPINNER_THEMES.dots,
                color: 'cyan',
                ...customConfig
            };
        }
        const spinner = ora({
            text: config.text,
            spinner: config.spinner,
            color: config.color,
            prefixText: config.prefixText,
            suffixText: config.suffixText
        });
        this.activeSpinners.set(spinnerId, spinner);
        return spinnerId;
    }
    /**
     * Start a spinner
     */
    static startSpinner(spinnerId) {
        const spinner = this.activeSpinners.get(spinnerId);
        if (spinner) {
            spinner.start();
            return true;
        }
        return false;
    }
    /**
     * Update spinner text and optionally change spinner type
     */
    static updateSpinner(spinnerId, text, newSpinner) {
        const spinner = this.activeSpinners.get(spinnerId);
        if (spinner) {
            spinner.text = text;
            if (newSpinner) {
                spinner.spinner = newSpinner;
            }
            return true;
        }
        return false;
    }
    /**
     * Stop spinner with success message
     */
    static succeedSpinner(spinnerId, message) {
        const spinner = this.activeSpinners.get(spinnerId);
        if (spinner) {
            spinner.succeed(message);
            this.activeSpinners.delete(spinnerId);
            return true;
        }
        return false;
    }
    /**
     * Stop spinner with failure message
     */
    static failSpinner(spinnerId, message) {
        const spinner = this.activeSpinners.get(spinnerId);
        if (spinner) {
            spinner.fail(message);
            this.activeSpinners.delete(spinnerId);
            return true;
        }
        return false;
    }
    /**
     * Stop spinner with warning message
     */
    static warnSpinner(spinnerId, message) {
        const spinner = this.activeSpinners.get(spinnerId);
        if (spinner) {
            spinner.warn(message);
            this.activeSpinners.delete(spinnerId);
            return true;
        }
        return false;
    }
    /**
     * Stop spinner with info message
     */
    static infoSpinner(spinnerId, message) {
        const spinner = this.activeSpinners.get(spinnerId);
        if (spinner) {
            spinner.info(message);
            this.activeSpinners.delete(spinnerId);
            return true;
        }
        return false;
    }
    /**
     * Stop spinner without any symbol
     */
    static stopSpinner(spinnerId, message) {
        const spinner = this.activeSpinners.get(spinnerId);
        if (spinner) {
            spinner.stop();
            if (message) {
                console.log(message);
            }
            this.activeSpinners.delete(spinnerId);
            return true;
        }
        return false;
    }
    /**
     * Create and start a spinner in one call
     */
    static createAndStartSpinner(context, customConfig) {
        const spinnerId = this.createSpinner(context, customConfig);
        this.startSpinner(spinnerId);
        return spinnerId;
    }
    /**
     * Create a themed spinner sequence for complex operations
     */
    static async createSpinnerSequence(steps) {
        for (const step of steps) {
            const spinnerId = this.createAndStartSpinner(step.context, step.config);
            if (step.duration) {
                await new Promise(resolve => setTimeout(resolve, step.duration));
            }
            const completeType = step.onComplete || 'succeed';
            const message = step.completeMessage;
            switch (completeType) {
                case 'succeed':
                    this.succeedSpinner(spinnerId, message);
                    break;
                case 'fail':
                    this.failSpinner(spinnerId, message);
                    break;
                case 'warn':
                    this.warnSpinner(spinnerId, message);
                    break;
                case 'info':
                    this.infoSpinner(spinnerId, message);
                    break;
                case 'stop':
                    this.stopSpinner(spinnerId, message);
                    break;
            }
        }
    }
    /**
     * Stop all active spinners
     */
    static stopAllSpinners() {
        for (const [spinnerId, spinner] of this.activeSpinners) {
            spinner.stop();
        }
        this.activeSpinners.clear();
    }
    /**
     * Get count of active spinners
     */
    static getActiveSpinnerCount() {
        return this.activeSpinners.size;
    }
    /**
     * Check if a specific spinner is active
     */
    static isSpinnerActive(spinnerId) {
        return this.activeSpinners.has(spinnerId);
    }
    /**
     * Create a spinner with custom theme colors
     */
    static createThemedSpinner(context, theme, customConfig) {
        const mergedTheme = { ...this.defaultTheme, ...theme };
        const themedConfig = {
            ...customConfig,
            color: this.getThemeColorForContext(context, mergedTheme)
        };
        return this.createSpinner(context, themedConfig);
    }
    /**
     * Get appropriate theme color for context
     */
    static getThemeColorForContext(context, theme) {
        const contextColorMap = {
            loading: 'primary',
            processing: 'warning',
            analyzing: 'accent',
            generating: 'primary',
            exporting: 'success',
            searching: 'primary',
            optimizing: 'error',
            validating: 'muted',
            connecting: 'primary',
            downloading: 'primary',
            uploading: 'warning',
            building: 'secondary',
            testing: 'success',
            deploying: 'error'
        };
        const colorKey = contextColorMap[context] || 'primary';
        return theme[colorKey] || '#00D9FF';
    }
}
AnimatedLoadingManager.activeSpinners = new Map();
AnimatedLoadingManager.defaultTheme = {
    primary: '#00D9FF',
    secondary: '#FF6B6B',
    accent: '#4ECDC4',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    muted: '#95A5A6'
};
// Predefined theme configurations
AnimatedLoadingManager.themeConfigs = {
    tech: {
        primary: '#00D9FF',
        secondary: '#FF6B6B',
        accent: '#4ECDC4',
        success: '#45B7D1',
        warning: '#FFA726',
        error: '#EF5350',
        muted: '#E8F4FD',
        spinner: SPINNER_THEMES.arrow,
        symbol: '⚡'
    }
};
// Convenience functions for common spinner operations
export const createLoadingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('loading', { text });
export const createProcessingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('processing', { text });
export const createAnalyzingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('analyzing', { text });
export const createGeneratingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('generating', { text });
export const createExportingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('exporting', { text });
export const createSearchingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('searching', { text });
export const createOptimizingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('optimizing', { text });
export const createValidatingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('validating', { text });
export const createConnectingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('connecting', { text });
export const createBuildingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('building', { text });
export const createTestingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('testing', { text });
export const createDeployingSpinner = (text) => AnimatedLoadingManager.createAndStartSpinner('deploying', { text });
// Export the main class as default
export default AnimatedLoadingManager;
//# sourceMappingURL=animated-loading.js.map
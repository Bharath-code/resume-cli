import { Command } from 'commander';
export declare class ThemeCLI {
    private program;
    constructor();
    private setupCommands;
    listThemes(): Promise<void>;
    createFromTemplate(options: any): Promise<void>;
    createCustomTheme(options: any): Promise<void>;
    createBrandTheme(options: any): Promise<void>;
    generateColors(options: any): Promise<void>;
    listFonts(options: any): Promise<void>;
    previewTheme(options: any): Promise<void>;
    validateTheme(themePath: string): Promise<void>;
    interactiveBuilder(): Promise<void>;
    private saveTheme;
    run(args: string[]): void;
}
export declare function registerThemeCommands(program: Command): void;
//# sourceMappingURL=theme-cli.d.ts.map
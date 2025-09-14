import { ResumeData, ExportOptions, TemplateConfig } from '../data/types.js';
export declare const EXPORT_TEMPLATES: Record<string, TemplateConfig>;
export declare function exportResume(resumeData: ResumeData, options: ExportOptions): string;
export declare function getAvailableTemplates(): TemplateConfig[];
export declare function getTemplateByName(name: string): TemplateConfig | undefined;
//# sourceMappingURL=export.d.ts.map
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ResumeData, SectionKey } from '../../data/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load resume data from JSON file
 */
export function loadResumeData(): ResumeData {
  const dataPath = path.join(__dirname, '../../data/resume.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData) as ResumeData;
}

/**
 * Get filtered resume data based on specified sections
 */
export function getFilteredResumeData(sections?: SectionKey[]): Partial<ResumeData> {
  const resumeData = loadResumeData();
  
  if (!sections || sections.length === 0) {
    return resumeData;
  }
  
  const filteredData: Partial<ResumeData> = {};
  
  sections.forEach(section => {
    if (section in resumeData) {
      (filteredData as any)[section] = resumeData[section];
    }
  });
  
  return filteredData;
}

/**
 * Get available section keys
 */
export function getAvailableSections(): SectionKey[] {
  const resumeData = loadResumeData();
  return Object.keys(resumeData) as SectionKey[];
}

/**
 * Validate if provided sections exist in resume data
 */
export function validateSections(sections: string[]): { valid: SectionKey[], invalid: string[] } {
  const availableSections = getAvailableSections();
  const valid: SectionKey[] = [];
  const invalid: string[] = [];
  
  sections.forEach(section => {
    if (availableSections.includes(section as SectionKey)) {
      valid.push(section as SectionKey);
    } else {
      invalid.push(section);
    }
  });
  
  return { valid, invalid };
}

/**
 * Get package.json data
 */
export function getPackageInfo() {
  const packagePath = path.join(__dirname, '../../package.json');
  const rawData = fs.readFileSync(packagePath, 'utf8');
  return JSON.parse(rawData);
}
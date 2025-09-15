import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Load resume data from JSON file
 */
export function loadResumeData() {
    const dataPath = path.join(__dirname, '../../data/resume.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
}
/**
 * Get filtered resume data based on specified sections
 */
export function getFilteredResumeData(sections) {
    const resumeData = loadResumeData();
    if (!sections || sections.length === 0) {
        return resumeData;
    }
    const filteredData = {};
    sections.forEach(section => {
        if (section in resumeData) {
            filteredData[section] = resumeData[section];
        }
    });
    return filteredData;
}
/**
 * Get available section keys
 */
export function getAvailableSections() {
    const resumeData = loadResumeData();
    return Object.keys(resumeData);
}
/**
 * Validate if provided sections exist in resume data
 */
export function validateSections(sections) {
    const availableSections = getAvailableSections();
    const valid = [];
    const invalid = [];
    sections.forEach(section => {
        if (availableSections.includes(section)) {
            valid.push(section);
        }
        else {
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
//# sourceMappingURL=data.js.map
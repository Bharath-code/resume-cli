export interface PersonalInfo {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Experience {
  company: string;
  title: string;
  dates: string;
  bullets: string[];
}

export interface Project {
  name: string;
  desc: string;
  tech: string;
}

export interface Education {
  degree: string;
  school: string;
  dates: string;
  details: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  techStack: string[];
  profile: string;
  experience: Experience[];
  projects: Project[];
  leadership: string[];
  openSource: string[];
  education: Education[];
}

export type SectionKey = keyof ResumeData;

export type OutputFormat = 'colored' | 'plain' | 'json' | 'html' | 'pdf';

export interface FormatOptions {
  format: OutputFormat;
  sections?: SectionKey[];
  output?: string;
  interactive?: boolean;
}

export interface MenuChoice {
  name: string;
  value: string;
}

export interface ContactChoice {
  name: string;
  value: keyof PersonalInfo;
}

export interface ExportChoice {
  name: string;
  value: OutputFormat;
  extension: string;
}
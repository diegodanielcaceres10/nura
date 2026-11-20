export interface ProjectItem {
  id: string;
  icon?: string;
  favicon?: string;
  logo?: string;
  title: string;
  type: 'Mobile' | 'Web' | 'Fullstack' | 'Library' | 'Challenge';
  shortDescription: string;
  techStackMain: string[];
  techStackExtended?: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED';
  year: number;
  fullDescription: string;
  techStackFull?: TechCategory[];
  keyFeatures: string[];
  challenges?: string[];
  galleryPortrait?: string[];
  galleryLandscape?: string[];
  links?: ProjectLinks;
  metrics?: ProjectMetrics;
  cardTheme?: ProjectCardTheme;
  isAiAssisted?: boolean;
  bannerImage?: string;
  aiMetrics?: AiMetric[];
  aiDetail?: AiDetail;
}

export interface AiDetail { tools?: string[]; workflow?: string[]; productFeatures?: string[]; quality?: string[]; }
export interface AiMetric { value: string; labelKey: string; icon: string; }
export interface ProjectCardGradient { from: string; to: string; angle?: number; }
export interface ProjectCardCover { src: string; position?: string; overlay?: number; }
export interface ProjectCardTheme { accent?: string; gradient?: ProjectCardGradient; cover?: ProjectCardCover; }
export interface TechCategory { category: string; items: string[]; }
export interface ProjectLinks { repo: string; demo?: string; landing?: string; npm?: string; androidAPK?: string; }
export interface ProjectMetrics { npmDownloads?: number; githubStars?: number; testCoverage?: string; }

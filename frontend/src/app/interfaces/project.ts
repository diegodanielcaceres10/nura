export interface ProjectKpi {
  legend: string;
  value: string;
}

export interface ProjectCard {
  name: string;
  new: boolean;
  filename: string;
  logo: string;
  title: string;
  subtitle: string;
  skills: string[];
  description: string;
  kpis: ProjectKpi[];
  repo: string;
  colors: string[];
}

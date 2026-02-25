export interface ProjectBar {
  left: string;
  percent: string;
  color: string;
  legend: string;
}

export interface ProjectCard {
  title: string;
  subtitle: string;
  stackKey: string;
  descKey: string;
  resultKey?: string;
  logo: string;
  card: string;
  repo: string;
  repoLabelKey: string;
  techsKey: string;
  techs: ProjectBar[];
}

export interface CaseStudyMetric { icon: string; value: string; label: string; }

export interface CaseStudyDetail {
  context: string;
  challenge: string;
  role: string;
  decisions: string;
  execution: string;
  results: string;
  learnings: string;
  stack: string[];
}

export interface CaseStudyItem {
  number: string;
  category: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: CaseStudyMetric[];
  slug: string;
  detail: CaseStudyDetail;
}

import { Component, HostListener, signal } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { ProjectCardComponent } from './project-card.component/project-card.component';
import { ProjectModalComponent } from './project-modal.component/project-modal.component';

export interface ProjectItem {
  id: string;
  avatar?: string;
  icon?: string;
  title: string;
  type: 'Mobile' | 'Web' | 'Fullstack' | 'Library' | 'Challenge';
  shortDescription: string;
  coverImage: string;
  techStackPreview: string[];
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED';
  year: number;
  fullDescription: string;
  role: string;
  techStackFull?: TechCategory[];
  keyFeatures: string[];
  challenges?: string[];
  gallery?: string[];
  links: ProjectLinks;
  metrics?: ProjectMetrics;
  typeDetails?: MobileDetails | WebDetails | FullstackDetails | LibraryDetails | ChallengeDetails;
}

export interface TechCategory {
  category: string;
  items: string[];
}

export interface ProjectLinks {
  repo: string;
  demo?: string;
  npm?: string;
  apk?: string;
}

export interface ProjectMetrics {
  npmDownloads?: number;
  githubStars?: number;
  testCoverage?: string;
}

export interface MobileDetails {
  kind: 'mobile';
  platforms: ('android' | 'ios' | 'web')[];
  nativePlugins: string[];
  buildTool: string;
}

export interface WebDetails {
  kind: 'web';
  deployUrl: string;
  pwa?: boolean;
  responsive: boolean;
}

export interface FullstackDetails {
  kind: 'fullstack';
  backendStack: string[];
  databases: string[];
  apiType: 'REST' | 'GraphQL' | 'gRPC';
  deployment: string;
}

export interface LibraryDetails {
  kind: 'library';
  packageName: string;
  installCommand: string;
  registry: 'npm' | 'other';
}

export interface ChallengeDetails {
  kind: 'challenge';
  platform: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
}

@Component({
  selector: 'app-projects-component',
  standalone: true,
  imports: [TitleComponent, ProjectCardComponent, ProjectModalComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  protected readonly projects = signal<ProjectItem[]>([
    {
      id: 'ionic-plugin-lab',
      avatar: 'assets/projects/ionic-plugin-lab/logo.png',
      title: 'Ionic Plugin Lab',
      type: 'Mobile',
      shortDescription: 'PROJECTS_CARD_IONIC_PLUGIN_LAB_SHORT_DESC',
      coverImage: 'assets/projects/ionic-plugin-lab/cover.png',
      techStackPreview: ['Angular 20', 'Ionic', 'Capacitor', 'TypeScript'],
      status: 'IN_PROGRESS',
      year: 2026,
      fullDescription: 'PROJECTS_CARD_IONIC_PLUGIN_LAB_FULL_DESC',
      role: 'PROJECTS_CARD_IONIC_PLUGIN_LAB_ROLE',
      techStackFull: [
        {
          category: 'Frontend',
          items: ['Angular 20', 'Ionic 8', 'TypeScript', 'Leaflet'],
        },
        {
          category: 'DevOps',
          items: ['Docker (build APK)'],
        },
        {
          category: 'Testing',
          items: ['Karma + Jasmine'],
        },
      ],
      keyFeatures: ['PROJECTS_CARD_IONIC_PLUGIN_LAB_FEATURE_1', 'PROJECTS_CARD_IONIC_PLUGIN_LAB_FEATURE_2', 'PROJECTS_CARD_IONIC_PLUGIN_LAB_FEATURE_3', 'PROJECTS_CARD_IONIC_PLUGIN_LAB_FEATURE_4', 'PROJECTS_CARD_IONIC_PLUGIN_LAB_FEATURE_5'],
      challenges: ['PROJECTS_CARD_IONIC_PLUGIN_LAB_CHALLENGE_1'],
      gallery: ['assets/projects/ionic-plugin-lab/screen-splash.png', 'assets/projects/ionic-plugin-lab/screen-home.png', 'assets/projects/ionic-plugin-lab/screen-camera.png', 'assets/projects/ionic-plugin-lab/screen-biometrics.png', 'assets/projects/ionic-plugin-lab/screen-favorites.png', 'assets/projects/ionic-plugin-lab/screen-logs.png'],
      links: {
        repo: 'https://github.com/diegodanielcaceres10/ionic-plugin-lab',
        apk: 'assets/projects/ionic-plugin-lab/app-debug.apk',
      },
      typeDetails: {
        kind: 'mobile',
        platforms: ['android', 'ios', 'web'],
        nativePlugins: ['Camera', 'Barcode Scanner', 'Geolocation', 'Bluetooth LE', 'NFC', 'Biometric Auth', 'SQLite', 'Filesystem', 'Local Notifications', 'Motion', 'Haptics', 'Network', 'Clipboard', 'Share', 'Device', 'StatusBar', 'Browser'],
        buildTool: 'Capacitor + Docker (build de APK)',
      },
    },
    {
      id: 'riu-frontend-diego-daniel-caceres',
      icon: 'fa-solid fa-bolt',
      title: 'RIU Frontend',
      type: 'Challenge',
      shortDescription: 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_SHORT_DESC',
      coverImage: 'assets/projects/riu-frontend/cover.png',
      techStackPreview: ['Angular 21', 'Angular Material', 'RxJS', 'Vitest'],
      status: 'COMPLETED',
      year: 2026,
      fullDescription: 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_FULL_DESC',
      role: 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_ROLE',
      techStackFull: [
        {
          category: 'Frontend',
          items: ['Angular 21', 'TypeScript', 'Angular Material', 'Angular CDK', 'RxJS', 'Angular Signals', 'Reactive Forms'],
        },
        {
          category: 'Testing',
          items: ['Vitest (93 tests, ~94% cobertura)'],
        },
        {
          category: 'DevOps',
          items: ['Docker + docker-compose'],
        },
      ],
      keyFeatures: ['PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_FEATURE_1', 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_FEATURE_2', 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_FEATURE_3', 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_FEATURE_4', 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_FEATURE_5', 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_FEATURE_6'],
      challenges: ['PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_CHALLENGE_1', 'PROJECTS_CARD_RIU_FRONTEND_DIEGO_DANIEL_CACERES_CHALLENGE_2'],
      gallery: ['assets/projects/riu-frontend/screen-home.png', 'assets/projects/riu-frontend/screen-list.png', 'assets/projects/riu-frontend/screen-form.png'],
      links: {
        repo: 'https://github.com/diegodanielcaceres10/RIU-Frontend-diego-daniel-caceres',
        demo: 'https://diegodanielcaceres10.github.io/RIU-Frontend-diego-daniel-caceres/',
      },
      typeDetails: {
        kind: 'challenge',
        platform: 'RIU',
        difficulty: 'medium',
        topics: ['Angular Signals', 'RxJS', 'CRUD', 'Reactive Forms', 'Angular Material', 'Unit Testing', 'Docker'],
      },
    },
    {
      id: 'nura',
      avatar: 'assets/projects/nura/logo.png',
      title: 'Nura - Portfolio',
      type: 'Web',
      shortDescription: 'PROJECTS_CARD_NURA_SHORT_DESC',
      coverImage: 'assets/projects/nura/cover.png',
      techStackPreview: ['Angular 21', 'TypeScript', 'SCSS', 'SSG'],
      status: 'IN_PROGRESS',
      year: 2026,
      fullDescription: 'PROJECTS_CARD_NURA_FULL_DESC',
      role: 'PROJECTS_CARD_NURA_ROLE',
      techStackFull: [
        {
          category: 'Frontend',
          items: ['Angular 21', 'TypeScript', 'SCSS', 'Angular Router', 'i18n propio (EN, ES, PT)'],
        },
        {
          category: 'Testing',
          items: ['Vitest (unit)', 'Cypress (e2e)'],
        },
        {
          category: 'Calidad y CI/CD',
          items: ['ESLint', 'Prettier', 'Lighthouse CI (desktop + mobile)', 'GitHub Actions'],
        },
        {
          category: 'DevOps',
          items: ['Docker (entorno de desarrollo)'],
        },
      ],
      keyFeatures: ['PROJECTS_CARD_NURA_FEATURE_1', 'PROJECTS_CARD_NURA_FEATURE_2', 'PROJECTS_CARD_NURA_FEATURE_3', 'PROJECTS_CARD_NURA_FEATURE_4', 'PROJECTS_CARD_NURA_FEATURE_5'],
      challenges: ['PROJECTS_CARD_NURA_CHALLENGE_1', 'PROJECTS_CARD_NURA_CHALLENGE_2'],
      links: {
        repo: 'https://github.com/diegodanielcaceres10/nura',
      },
      typeDetails: {
        kind: 'web',
        deployUrl: 'https://diegodanielcaceres10.github.io/nura/',
        pwa: false,
        responsive: true,
      },
    },
    {
      id: 'oilgroup',
      avatar: 'assets/projects/oilgroup/logo.png',
      title: 'Oilgroup',
      type: 'Fullstack',
      shortDescription: 'PROJECTS_CARD_OILGROUP_SHORT_DESC',
      coverImage: 'assets/projects/oilgroup/cover.png',
      techStackPreview: ['Angular 11', 'Node.js / Express', 'MySQL', 'amCharts'],
      status: 'COMPLETED',
      year: 2024,
      fullDescription: 'PROJECTS_CARD_OILGROUP_FULL_DESC',
      role: 'PROJECTS_CARD_OILGROUP_ROLE',
      techStackFull: [
        {
          category: 'Frontend',
          items: ['Angular 11', 'TypeScript', 'amCharts 4', 'RxJS'],
        },
        {
          category: 'Backend',
          items: ['Node.js', 'Express', 'JWT (auth)', 'Rate limiting'],
        },
        {
          category: 'Datos e integraciones',
          items: ['MySQL', 'Cloudinary (assets)', 'Google APIs', 'Nodemailer (emails)', 'PDF Creator (reportes)'],
        },
        {
          category: 'DevOps',
          items: ['Multi-entorno (dev/qua/hom/prd)'],
        },
      ],
      keyFeatures: ['PROJECTS_CARD_OILGROUP_FEATURE_1', 'PROJECTS_CARD_OILGROUP_FEATURE_2', 'PROJECTS_CARD_OILGROUP_FEATURE_3', 'PROJECTS_CARD_OILGROUP_FEATURE_4', 'PROJECTS_CARD_OILGROUP_FEATURE_5', 'PROJECTS_CARD_OILGROUP_FEATURE_6', 'PROJECTS_CARD_OILGROUP_FEATURE_7'],
      challenges: ['PROJECTS_CARD_OILGROUP_CHALLENGE_1', 'PROJECTS_CARD_OILGROUP_CHALLENGE_2'],
      links: {
        repo: 'https://github.com/diegodanielcaceres10/oilgroup',
      },
      typeDetails: {
        kind: 'fullstack',
        backendStack: ['Node.js', 'Express'],
        databases: ['MySQL'],
        apiType: 'REST',
        deployment: 'Multi-entorno (dev/qua/hom/prd), detalle de infraestructura a confirmar',
      },
    },
    {
      id: 'angularjsonform',
      avatar: 'assets/projects/angularjsonform/logo.png',
      title: 'Angular JSON Form',
      type: 'Library',
      shortDescription: 'PROJECTS_CARD_ANGULARJSONFORM_SHORT_DESC',
      coverImage: 'assets/projects/angularjsonform/cover.png',
      techStackPreview: ['Angular', 'TypeScript', 'npm'],
      status: 'ARCHIVED',
      year: 2023,
      fullDescription: 'PROJECTS_CARD_ANGULARJSONFORM_FULL_DESC',
      role: 'PROJECTS_CARD_ANGULARJSONFORM_ROLE',
      techStackFull: [
        {
          category: 'Librería',
          items: ['Angular (ng-package / Angular Library)', 'TypeScript', 'tslib'],
        },
        {
          category: 'App de demo incluida',
          items: ['Angular app (json-form-app)'],
        },
        {
          category: 'Testing',
          items: ['Karma'],
        },
      ],
      keyFeatures: ['PROJECTS_CARD_ANGULARJSONFORM_FEATURE_1', 'PROJECTS_CARD_ANGULARJSONFORM_FEATURE_2', 'PROJECTS_CARD_ANGULARJSONFORM_FEATURE_3', 'PROJECTS_CARD_ANGULARJSONFORM_FEATURE_4', 'PROJECTS_CARD_ANGULARJSONFORM_FEATURE_5', 'PROJECTS_CARD_ANGULARJSONFORM_FEATURE_6', 'PROJECTS_CARD_ANGULARJSONFORM_FEATURE_7'],
      challenges: ['PROJECTS_CARD_ANGULARJSONFORM_CHALLENGE_1', 'PROJECTS_CARD_ANGULARJSONFORM_CHALLENGE_2'],
      links: {
        repo: 'https://github.com/diegodanielcaceres10/angular-json-form',
        npm: 'https://www.npmjs.com/package/angular-json-form',
      },
      metrics: {
        npmDownloads: undefined,
      },
      typeDetails: {
        kind: 'library',
        packageName: 'angular-json-form',
        installCommand: 'npm install angular-json-form',
        registry: 'npm',
      },
    },
    {
      id: 'octoautodrive',
      avatar: 'assets/projects/octoautodrive/logo.png',
      title: 'Octo Auto Drive',
      type: 'Fullstack',
      shortDescription: 'PROJECTS_CARD_OCTOAUTODRIVE_SHORT_DESC',
      coverImage: 'assets/projects/octoautodrive/cover.png',
      techStackPreview: ['Angular 13', 'Node.js / Express', 'Socket.IO', 'MySQL'],
      status: 'ARCHIVED',
      year: 2023,
      fullDescription: 'PROJECTS_CARD_OCTOAUTODRIVE_FULL_DESC',
      role: 'PROJECTS_CARD_OCTOAUTODRIVE_ROLE',
      techStackFull: [
        {
          category: 'Frontend',
          items: ['Angular 13', 'TypeScript', 'ngx-translate (i18n)', 'Chart.js', 'angular-json-form', 'Socket.IO Client'],
        },
        {
          category: 'Backend',
          items: ['Node.js', 'Express', 'Socket.IO', 'JWT (auth)', 'i18n', 'Rate limiting'],
        },
        {
          category: 'Datos e integraciones',
          items: ['MySQL', 'Cloudinary (assets)', 'Google APIs', 'Facebook API', 'Nodemailer (emails)'],
        },
        {
          category: 'DevOps',
          items: ['Forever', 'Multi-entorno (prod/dev/cloud)'],
        },
        {
          category: 'Testing',
          items: ['Karma + Jasmine'],
        },
      ],
      keyFeatures: ['PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_1', 'PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_2', 'PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_3', 'PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_4', 'PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_5', 'PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_6', 'PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_7', 'PROJECTS_CARD_OCTOAUTODRIVE_FEATURE_8'],
      challenges: ['PROJECTS_CARD_OCTOAUTODRIVE_CHALLENGE_1', 'PROJECTS_CARD_OCTOAUTODRIVE_CHALLENGE_2'],
      links: {
        repo: 'https://github.com/diegodanielcaceres10/octoautodrive',
      },
      typeDetails: {
        kind: 'fullstack',
        backendStack: ['Node.js', 'Express', 'Socket.IO'],
        databases: ['MySQL'],
        apiType: 'REST',
        deployment: 'Forever (proceso Node), builds separados prod/dev/cloud - infraestructura exacta a confirmar',
      },
    },
    {
      id: 'boleto',
      icon: 'fa-solid fa-barcode',
      title: 'Boleto - Digital Line Validator API',
      type: 'Challenge',
      shortDescription: 'PROJECTS_CARD_BOLETO_SHORT_DESC',
      coverImage: 'assets/projects/boleto/cover.png',
      techStackPreview: ['Node.js', 'Express'],
      status: 'COMPLETED',
      year: 2022,
      fullDescription: 'PROJECTS_CARD_BOLETO_FULL_DESC',
      role: 'PROJECTS_CARD_BOLETO_ROLE',
      keyFeatures: ['PROJECTS_CARD_BOLETO_FEATURE_1', 'PROJECTS_CARD_BOLETO_FEATURE_2', 'PROJECTS_CARD_BOLETO_FEATURE_3', 'PROJECTS_CARD_BOLETO_FEATURE_4'],
      challenges: ['PROJECTS_CARD_BOLETO_CHALLENGE_1', 'PROJECTS_CARD_BOLETO_CHALLENGE_2'],
      links: {
        repo: 'https://github.com/diegodanielcaceres10/boleto',
      },
      typeDetails: {
        kind: 'challenge',
        platform: 'Challenge técnico (backend / lógica de negocio bancaria)',
        difficulty: 'medium',
        topics: ['Node.js', 'Express', 'REST API', 'Validación de datos', 'Algoritmos'],
      },
    },
  ]);

  protected readonly activeProject = signal<ProjectItem | null>(null);
  protected openProject(project: ProjectItem): void {
    this.activeProject.set(project);
  }

  protected closeProject(): void {
    this.activeProject.set(null);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeProject();
  }
}

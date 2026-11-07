import { RenderMode, ServerRoute } from '@angular/ssr';
import { SUPPORTED_LOCALES } from './services/locale/locale.service';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(SUPPORTED_LOCALES.map((lang) => ({ lang }))),
  },
  { path: '**', renderMode: RenderMode.Client },
];

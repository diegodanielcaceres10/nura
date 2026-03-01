import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Client },
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      Promise.resolve([{ lang: 'es' }, { lang: 'en' }, { lang: 'pt' }]),
  },
  { path: '**', renderMode: RenderMode.Client },
];

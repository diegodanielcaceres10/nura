import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopPageRow, TopPages } from './top-pages';

describe('TopPages', () => {
  let fixture: ComponentFixture<TopPages>;
  let element: HTMLElement;

  const pages: readonly TopPageRow[] = [
    { path: '/', views: 312 },
    { path: '/proyectos', views: 198 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPages],
    }).compileComponents();

    fixture = TestBed.createComponent(TopPages);
    fixture.componentRef.setInput('pages', pages);
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title', () => {
    expect(element.querySelector('h2')?.textContent).toContain('Páginas más vistas');
  });

  it('should render one row per page with its view count', () => {
    const rows = element.querySelectorAll('.top-pages__row');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.top-pages__path')?.textContent).toContain('/');
    expect(rows[0].querySelector('.top-pages__value')?.textContent).toContain('312');
  });

  it('should size the bar of the top page at 100%', () => {
    const bar = element.querySelector<HTMLElement>('.top-pages__bar');
    expect(bar?.style.width).toBe('100%');
  });

  it('should render the list and no placeholder when ready (the default)', () => {
    expect(element.querySelector('.top-pages__list')).not.toBeNull();
    expect(element.querySelector('.panel-card__placeholder')).toBeNull();
  });

  it('should show a spinner and no rows while loading', () => {
    fixture.componentRef.setInput('status', 'loading');
    fixture.detectChanges();

    expect(element.querySelector('.panel-card__placeholder app-loading-spinner')).not.toBeNull();
    expect(element.querySelector('.top-pages__row')).toBeNull();
  });

  it('should show an error message and no rows when status is "error"', () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();

    expect(element.querySelector('.panel-card__status--error')?.textContent).toContain(
      'No se pudieron cargar',
    );
    expect(element.querySelector('.top-pages__row')).toBeNull();
  });

  it('should show an empty message when ready but there are no pages', () => {
    fixture.componentRef.setInput('pages', []);
    fixture.detectChanges();

    expect(element.querySelector('.panel-card__placeholder')?.textContent).toContain(
      'Sin datos para este período',
    );
  });
});

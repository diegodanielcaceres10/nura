import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCardData, MetricCards } from './metric-cards';

describe('MetricCards', () => {
  let fixture: ComponentFixture<MetricCards>;
  let element: HTMLElement;

  const metrics: readonly MetricCardData[] = [
    {
      id: 'users',
      label: 'Usuarios activos',
      value: '198',
      deltaPercent: 12.5,
      icon: 'users',
      accent: 'purple',
      sparkline: [4, 6, 5, 9, 7, 12],
    },
    {
      id: 'sessions',
      label: 'Sesiones',
      value: '257',
      deltaPercent: 8.7,
      icon: 'sessions',
      accent: 'blue',
      sparkline: [10, 8, 14, 9, 16, 18],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCards],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCards);
    fixture.componentRef.setInput('metrics', metrics);
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one card per metric', () => {
    expect(element.querySelectorAll('.metric-card').length).toBe(2);
  });

  it('should render the metric value, delta and caption', () => {
    const first = element.querySelector('.metric-card');
    expect(first?.querySelector('.metric-card__value')?.textContent).toContain('198');
    expect(first?.querySelector('.metric-card__delta')?.textContent).toContain('+12.5%');
    expect(first?.querySelector('.metric-card__caption')?.textContent).toContain(
      'vs. período anterior',
    );
  });

  it('should set the accent attribute used for coloring', () => {
    const cards = element.querySelectorAll('.metric-card');
    expect(cards[0].getAttribute('data-accent')).toBe('purple');
    expect(cards[1].getAttribute('data-accent')).toBe('blue');
  });

  it('should show a loading placeholder when a metric has status "loading"', () => {
    fixture.componentRef.setInput('metrics', [
      { ...metrics[0], status: 'loading' },
    ]);
    fixture.detectChanges();

    const card = element.querySelector('.metric-card');
    expect(card?.querySelector('.metric-card__value')?.textContent).toContain('···');
    expect(card?.querySelector('.metric-card__caption')?.textContent).toContain('Cargando');
  });

  it('should show an error placeholder when a metric has status "error"', () => {
    fixture.componentRef.setInput('metrics', [{ ...metrics[0], status: 'error' }]);
    fixture.detectChanges();

    const card = element.querySelector('.metric-card');
    expect(card?.querySelector('.metric-card__value')?.textContent).toContain('—');
    expect(card?.querySelector('.metric-card__caption')?.textContent).toContain(
      'No se pudo cargar',
    );
  });

  it('should mark the delta as down and omit the sign for negative values', () => {
    fixture.componentRef.setInput('metrics', [{ ...metrics[0], deltaPercent: -4.2 }]);
    fixture.detectChanges();

    const delta = element.querySelector('.metric-card__delta');
    expect(delta?.classList.contains('metric-card__delta--down')).toBe(true);
    expect(delta?.textContent).toContain('-4.2%');
  });

  it('should hide the delta row when deltaPercent is null', () => {
    fixture.componentRef.setInput('metrics', [{ ...metrics[0], deltaPercent: null }]);
    fixture.detectChanges();

    expect(element.querySelector('.metric-card__delta')).toBeNull();
  });
});

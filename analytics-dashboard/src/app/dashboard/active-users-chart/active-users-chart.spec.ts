import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveUsersChart, ActiveUsersPoint } from './active-users-chart';

describe('ActiveUsersChart', () => {
  let fixture: ComponentFixture<ActiveUsersChart>;
  let element: HTMLElement;

  const data: readonly ActiveUsersPoint[] = [
    { label: '1 abr', value: 12 },
    { label: '4 abr', value: 18 },
    { label: '7 abr', value: 15 },
    { label: '10 abr', value: 22 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveUsersChart],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveUsersChart);
    fixture.componentRef.setInput('data', data);
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title and legend', () => {
    expect(element.querySelector('h2')?.textContent).toContain('Usuarios activos');
    expect(element.querySelector('.chart-card__legend')?.textContent).toContain(
      'Usuarios activos',
    );
  });

  it('should render the y-axis ticks from 40 to 0', () => {
    const ticks = Array.from(element.querySelectorAll('.chart-card__y-axis li')).map((li) =>
      li.textContent?.trim(),
    );
    expect(ticks).toEqual(['40', '30', '20', '10', '0']);
  });

  it('should scale the y-axis to the data when values are much larger', () => {
    fixture.componentRef.setInput('data', [
      { label: '1 abr', value: 120 },
      { label: '4 abr', value: 180 },
    ]);
    fixture.detectChanges();

    const ticks = Array.from(element.querySelectorAll('.chart-card__y-axis li')).map((li) =>
      li.textContent?.trim(),
    );
    expect(ticks).toEqual(['200', '150', '100', '50', '0']);
  });

  it('should render one x-axis label per data point', () => {
    const labels = Array.from(element.querySelectorAll('.chart-card__x-axis li')).map((li) =>
      li.textContent?.trim(),
    );
    expect(labels).toEqual(['1 abr', '4 abr', '7 abr', '10 abr']);
  });

  it('should draw the line and area paths', () => {
    const line = element.querySelector('.chart-card__line');
    const area = element.querySelector('.chart-card__area');
    expect(line?.getAttribute('d')).toMatch(/^M /);
    expect(area?.getAttribute('d')).toContain('Z');
  });

  it('should render the chart and no placeholder when ready (the default)', () => {
    expect(element.querySelector('.chart-card__plot svg')).not.toBeNull();
    expect(element.querySelector('.chart-card__placeholder')).toBeNull();
  });

  it('should show a spinner and no chart while loading', () => {
    fixture.componentRef.setInput('status', 'loading');
    fixture.detectChanges();

    expect(element.querySelector('.chart-card__placeholder app-loading-spinner')).not.toBeNull();
    expect(element.querySelector('.chart-card__placeholder')?.textContent).toContain('Cargando');
    expect(element.querySelector('.chart-card__plot svg')).toBeNull();
  });

  it('should show an error message and no chart when status is "error"', () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();

    const error = element.querySelector('.chart-card__status--error');
    expect(error?.textContent).toContain('No se pudieron cargar');
    expect(element.querySelector('.chart-card__plot svg')).toBeNull();
  });

  it('should show an empty message when ready but there is no data', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();

    expect(element.querySelector('.chart-card__placeholder')?.textContent).toContain(
      'Sin datos para este período',
    );
    expect(element.querySelector('.chart-card__plot svg')).toBeNull();
  });
});

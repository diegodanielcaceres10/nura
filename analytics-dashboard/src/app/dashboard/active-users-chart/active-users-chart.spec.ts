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
});

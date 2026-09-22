import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrafficChannel, TrafficDonut } from './traffic-donut';

describe('TrafficDonut', () => {
  let fixture: ComponentFixture<TrafficDonut>;
  let element: HTMLElement;

  const channels: readonly TrafficChannel[] = [
    { id: 'organic', label: 'Organic Search', percent: 62.3, color: 'purple' },
    { id: 'direct', label: 'Direct', percent: 18.7, color: 'blue' },
    { id: 'referral', label: 'Referral', percent: 10.5, color: 'green' },
    { id: 'social', label: 'Social', percent: 5.4, color: 'pink' },
    { id: 'other', label: 'Otros', percent: 2.1, color: 'orange' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficDonut],
    }).compileComponents();

    fixture = TestBed.createComponent(TrafficDonut);
    fixture.componentRef.setInput('channels', channels);
    fixture.componentRef.setInput('totalLabel', 'Sesiones');
    fixture.componentRef.setInput('totalValue', '257');
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title', () => {
    expect(element.querySelector('h2')?.textContent).toContain('Tipos de tráfico');
  });

  it('should render the total value and label at the center', () => {
    expect(element.querySelector('.traffic-card__total-value')?.textContent).toContain('257');
    expect(element.querySelector('.traffic-card__total-label')?.textContent).toContain(
      'Sesiones',
    );
  });

  it('should render the legend sorted from highest to lowest percent', () => {
    const items = Array.from(element.querySelectorAll('.traffic-card__legend-label')).map(
      (item) => item.textContent?.trim(),
    );
    expect(items).toEqual(['Organic Search', 'Direct', 'Referral', 'Social', 'Otros']);
  });

  it('should render one arc per channel', () => {
    expect(element.querySelectorAll('.traffic-card__arc').length).toBe(5);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopEventRow, TopEvents } from './top-events';

describe('TopEvents', () => {
  let fixture: ComponentFixture<TopEvents>;
  let element: HTMLElement;

  const events: readonly TopEventRow[] = [
    { name: 'page_view', count: 779, percent: 41.3 },
    { name: 'click', count: 40, percent: 2.1 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopEvents],
    }).compileComponents();

    fixture = TestBed.createComponent(TopEvents);
    fixture.componentRef.setInput('events', events);
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title', () => {
    expect(element.querySelector('h2')?.textContent).toContain('Eventos principales');
  });

  it('should render one row per event with its count and percent', () => {
    const rows = element.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('page_view');
    expect(rows[0].textContent).toContain('779');
    expect(rows[0].textContent).toContain('41.3%');
  });
});

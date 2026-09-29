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

  it('should render the table and no placeholder when ready (the default)', () => {
    expect(element.querySelector('.top-events__table')).not.toBeNull();
    expect(element.querySelector('.panel-card__placeholder')).toBeNull();
  });

  it('should show a spinner and no rows while loading', () => {
    fixture.componentRef.setInput('status', 'loading');
    fixture.detectChanges();

    expect(element.querySelector('.panel-card__placeholder app-loading-spinner')).not.toBeNull();
    expect(element.querySelector('tbody tr')).toBeNull();
  });

  it('should show an error message and no rows when status is "error"', () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();

    expect(element.querySelector('.panel-card__status--error')?.textContent).toContain(
      'No se pudieron cargar',
    );
    expect(element.querySelector('tbody tr')).toBeNull();
  });

  it('should show an empty message when ready but there are no events', () => {
    fixture.componentRef.setInput('events', []);
    fixture.detectChanges();

    expect(element.querySelector('.panel-card__placeholder')?.textContent).toContain(
      'Sin datos para este período',
    );
  });
});

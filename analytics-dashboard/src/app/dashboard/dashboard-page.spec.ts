import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard-page';

describe('DashboardPage', () => {
  let fixture: ComponentFixture<DashboardPage>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the Nura and Google Analytics logos', () => {
    expect(element.querySelector('img[alt="Nura Logo"]')).not.toBeNull();
    expect(element.querySelector('img[alt="Logo de Google Analytics"]')).not.toBeNull();
  });

  it('should render the title and subtitle', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Google Analytics');
    expect(element.querySelector('.dashboard__subtitle')?.textContent).toContain(
      'Descubre cómo interactúan los usuarios con tu web.',
    );
  });

  it('should list the period options with the last 28 days selected by default', () => {
    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    expect(select?.options.length).toBe(4);
    expect(select?.value).toBe('28d');
  });

  it('should update the selected period when the selector changes', () => {
    const select = element.querySelector<HTMLSelectElement>('select.period__select');
    select!.value = '7d';
    select!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance['period']()).toBe('7d');
  });
});

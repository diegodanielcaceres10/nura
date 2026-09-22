import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryCard } from './summary-card';

describe('SummaryCard', () => {
  let fixture: ComponentFixture<SummaryCard>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCard);
    fixture.componentRef.setInput('summary', 'Tu sitio web está teniendo un buen rendimiento.');
    fixture.componentRef.setInput('opportunityTitle', 'Oportunidad');
    fixture.componentRef.setInput(
      'opportunityText',
      'Considera crear más contenido en el blog.',
    );
    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title and summary text', () => {
    expect(element.querySelector('h2')?.textContent).toContain('Resumen');
    expect(element.querySelector('.summary-card__text')?.textContent).toContain(
      'buen rendimiento',
    );
  });

  it('should render the opportunity block', () => {
    expect(element.querySelector('.summary-card__opportunity-title')?.textContent).toContain(
      'Oportunidad',
    );
    expect(element.querySelector('.summary-card__opportunity-text')?.textContent).toContain(
      'crear más contenido',
    );
  });
});

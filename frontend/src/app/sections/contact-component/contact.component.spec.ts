import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    vi.stubGlobal('$localize', (message: string | TemplateStringsArray) => (typeof message === 'string' ? message : (message[0] ?? '')));

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should render the contact section and title', () => {
    const native = fixture.nativeElement as HTMLElement;

    expect(native.querySelector('.contact')).not.toBeNull();
    expect(native.querySelector('app-title-component')).not.toBeNull();
  });

  it('should have contact channels with default values', () => {
    const channels = component['channels']();

    expect(channels.length).toBe(4);
    expect(channels[0].label).toBe('Email');
    expect(channels[1].label).toBe('LinkedIn');
    expect(channels[2].label).toBe('GitHub');
    expect(channels[3].label).toBe('npm');
  });

  it('should have availability meta information', () => {
    const meta = component['availabilityMeta']();

    expect(meta.length).toBe(2);
    expect(meta[0].title).toBe('CONTACT_AVAILABILITY_GLOBE_TITLE');
    expect(meta[1].title).toBe('CONTACT_AVAILABILITY_CLOCK_TITLE');
  });
});

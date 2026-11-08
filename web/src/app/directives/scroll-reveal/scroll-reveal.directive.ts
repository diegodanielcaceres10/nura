import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import { ScrollAnimateService } from '../../services/scroll/scroll-animate.service';

export type RevealType = 'fade-up' | 'fade-down' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale-up';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly scrollAnimate = inject(ScrollAnimateService);

  @Input('appScrollReveal') type: RevealType | '' = 'fade-up';
  @Input() revealType?: RevealType;
  @Input() revealDelay = 0;
  @Input() revealDuration = 650;
  @Input() revealDistance = 20;
  @Input() revealOnce = true;
  @Input() revealSelector?: string;
  @Input() revealStaggerDelay = 70;

  ngOnInit(): void {
    const element = this.el.nativeElement;
    const animationType = this.revealType || this.type || 'fade-up';

    if (this.scrollAnimate.prefersReducedMotion) {
      this.renderer.addClass(element, 'revealed');
      if (this.revealSelector) {
        const children = Array.from(element.querySelectorAll(this.revealSelector)) as HTMLElement[];
        children.forEach((child: HTMLElement) => this.renderer.addClass(child, 'revealed'));
      }
      return;
    }

    if (this.revealSelector) {
      const children = Array.from(element.querySelectorAll(this.revealSelector)) as HTMLElement[];
      children.forEach((child: HTMLElement, index: number) => {
        const delay = (this.revealDelay || 0) + index * this.revealStaggerDelay;
        child.style.setProperty('--reveal-delay', `${delay}ms`);
        if (this.revealDuration !== 650) {
          child.style.setProperty('--reveal-duration', `${this.revealDuration}ms`);
        }
        if (this.revealDistance !== 20) {
          child.style.setProperty('--reveal-distance', `${this.revealDistance}px`);
        }
        this.renderer.addClass(child, 'reveal-init');
        this.renderer.addClass(child, `reveal-${animationType}`);
      });

      this.scrollAnimate.observe(
        element,
        () => {
          this.renderer.addClass(element, 'revealed');
          children.forEach((child: HTMLElement) => this.renderer.addClass(child, 'revealed'));
        },
        { once: this.revealOnce }
      );
      return;
    }

    // Direct element observation
    if (this.revealDelay > 0) {
      element.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);
    }
    if (this.revealDuration !== 650) {
      element.style.setProperty('--reveal-duration', `${this.revealDuration}ms`);
    }
    if (this.revealDistance !== 20) {
      element.style.setProperty('--reveal-distance', `${this.revealDistance}px`);
    }

    this.renderer.addClass(element, 'reveal-init');
    this.renderer.addClass(element, `reveal-${animationType}`);

    this.scrollAnimate.observe(
      element,
      () => {
        this.renderer.addClass(element, 'revealed');
      },
      { once: this.revealOnce }
    );
  }

  ngOnDestroy(): void {
    this.scrollAnimate.unobserve(this.el.nativeElement);
  }
}

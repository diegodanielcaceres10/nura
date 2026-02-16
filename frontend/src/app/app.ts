import { Component, signal } from '@angular/core';
import { Card } from './shared/card/card';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { About } from './sections/about/about';
import { Experience } from './sections/experience/experience';
import { Skills } from './sections/skills/skills';
import { Projects } from './sections/projects/projects';
import { Testimonials } from './sections/testimonials/testimonials';
import { Contact } from './sections/contact/contact';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, Card, About, Experience, Skills, Projects, Testimonials, Contact],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}

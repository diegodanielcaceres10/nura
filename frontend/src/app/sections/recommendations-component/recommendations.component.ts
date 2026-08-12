import { Component, signal } from '@angular/core';
import { TranslateKeyPipe } from '../../services/translate/translate-key.pipe';
import { TitleComponent } from '../../components/title/title.component';

export interface Testimonial {
  avatar: string;
  name: string;
  linkedinUrl?: string;
  role: string;
  quote: string;
  duration: string;
  location: string;
  lang: string;
}

@Component({
  selector: 'app-recommendations-component',
  standalone: true,
  imports: [TranslateKeyPipe, TitleComponent],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
})
export class RecommendationsComponent {
  protected readonly testimonials = signal<Testimonial[]>([
    {
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQHtj2b_f7H9IA/profile-displayphoto-scale_400_400/B4DZnkY0WjKoAg-/0/1760473335928?e=1786579200&v=beta&t=wGTC65frXUclXyPlM07PRFT0-tpxrHxZNmqrxVOu-4s',
      name: 'Bruno Zanon',
      linkedinUrl: 'https://www.linkedin.com/in/brunozanondev/',
      role: 'Programador (PHP Laravel)',
      quote:
        'Tive a oportunidade de trabalhar com este profissional e posso afirmar que ele é uma das pessoas mais organizadas, dedicadas e comprometidas com quem já atuei. Além do excelente conhecimento técnico, sempre demonstrou muita paciência e disponibilidade para orientar a equipe, compartilhando sua experiência e ajudando na resolução de desafios do dia a dia. Sua expertise em PHP, Angular, bancos de dados e outras tecnologias foi fundamental para o meu desenvolvimento profissional, proporcionando aprendizados que levo até hoje. Sua capacidade de liderança, aliada à habilidade de transmitir conhecimento de forma clara e objetiva, contribuiu diretamente para a minha evolução dentro da empresa. É um profissional altamente competente, confiável e que certamente agrega muito valor a qualquer equipe.',
      duration: '1+',
      location: 'Brasil',
      lang: 'Português',
    },
    {
      avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQHVteIxWOMktg/profile-displayphoto-scale_400_400/B4DZnh8w4dGQAk-/0/1760432433286?e=1786579200&v=beta&t=-nc5w1tcqsF2gT_0wy_tRCa45H8HX3pXds4j6MHIKP0',
      name: 'Paulo César Rodrigues',
      linkedinUrl: 'https://www.linkedin.com/in/rodrigpc/',
      role: 'Founder & CEO da empresa Claxion Tech',
      quote:
        'I had the pleasure of directly managing Diego during his time at WS Solutions – Cesla, where he worked as a Full Stack Developer and Tech Lead. Throughout our time working together, Diego consistently demonstrated strong technical expertise, leadership, and a genuine commitment to delivering high-quality solutions. He has an excellent ability to understand complex business requirements and translate them into robust, scalable software. Beyond his technical skills, Diego is a collaborative leader who supports his team, takes ownership of challenges, and remains focused on delivering results. Diego is reliable, proactive, and always willing to go the extra mile when needed. I highly recommend him to any organization looking for a skilled software engineer and technical leader. I am confident he will be a valuable asset to any team fortunate enough to work with him.',
      duration: 'Worked together for 4+',
      location: 'Brasil',
      lang: 'English',
    },
    {
      avatar: 'https://media.licdn.com/dms/image/v2/C4D03AQH1bK9afDQ_EA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516631607637?e=1786579200&v=beta&t=fomq6AxXUQNO1mDMtOogJlA-ur1pmr89acN8rCIR_Z0',
      name: 'Marisa Rosana Paredes',
      linkedinUrl: 'https://www.linkedin.com/in/marisa-rosana-paredes-58358317/',
      role: 'Senior Software Engineer',
      quote: 'Diego es una persona proactiva , dedicada, con alto nivel de pertencia para con la empresa. Un desarrollador muy capaz, destaco sobre todo su actitud ante lo nuevo y los desafios. Ademas de un excelente profesional es una excelente persona.Un gusto trabajar con el.',
      duration: '1+',
      location: 'Argentina',
      lang: 'Español',
    },
  ]);
}

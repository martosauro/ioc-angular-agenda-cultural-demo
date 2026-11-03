import { Component } from '@angular/core';
import { CookingListComponent } from './components/cooking-list/cooking-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CookingListComponent],
  template: `
    <a href="#main-content" class="skip-link">Saltar al contingut principal</a>
    <main id="main-content">
      <app-cooking-list></app-cooking-list>
    </main>
  `,
  styles: [`
    .skip-link {
      position: absolute;
      top: -50px;
      left: 0;
      background: #245bff;
      color: white;
      padding: 8px 16px;
      z-index: 100;
      font-weight: bold;
      border-radius: 0 0 4px 0;
      transition: top 0.3s ease;
    }
    .skip-link:focus {
      top: 0;
    }
    main { padding: 20px; background-color: #f1f5f9; min-height: 100vh; }
  `]
})
export class AppComponent {
  title = 'ioc-angular-agenda-cultural-demo';
}
export { AppComponent as App };
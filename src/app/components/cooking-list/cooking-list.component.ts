import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookingCategory, CookingItem } from '../../models/cooking-item.model';
import { CookingCardComponent } from '../cooking-card/cooking-card.component';
import { CookingFilterComponent } from '../cooking-filter/cooking-filter.component';
import { CookingEventsService, SearchCriteria } from '../../services/cooking-events.service';

@Component({
  selector: 'app-cooking-list',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    FormsModule,
    CookingCardComponent,
    CookingFilterComponent
  ],
  template: `
    <div class="container">
      <header class="page-header">
        <h2>Agenda de Tallers de Cuina i Catas de Vi</h2>
        <button type="button" class="btn-toggle-create" (click)="showCreateForm = !showCreateForm">
          {{ showCreateForm ? 'Tancar formulari' : '+ Nou esdeveniment (POST)' }}
        </button>
      </header>

      <!-- Formulari per crear un nou element amb POST -->
      @if (showCreateForm) {
        <section class="create-box" aria-label="Crear nou esdeveniment">
          <h3>Afegir nou taller o cata</h3>
          <form (ngSubmit)="onCreateEvent()" #createForm="ngForm" class="create-form">
            <div class="field">
              <label for="newTitle">Títol *</label>
              <input id="newTitle" name="title" [(ngModel)]="newEvent.title" required minlength="3" placeholder="Ex: Cata de Caves Artesans" />
            </div>
            <div class="field">
              <label for="newCategory">Categoria *</label>
              <select id="newCategory" name="category" [(ngModel)]="newEvent.category" required>
                <option value="Taller">Taller</option>
                <option value="Cata">Cata</option>
                <option value="Showcooking">Showcooking</option>
                <option value="Masterclass">Masterclass</option>
              </select>
            </div>
            <div class="field">
              <label for="newDate">Data *</label>
              <input id="newDate" type="date" name="date" [(ngModel)]="newEvent.date" required />
            </div>
            <div class="field">
              <label for="newLocation">Ubicació *</label>
              <input id="newLocation" name="location" [(ngModel)]="newEvent.location" required placeholder="Ex: Terrassa" />
            </div>
            <div class="field">
              <label for="newPrice">Preu (€) *</label>
              <input id="newPrice" type="number" name="price" [(ngModel)]="newEvent.price" required min="0" />
            </div>
            <div class="field full">
              <label for="newDesc">Descripció *</label>
              <input id="newDesc" name="description" [(ngModel)]="newEvent.description" required placeholder="Breu descripció de l'activitat" />
            </div>
            <div class="create-actions">
              <button type="submit" class="btn-primary" [disabled]="createForm.invalid">Desar a l'API</button>
            </div>
          </form>
        </section>
      }

      <!-- Component de Filtres -->
      <app-cooking-filter (filterChanged)="applyFilter($event)"></app-cooking-filter>

      <!-- Estat de càrrega -->
      @if (loading$ | async) {
        <div class="loading-box" role="status" aria-live="polite">
          Carregant dades des de l'API...
        </div>
      }

      <!-- Banner d'error amb botó Reintentar -->
      @if (error$ | async; as errorMsg) {
        <div class="error-banner" role="alert" aria-live="assertive">
          <span>⚠️ {{ errorMsg }}</span>
          <button type="button" class="btn-retry" (click)="retryLoad()">Reintentar</button>
        </div>
      }

      <!-- Llistat i detall -->
      @if (items$ | async; as items) {
        <p class="results-count" role="status" aria-live="polite">
          Total de resultats trobats: <strong>{{ items.length }}</strong>
        </p>

        <div class="layout-grid">
          <div class="list-section">
            @if (items.length > 0) {
              <div class="cards-grid">
                @for (item of items; track item.id) {
                  <app-cooking-card
                    [item]="item"
                    (selectItem)="selectedItem = $event"
                  ></app-cooking-card>
                }
              </div>
            } @else {
              <div class="no-results" role="alert">
                <p>No s'ha trobat cap taller o cata que coincideixi amb els criteris de cerca.</p>
              </div>
            }
          </div>

          <div class="detail-section">
            <h3>Detall de l'Esdeveniment</h3>
            @if (selectedItem) {
              <div class="detail-card">
                <h4>{{ selectedItem.title }}</h4>
                <p><strong>Categoria:</strong> {{ selectedItem.category }}</p>
                <p><strong>Ubicació:</strong> {{ selectedItem.location }}</p>
                <p><strong>Descripció:</strong> {{ selectedItem.description }}</p>
                <p><strong>Data:</strong> {{ selectedItem.date | date:'longDate' }}</p>
                <p class="detail-price"><strong>Preu:</strong> {{ selectedItem.price }} €</p>
              </div>
            } @else {
              <p class="select-hint">Selecciona una targeta del llistat per veure'n els detalls.</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
    .page-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 20px; }
    h2 { color: #0f172a; margin: 0; }
    .btn-toggle-create, .btn-primary {
      background: #0284c7; color: white; border: none; padding: 10px 16px;
      border-radius: 6px; cursor: pointer; font-weight: bold;
    }
    .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
    .create-box {
      background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px;
      padding: 16px; margin-bottom: 20px;
    }
    .create-box h3 { margin-top: 0; color: #1e293b; }
    .create-form { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
    .create-form .field { display: flex; flex-direction: column; }
    .create-form .field.full { grid-column: 1 / -1; }
    .create-form label { font-size: 0.85rem; font-weight: bold; margin-bottom: 4px; color: #475569; }
    .create-form input, .create-form select { padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; }
    .create-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; }
    .loading-box {
      padding: 12px 16px; background: #e0f2fe; border: 1px solid #0284c7;
      color: #0369a1; border-radius: 6px; margin-bottom: 16px; font-weight: bold;
    }
    .error-banner {
      display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;
      padding: 14px 16px; background: #fef2f2; border: 1px solid #dc2626;
      color: #991b1b; border-radius: 6px; margin-bottom: 16px; font-weight: bold;
    }
    .btn-retry {
      background: #dc2626; color: white; border: none; padding: 8px 14px;
      border-radius: 4px; cursor: pointer; font-weight: bold;
    }
    .results-count { font-size: 0.95rem; color: #475569; margin-bottom: 16px; }
    .layout-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    @media (max-width: 768px) { .layout-grid { grid-template-columns: 1fr; } }
    .cards-grid { display: flex; flex-direction: column; gap: 16px; }
    .no-results { padding: 20px; background: #fff2ef; border: 1px solid #8a1f11; border-radius: 6px; color: #8a1f11; text-align: center; }
    .detail-section { background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 8px; height: fit-content; }
    .detail-card h4 { margin-top: 0; color: #0284c7; }
    .detail-price { font-size: 1.1rem; color: #16a34a; font-weight: bold; }
    .select-hint { color: #94a3b8; font-style: italic; }
  `]
})
export class CookingListComponent {
  private readonly eventsService = inject(CookingEventsService);

  readonly items$ = this.eventsService.items$;
  readonly loading$ = this.eventsService.loading$;
  readonly error$ = this.eventsService.error$;

  selectedItem: CookingItem | null = null;
  showCreateForm = false;

  newEvent: {
    title: string;
    description: string;
    category: CookingCategory;
    date: string;
    location: string;
    price: number;
    featured: boolean;
  } = {
    title: '',
    description: '',
    category: 'Taller',
    date: '2026-07-20',
    location: 'Terrassa',
    price: 35,
    featured: false
  };

  applyFilter(filter: SearchCriteria): void {
    this.eventsService.search(filter);
  }

  retryLoad(): void {
    this.eventsService.retry();
  }

  onCreateEvent(): void {
    this.eventsService.createEvent(this.newEvent).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.newEvent = {
          title: '',
          description: '',
          category: 'Taller',
          date: '2026-07-20',
          location: 'Terrassa',
          price: 35,
          featured: false
        };
      }
    });
  }
}
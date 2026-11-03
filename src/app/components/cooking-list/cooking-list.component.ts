import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CookingItem } from '../../models/cooking-item.model';
import { COOKING_ITEMS_MOCK } from '../../models/cooking-items.mock';
import { CookingCardComponent } from '../cooking-card/cooking-card.component';
import { CookingFilterComponent } from '../cooking-filter/cooking-filter.component';

@Component({
  selector: 'app-cooking-list',
  standalone: true,
  imports: [CommonModule, CookingCardComponent, CookingFilterComponent, DatePipe],
  template: `
    <div class="container">
      <h2>Agenda de Tallers de Cuina i Catas de Vi</h2>

      <!-- Componente de Filtres (Exercici 3) -->
      <app-cooking-filter (filterChanged)="applyFilter($event)"></app-cooking-filter>

      <!-- Comptador de resultats (Exercici 4) -->
      <p class="results-count" role="status" aria-live="polite">
        Total de resultats trobats: <strong>{{ filteredItems.length }}</strong>
      </p>

      <div class="layout-grid">
        <!-- Llistat amb @for i track (Exercici 4) -->
        <div class="list-section">
          @if (filteredItems.length > 0) {
            <div class="cards-grid">
              @for (item of filteredItems; track item.id) {
                <app-cooking-card 
                  [item]="item" 
                  (selectItem)="selectedItem = $event"
                ></app-cooking-card>
              }
            </div>
          } @else {
            <!-- Estat sense resultats (Exercici 4) -->
            <div class="no-results" role="alert">
              <p>No s'ha trobat cap taller o cata que coincideixi amb els criteris de cerca.</p>
            </div>
          }
        </div>

        <!-- Panell de Detall de l'element seleccionat (Exercici 4) -->
        <div class="detail-section">
          <h3>Detall de l'Esdeveniment</h3>
          @if (selectedItem) {
            <div class="detail-card">
              <h4>{{ selectedItem.title }}</h4>
              <p><strong>Categoria:</strong> {{ selectedItem.category }}</p>
              <p><strong>Descripció:</strong> {{ selectedItem.description }}</p>
              <!-- Ús de pipe de data (Exercici 4) -->
              <p><strong>Data:</strong> {{ selectedItem.date | date:'longDate' }}</p>
              <p class="detail-price"><strong>Preu:</strong> {{ selectedItem.price }} €</p>
            </div>
          } @else {
            <p class="select-hint">Selecciona una targeta del llistat per veure'n els detalls.</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
    h2 { color: #0f172a; margin-bottom: 20px; }
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
  allItems: CookingItem[] = COOKING_ITEMS_MOCK;
  filteredItems: CookingItem[] = COOKING_ITEMS_MOCK;
  selectedItem: CookingItem | null = null;

  applyFilter(filter: { text: string, category: string }) {
    this.filteredItems = this.allItems.filter(item => {
      const matchesText = filter.text ? item.title.toLowerCase().includes(filter.text.toLowerCase()) : true;
      const matchesCategory = filter.category ? item.category === filter.category : true;
      return matchesText && matchesCategory;
    });
  }
}
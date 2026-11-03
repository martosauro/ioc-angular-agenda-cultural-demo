import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cooking-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container">
      <h3>Filtrar Taller o Cata</h3>
      <form #filterForm="ngForm" class="filter-form">
        
        <div class="form-group">
          <label for="searchText">Cercar per text:</label>
          <input 
            type="text" 
            id="searchText" 
            name="searchText"
            [(ngModel)]="searchText" 
            required 
            minlength="3"
            #searchModel="ngModel"
            placeholder="Ex: Vi, Pasta, Sushi..."
            (ngModelChange)="onFilterChange()"
          >
          <!-- Missatge d'error de longitud mínima -->
          <div *ngIf="searchModel.invalid && (searchModel.dirty || searchModel.touched)" class="error-message">
            <small *ngIf="searchModel.errors?.['required']">El camp de cerca és obligatori.</small>
            <small *ngIf="searchModel.errors?.['minlength']">Cal introduir almenys 3 caràcters.</small>
          </div>
        </div>

        <div class="form-group">
          <label for="categorySelect">Categoria:</label>
          <select 
            id="categorySelect" 
            name="category"
            [(ngModel)]="selectedCategory"
            (ngModelChange)="onFilterChange()"
          >
            <option value="">Totes les categories</option>
            <option value="Taller">Taller</option>
            <option value="Cata">Cata</option>
            <option value="Showcooking">Showcooking</option>
            <option value="Masterclass">Masterclass</option>
          </select>
        </div>

        <div class="form-actions">
          <!-- Botó deshabilitat quan el formulari és invàlid -->
          <button 
            type="button" 
            class="btn-reset" 
            (click)="resetFilters(filterForm)"
          >
            Restablir filtres
          </button>
        </div>

      </form>
    </div>
  `,
  styles: [`
    .filter-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    h3 { margin-top: 0; font-size: 1.1rem; color: #1e293b; }
    .filter-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-end;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 200px;
    }
    label { font-size: 0.9rem; font-weight: bold; margin-bottom: 4px; color: #475569; }
    input, select {
      padding: 8px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 0.95rem;
    }
    .error-message { color: #dc2626; font-size: 0.8rem; margin-top: 4px; }
    .form-actions { display: flex; gap: 8px; }
    .btn-reset {
      padding: 9px 16px;
      background-color: #e2e8f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      color: #334155;
    }
    .btn-reset:hover { background-color: #cbd5e1; }
  `]
})
export class CookingFilterComponent {
  searchText: string = '';
  selectedCategory: string = '';

  @Output() filterChanged = new EventEmitter<{ text: string, category: string }>();

  onFilterChange() {
    this.filterChanged.emit({
      text: this.searchText,
      category: this.selectedCategory
    });
  }

  resetFilters(form: any) {
    this.searchText = '';
    this.selectedCategory = '';
    form.resetForm({ searchText: '', category: '' });
    this.onFilterChange();
  }
}
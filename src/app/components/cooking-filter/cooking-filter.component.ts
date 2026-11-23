import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  timer
} from 'rxjs';
import { CookingEventsService, SearchCriteria } from '../../services/cooking-events.service';

const HISTORY_STORAGE_KEY = 'cooking_search_history';
const MAX_HISTORY_ITEMS = 5;

// Validador síncron personalitzat: mínim 2 caràcters (si no està buit) i sense símbols prohibits
function searchTermSyncValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '') as string;
    const trimmed = raw.trim();

    if (!trimmed) {
      return null; // Buit és vàlid per mostrar tots els resultats
    }
    if (trimmed.length < 2) {
      return { minLengthTrimmed: { requiredLength: 2, actualLength: trimmed.length } };
    }
    if (/[<>{}$]/.test(trimmed)) {
      return { forbiddenChars: true };
    }
    return null;
  };
}

// Validador asíncron: comprova contra l'API si existeix algun resultat per al terme
function termExistsAsyncValidator(eventsService: CookingEventsService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const trimmed = ((control.value ?? '') as string).trim();
    if (!trimmed || trimmed.length < 2) {
      return of(null);
    }

    return timer(350).pipe(
      switchMap(() => eventsService.hasResultsForTerm(trimmed)),
      map((hasResults) => (hasResults ? null : { noApiMatches: true }))
    );
  };
}

@Component({
  selector: 'app-cooking-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="filter-container">
      <h3>Filtrar Taller o Cata (Formulari Reactiu)</h3>

      <form [formGroup]="filterForm" class="filter-form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="searchText">Cercar per text (títol, descripció o ubicació):</label>
          <input
            type="text"
            id="searchText"
            formControlName="text"
            placeholder="Ex: Vi, Pasta, Barcelona..."
            autocomplete="off"
          />

          <!-- Estat de validació asíncrona -->
          @if (textControl.pending) {
            <small class="pending-message" role="status">Comprovant coincidències a l'API...</small>
          }

          <!-- Errors de validació síncrona i asíncrona -->
          @if (textControl.invalid && (textControl.dirty || textControl.touched)) {
            <div class="error-message" role="alert">
              @if (textControl.errors?.['minLengthTrimmed']) {
                <small>Cal introduir almenys 2 caràcters per cercar.</small>
              }
              @if (textControl.errors?.['forbiddenChars']) {
                <small>No s'accepten caràcters especials (&lt; &gt; &#123; &#125; $).</small>
              }
              @if (textControl.errors?.['noApiMatches']) {
                <small>Validació asíncrona: no hi ha cap esdeveniment a l'API amb aquest text.</small>
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="categorySelect">Categoria:</label>
          <select id="categorySelect" formControlName="category">
            <option value="">Totes les categories</option>
            <option value="Taller">Taller</option>
            <option value="Cata">Cata</option>
            <option value="Showcooking">Showcooking</option>
            <option value="Masterclass">Masterclass</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-search" [disabled]="filterForm.invalid || filterForm.pending">
            Cercar
          </button>
          <button type="button" class="btn-reset" (click)="resetFilters()">
            Restablir filtres
          </button>
        </div>
      </form>

      <!-- Historial de cerques guardat a localStorage -->
      @if (searchHistory.length > 0) {
        <div class="history-section">
          <span class="history-label">Cerques recents:</span>
          <div class="history-chips">
            @for (term of searchHistory; track term) {
              <button type="button" class="chip" (click)="applyHistoryTerm(term)">
                🕒 {{ term }}
              </button>
            }
            <button type="button" class="btn-clear-history" (click)="clearHistory()">
              Netejar historial
            </button>
          </div>
        </div>
      }
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
      align-items: flex-start;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 220px;
    }
    label { font-size: 0.9rem; font-weight: bold; margin-bottom: 4px; color: #475569; }
    input, select {
      padding: 8px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 0.95rem;
    }
    input.ng-invalid.ng-touched { border-color: #dc2626; }
    .pending-message { color: #0284c7; font-size: 0.8rem; margin-top: 4px; }
    .error-message { color: #dc2626; font-size: 0.8rem; margin-top: 4px; display: flex; flex-direction: column; gap: 2px; }
    .form-actions { display: flex; gap: 8px; padding-top: 22px; }
    .btn-search {
      padding: 9px 16px;
      background-color: #0284c7;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .btn-search:disabled { background-color: #94a3b8; cursor: not-allowed; }
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
    .history-section {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .history-label { font-size: 0.85rem; font-weight: bold; color: #475569; }
    .history-chips { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .chip {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
      border-radius: 16px;
      padding: 4px 10px;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .chip:hover { background: #bae6fd; }
    .btn-clear-history {
      background: transparent;
      border: none;
      color: #dc2626;
      font-size: 0.8rem;
      cursor: pointer;
      text-decoration: underline;
    }
  `]
})
export class CookingFilterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly eventsService = inject(CookingEventsService);
  private readonly destroyRef = inject(DestroyRef);

  @Output() filterChanged = new EventEmitter<SearchCriteria>();

  readonly filterForm = this.fb.nonNullable.group({
    text: [
      '',
      [searchTermSyncValidator()],
      [termExistsAsyncValidator(this.eventsService)]
    ],
    category: ['']
  });

  searchHistory: string[] = [];

  get textControl() {
    return this.filterForm.controls.text;
  }

  ngOnInit(): void {
    this.loadHistory();

    // Debounce + distinctUntilChanged per no saturar l'API
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(
          (prev, curr) => prev.text === curr.text && prev.category === curr.category
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        const text = (value.text ?? '').trim();
        const category = value.category ?? '';

        // Només emetem si no hi ha errors síncrons
        if (!this.textControl.errors?.['minLengthTrimmed'] && !this.textControl.errors?.['forbiddenChars']) {
          this.filterChanged.emit({ text, category });
          if (text.length >= 2) {
            this.saveToHistory(text);
          }
        }
      });
  }

  onSubmit(): void {
    if (this.filterForm.invalid) return;
    const text = this.filterForm.controls.text.value.trim();
    const category = this.filterForm.controls.category.value;
    this.filterChanged.emit({ text, category });
    if (text.length >= 2) {
      this.saveToHistory(text);
    }
  }

  resetFilters(): void {
    this.filterForm.reset({ text: '', category: '' });
    this.filterChanged.emit({ text: '', category: '' });
  }

  applyHistoryTerm(term: string): void {
    this.filterForm.patchValue({ text: term });
    this.textControl.markAsTouched();
  }

  clearHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }

  private loadHistory(): void {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      this.searchHistory = saved ? JSON.parse(saved) : [];
    } catch {
      this.searchHistory = [];
    }
  }

  private saveToHistory(term: string): void {
    const filtered = this.searchHistory.filter(
      (item) => item.toLowerCase() !== term.toLowerCase()
    );
    this.searchHistory = [term, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.searchHistory));
    } catch {
      // Ignorem errors de quota de localStorage
    }
  }
}
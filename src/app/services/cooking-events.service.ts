import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { CookingItem } from '../models/cooking-item.model';
import { CookingItemApi } from '../models/cooking-item-api.model';
import { CookingItemAdapter } from '../adapters/cooking-item.adapter';

export interface SearchCriteria {
  text: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class CookingEventsService {
  private readonly http = inject(HttpClient);

  // Subject que dispara les cerques i recàrregues (utilitzat amb switchMap)
  private readonly searchTrigger$ = new BehaviorSubject<SearchCriteria>({
    text: '',
    category: ''
  });

  private readonly itemsSubject = new BehaviorSubject<CookingItem[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly items$ = this.itemsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  private lastCriteria: SearchCriteria = { text: '', category: '' };

  constructor() {
    // Flux reactiu principal amb switchMap
    this.searchTrigger$
      .pipe(
        tap((criteria) => {
          this.lastCriteria = criteria;
          this.loadingSubject.next(true);
          this.errorSubject.next(null);
        }),
        switchMap((criteria) =>
          this.http.get<CookingItemApi[]>(API_CONFIG.eventsEndpoint).pipe(
            map((apiItems) => apiItems.map((item) => CookingItemAdapter.fromApi(item))),
            map((items) => this.filterItems(items, criteria)),
            catchError(() => {
              this.errorSubject.next(
                'No s’ha pogut connectar amb l’API local. Comprova que json-server estigui en marxa.'
              );
              return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
          )
        )
      )
      .subscribe((items) => {
        this.itemsSubject.next(items);
      });
  }

  search(criteria: SearchCriteria): void {
    this.searchTrigger$.next(criteria);
  }

  retry(): void {
    this.searchTrigger$.next({ ...this.lastCriteria });
  }

  createEvent(newEvent: Omit<CookingItem, 'id'>): Observable<CookingItem> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const payload = CookingItemAdapter.toApi(newEvent);

    return this.http.post<CookingItemApi>(API_CONFIG.eventsEndpoint, payload).pipe(
      map((createdApi) => CookingItemAdapter.fromApi(createdApi)),
      tap(() => this.retry()),
      catchError((err) => {
        this.errorSubject.next('No s’ha pogut crear el nou esdeveniment a l’API.');
        throw err;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  // Mètode per a la validació asíncrona de l'Exercici 4
  hasResultsForTerm(term: string): Observable<boolean> {
    const clean = term.trim().toLowerCase();
    if (!clean) {
      return of(true);
    }
    return this.http.get<CookingItemApi[]>(API_CONFIG.eventsEndpoint).pipe(
      map((apiItems) => apiItems.map((item) => CookingItemAdapter.fromApi(item))),
      map((items) =>
        items.some(
          (item) =>
            item.title.toLowerCase().includes(clean) ||
            item.description.toLowerCase().includes(clean) ||
            item.location.toLowerCase().includes(clean)
        )
      ),
      catchError(() => of(true))
    );
  }

  private filterItems(items: CookingItem[], criteria: SearchCriteria): CookingItem[] {
    const cleanText = criteria.text.trim().toLowerCase();
    const cleanCategory = criteria.category.trim();

    return items.filter((item) => {
      const matchesText = cleanText
        ? item.title.toLowerCase().includes(cleanText) ||
          item.description.toLowerCase().includes(cleanText) ||
          item.location.toLowerCase().includes(cleanText)
        : true;
      const matchesCategory = cleanCategory ? item.category === cleanCategory : true;
      return matchesText && matchesCategory;
    });
  }
}
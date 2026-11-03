import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookingItem } from '../../models/cooking-item.model';
import { CookingBadgeComponent } from '../cooking-badge/cooking-badge.component';

@Component({
  selector: 'app-cooking-card',
  standalone: true,
  imports: [CommonModule, CookingBadgeComponent],
  template: `
    <div class="card" (click)="onSelect()">
      <div class="card-header">
        <h3>{{ item.title }}</h3>
        <app-cooking-badge [category]="item.category"></app-cooking-badge>
      </div>
      <p class="description">{{ item.description }}</p>
      <div class="card-footer">
        <span class="date">📅 {{ item.date }}</span>
        <span class="price">💶 {{ item.price }} €</span>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      background: white;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    h3 { margin: 0; font-size: 1.1rem; color: #0f172a; }
    .description { color: #475569; font-size: 0.95rem; margin-bottom: 12px; }
    .card-footer {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #64748b;
    }
    .price { font-weight: bold; color: #0284c7; }
  `]
})
export class CookingCardComponent {
  @Input({ required: true }) item!: CookingItem;
  @Output() selectItem = new EventEmitter<CookingItem>();

  onSelect() {
    this.selectItem.emit(this.item);
  }
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cooking-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge category-{{ category.toLowerCase() }}">
      {{ category }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 4px 8px;
      font-size: 0.85rem;
      font-weight: bold;
      border-radius: 4px;
      background-color: #e2e8f0;
      color: #334155;
    }
    .category-cata { background-color: #fee2e2; color: #991b1b; }
    .category-taller { background-color: #dbeafe; color: #1e40af; }
    .category-showcooking { background-color: #fef3c7; color: #92400e; }
    .category-masterclass { background-color: #f3e8ff; color: #6b21a8; }
  `]
})
export class CookingBadgeComponent {
  @Input({ required: true }) category!: string;
}
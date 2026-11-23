import { CookingCategory, CookingItem } from '../models/cooking-item.model';
import { CookingItemApi } from '../models/cooking-item-api.model';

export class CookingItemAdapter {
  static fromApi(apiItem: CookingItemApi): CookingItem {
    const cleanTitle = (apiItem.event_title ?? '').trim() || 'Activitat sense títol';
    const cleanDesc = (apiItem.event_desc ?? '').trim() || 'Sense descripció disponible.';
    const cleanLocation = (apiItem.event_location ?? '').trim() || 'Ubicació per confirmar';

    const parsedPrice = Number(apiItem.price_eur);
    const safePrice = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;

    return {
      id: String(apiItem.id ?? ''),
      title: cleanTitle,
      description: cleanDesc,
      category: this.normalizeCategory(apiItem.event_type),
      date: (apiItem.event_date ?? '').trim() || '2026-01-01',
      location: cleanLocation,
      price: safePrice,
      featured: Boolean(apiItem.is_featured)
    };
  }

  static toApi(item: Omit<CookingItem, 'id'>): Omit<CookingItemApi, 'id'> {
    return {
      event_title: item.title.trim(),
      event_desc: item.description.trim(),
      event_type: item.category.toLowerCase(),
      event_date: item.date,
      event_location: item.location.trim(),
      price_eur: item.price,
      is_featured: Boolean(item.featured)
    };
  }

  private static normalizeCategory(rawType: string): CookingCategory {
    const normalized = (rawType ?? '').trim().toLowerCase();
    switch (normalized) {
      case 'cata':
        return 'Cata';
      case 'showcooking':
        return 'Showcooking';
      case 'masterclass':
        return 'Masterclass';
      case 'taller':
      default:
        return 'Taller';
    }
  }
}
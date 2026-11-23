export interface CookingItemApi {
  id?: string | number;
  event_title: string;
  event_desc?: string;
  event_type: string;
  event_date: string;
  event_location?: string;
  price_eur: number | string;
  is_featured?: boolean;
}
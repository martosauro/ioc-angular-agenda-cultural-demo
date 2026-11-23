export type CookingCategory = 'Taller' | 'Cata' | 'Showcooking' | 'Masterclass';

export interface CookingItem {
  id: string;
  title: string;
  description: string;
  category: CookingCategory;
  date: string;
  location: string;
  price: number;
  featured?: boolean;
}
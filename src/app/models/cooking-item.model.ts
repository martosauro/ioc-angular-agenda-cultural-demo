export interface CookingItem {
  id: number;
  title: string;
  description: string;
  category: 'Taller' | 'Cata' | 'Showcooking' | 'Masterclass';
  date: string;
  price: number;
  featured?: boolean;
}
# Models i Adaptador de Dades

## Fitxers
- **Model API**: `src/app/models/cooking-item-api.model.ts` (`CookingItemApi`)
- **Model Intern**: `src/app/models/cooking-item.model.ts` (`CookingItem`)
- **Adaptador**: `src/app/adapters/cooking-item.adapter.ts` (`CookingItemAdapter`)

## Taula de mapatge API -> Model intern

| Camp API (`CookingItemApi`) | Camp Intern (`CookingItem`) | Tipus intern | Normalització aplicada |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `string` | Conversió segura a `string`. |
| `event_title` | `title` | `string` | Neteja d'espais amb `trim()` i valor per defecte si és buit. |
| `event_desc` | `description` | `string` | Neteja d'espais amb `trim()` i text per defecte si falta. |
| `event_type` | `category` | `CookingCategory` | Normalització de majúscules/minúscules (`cata`, `CATA` -> `Cata`). |
| `event_date` | `date` | `string` | Neteja d'espais i data per defecte si falta. |
| `event_location` | `location` | `string` | Neteja d'espais i valor `'Ubicació per confirmar'` si és buit. |
| `price_eur` | `price` | `number` | Conversió numèrica segura (`"35"` -> `35`, mínim `0`). |
| `is_featured` | `featured` | `boolean` | Conversió explícita a booleà (`Boolean(...)`). |
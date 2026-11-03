# IOC Angular Agenda Cultural - Tallers de Cuina i Catas de Vi

Projecte desenvolupat per a l'EAC2 de Programació Avançada amb Angular (Curs 2026-2027 / 1r semestre).

## Informació Tècnica i Versions
- **Node.js**: v24.x LTS
- **Angular CLI**: v22.x
- **Angular**: v22.x (Components standalone)
- **Branca de treball**: `ra2-components`

## Components Creats
1. **CookingListComponent** (`src/app/components/cooking-list/`): Component principal que gestiona el llistat, filtres, comptador i panell de detall.
2. **CookingCardComponent** (`src/app/components/cooking-card/`): Targeta individual per mostrar cada taller o cata mitjançant `@Input` i `@Output`.
3. **CookingBadgeComponent** (`src/app/components/cooking-badge/`): Subcomponent d'etiqueta / categoria amb estils personalitzats.
4. **CookingFilterComponent** (`src/app/components/cooking-filter/`): Formulari de filtres basat en `FormsModule` i `[(ngModel)]` amb validacions.

## Comandes d'Instal·lació i Execució
- Instal·lar dependències: `npm install`
- Executar el projecte en desenvolupament: `ng serve`
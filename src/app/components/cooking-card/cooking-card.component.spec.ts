import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookingCard } from './cooking-card.component';

describe('CookingCard', () => {
  let component: CookingCard;
  let fixture: ComponentFixture<CookingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookingCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CookingCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

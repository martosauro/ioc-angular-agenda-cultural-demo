import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookingBadge } from './cooking-badge.component';

describe('CookingBadge', () => {
  let component: CookingBadge;
  let fixture: ComponentFixture<CookingBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookingBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(CookingBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

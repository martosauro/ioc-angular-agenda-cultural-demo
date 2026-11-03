import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookingFilter } from './cooking-filter.component';

describe('CookingFilter', () => {
  let component: CookingFilter;
  let fixture: ComponentFixture<CookingFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookingFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(CookingFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CookingList } from './cooking-list.component';

describe('CookingList', () => {
  let component: CookingList;
  let fixture: ComponentFixture<CookingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookingList],
    }).compileComponents();

    fixture = TestBed.createComponent(CookingList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

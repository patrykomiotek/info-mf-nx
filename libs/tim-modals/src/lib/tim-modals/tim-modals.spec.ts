import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimModals } from './tim-modals';

describe('TimModals', () => {
  let component: TimModals;
  let fixture: ComponentFixture<TimModals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimModals],
    }).compileComponents();

    fixture = TestBed.createComponent(TimModals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

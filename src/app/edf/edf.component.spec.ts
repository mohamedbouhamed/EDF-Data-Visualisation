import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdfComponent } from './edf.component';

describe('EdfComponent', () => {
  let component: EdfComponent;
  let fixture: ComponentFixture<EdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

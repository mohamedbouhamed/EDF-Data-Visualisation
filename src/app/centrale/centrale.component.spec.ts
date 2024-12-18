import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentraleComponent } from './centrale.component';

describe('HistogramComponent', () => {
  let component: CentraleComponent;
  let fixture: ComponentFixture<CentraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentraleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

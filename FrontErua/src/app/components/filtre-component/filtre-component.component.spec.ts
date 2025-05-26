import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreComponentComponent } from './filtre-component.component';

describe('FiltreComponentComponent', () => {
  let component: FiltreComponentComponent;
  let fixture: ComponentFixture<FiltreComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltreComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltreComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

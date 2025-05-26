import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisteFormComponentComponent } from './artiste-form-component.component';

describe('ArtisteFormComponentComponent', () => {
  let component: ArtisteFormComponentComponent;
  let fixture: ComponentFixture<ArtisteFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtisteFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtisteFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

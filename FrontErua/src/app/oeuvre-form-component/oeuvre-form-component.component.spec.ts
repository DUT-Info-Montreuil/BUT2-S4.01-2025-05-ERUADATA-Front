import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeuvreFormComponentComponent } from './oeuvre-form-component.component';

describe('OeuvreFormComponentComponent', () => {
  let component: OeuvreFormComponentComponent;
  let fixture: ComponentFixture<OeuvreFormComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OeuvreFormComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OeuvreFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

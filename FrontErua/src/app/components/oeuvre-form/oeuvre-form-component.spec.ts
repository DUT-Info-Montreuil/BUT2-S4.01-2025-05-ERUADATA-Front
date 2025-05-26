import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeuvreFormComponent } from './oeuvre-form-component';

describe('OeuvreFormComponent', () => {
  let component: OeuvreFormComponent;
  let fixture: ComponentFixture<OeuvreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OeuvreFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OeuvreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

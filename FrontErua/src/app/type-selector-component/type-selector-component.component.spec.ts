import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeSelectorComponentComponent } from './type-selector-component.component';

describe('TypeSelectorComponentComponent', () => {
  let component: TypeSelectorComponentComponent;
  let fixture: ComponentFixture<TypeSelectorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeSelectorComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TypeSelectorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

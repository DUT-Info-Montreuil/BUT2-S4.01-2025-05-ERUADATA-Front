import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditioncomponentComponent } from './editioncomponent.component';

describe('EditioncomponentComponent', () => {
  let component: EditioncomponentComponent;
  let fixture: ComponentFixture<EditioncomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditioncomponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditioncomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionComponent } from './editioncomponent';

describe('Editioncomponent', () => {
  let component: EditionComponent;
  let fixture: ComponentFixture<EditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

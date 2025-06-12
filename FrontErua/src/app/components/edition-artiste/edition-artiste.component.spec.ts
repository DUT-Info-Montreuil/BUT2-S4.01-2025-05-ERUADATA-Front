import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionArtisteComponent } from './edition-artiste.component';

describe('EditionArtisteComponent', () => {
  let component: EditionArtisteComponent;
  let fixture: ComponentFixture<EditionArtisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionArtisteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditionArtisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

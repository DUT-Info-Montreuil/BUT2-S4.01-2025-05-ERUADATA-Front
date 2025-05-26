import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisteDetailComponentComponent } from './artiste-detail-component.component';

describe('ArtisteDetailComponentComponent', () => {
  let component: ArtisteDetailComponentComponent;
  let fixture: ComponentFixture<ArtisteDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtisteDetailComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtisteDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

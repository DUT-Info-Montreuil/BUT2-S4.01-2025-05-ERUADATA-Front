import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OeuvreDetailComponentComponent } from './oeuvre-detail-component.component';

describe('OeuvreDetailComponentComponent', () => {
  let component: OeuvreDetailComponentComponent;
  let fixture: ComponentFixture<OeuvreDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OeuvreDetailComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OeuvreDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

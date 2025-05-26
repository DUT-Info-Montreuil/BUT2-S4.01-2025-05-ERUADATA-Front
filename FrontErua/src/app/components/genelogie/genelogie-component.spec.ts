import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenelogieComponent } from './genelogie-component';

describe('GenelogieComponent', () => {
  let component: GenelogieComponent;
  let fixture: ComponentFixture<GenelogieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenelogieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenelogieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

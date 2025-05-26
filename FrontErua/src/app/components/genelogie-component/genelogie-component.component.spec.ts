import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenelogieComponentComponent } from './genelogie-component.component';

describe('GenelogieComponentComponent', () => {
  let component: GenelogieComponentComponent;
  let fixture: ComponentFixture<GenelogieComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenelogieComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenelogieComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenealogiePageComponent } from './genealogie-page.component';

describe('GenealogiePageComponent', () => {
  let component: GenealogiePageComponent;
  let fixture: ComponentFixture<GenealogiePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenealogiePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenealogiePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

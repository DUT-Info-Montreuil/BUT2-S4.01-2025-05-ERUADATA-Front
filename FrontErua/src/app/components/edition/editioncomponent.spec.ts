import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editioncomponent } from './editioncomponent';

describe('Editioncomponent', () => {
  let component: Editioncomponent;
  let fixture: ComponentFixture<Editioncomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editioncomponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Editioncomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OeuvreServiceService } from './oeuvre-service.service';

describe('OeuvreServiceService', () => {
  let service: OeuvreServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OeuvreServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

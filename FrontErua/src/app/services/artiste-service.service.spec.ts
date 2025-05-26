import { TestBed } from '@angular/core/testing';

import { ArtisteServiceService } from './artiste-service.service';

describe('ArtisteServiceService', () => {
  let service: ArtisteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtisteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

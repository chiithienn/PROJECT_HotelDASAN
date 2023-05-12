import { TestBed } from '@angular/core/testing';

import { PassersbyService } from './passersby.service';

describe('PassersbyService', () => {
  let service: PassersbyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassersbyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

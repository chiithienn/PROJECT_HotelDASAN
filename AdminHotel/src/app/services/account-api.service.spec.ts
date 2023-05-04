import { TestBed } from '@angular/core/testing';

import { AccountAPIService } from './account-api.service';

describe('AccountAPIService', () => {
  let service: AccountAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

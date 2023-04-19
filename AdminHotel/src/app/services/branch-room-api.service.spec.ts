import { TestBed } from '@angular/core/testing';

import { BranchRoomAPIService } from './branch-room-api.service';

describe('BranchRoomAPIService', () => {
  let service: BranchRoomAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchRoomAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

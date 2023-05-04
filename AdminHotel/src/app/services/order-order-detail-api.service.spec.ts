import { TestBed } from '@angular/core/testing';

import { OrderOrderDetailAPIService } from './order-order-detail-api.service';

describe('OrderOrderDetailAPIService', () => {
  let service: OrderOrderDetailAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderOrderDetailAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

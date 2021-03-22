import { TestBed } from '@angular/core/testing';

import { PurchaseTicketService } from './purchase-ticket.service';

describe('PurchaseTicketService', () => {
  let service: PurchaseTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { StripeChargeService } from './stripe-charge.service';

describe('StripeChargeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StripeChargeService]
    });
  });

  it('should be created', inject([StripeChargeService], (service: StripeChargeService) => {
    expect(service).toBeTruthy();
  }));
});

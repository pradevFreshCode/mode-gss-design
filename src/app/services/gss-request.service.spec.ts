import { TestBed, inject } from '@angular/core/testing';

import { GssRequestService } from './gss-request.service';

describe('GssRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GssRequestService]
    });
  });

  it('should be created', inject([GssRequestService], (service: GssRequestService) => {
    expect(service).toBeTruthy();
  }));
});

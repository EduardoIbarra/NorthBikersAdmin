import { TestBed } from '@angular/core/testing';

import { CheckInsService } from './check-ins.service';

describe('CheckInsService', () => {
  let service: CheckInsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckInsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

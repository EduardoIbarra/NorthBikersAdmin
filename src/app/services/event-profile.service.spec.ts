import { TestBed } from '@angular/core/testing';

import { EventProfileService } from './event-profile.service';

describe('EventProfileService', () => {
  let service: EventProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

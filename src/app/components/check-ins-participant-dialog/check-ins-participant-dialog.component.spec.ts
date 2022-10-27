import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInsParticipantDialogComponent } from './check-ins-participant-dialog.component';

describe('CheckInsParticipantDialogComponent', () => {
  let component: CheckInsParticipantDialogComponent;
  let fixture: ComponentFixture<CheckInsParticipantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInsParticipantDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInsParticipantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventProfileService } from 'src/app/services/event-profile.service';

export interface DialogData {
  participant:{
    id: string,
    position: Int16Array,
    points: Int16Array,
    participant_number: Int16Array,
    name: string,
    email: string,
    title: string,
    checkins: Int16Array,
    challenges: Int16Array
  },
  gender: string,
  category: string,
  route_id: Int16Array
};

@Component({
  selector: 'app-edit-participant-dialog',
  templateUrl: './edit-participant-dialog.component.html',
  styleUrls: ['./edit-participant-dialog.component.scss']
})
export class EditParticipantDialogComponent implements OnInit {
  participantName: any;
  form: FormGroup = new FormGroup({
    current_lat: new FormControl(''),
    current_lng: new FormControl(''),
    points: new FormControl(''),
    participant_number: new FormControl(''),
    category: new FormControl(''),
    gender: new FormControl(''),
    profile_id: new FormControl('')
  });
  route_id: any;
  profileId: any;
  CATEGORIES = [
    {id: 'DUAL_SPORT', title: 'Doble Propósito'},
    {id: 'DIRT', title: 'Terracería'},
    {id: 'STREET', title: 'Calle'},
    ];
  GENDERS = [
      {id: 'MALE', title: 'Hombre'},
      {id: 'FEMALE', title: 'Mujer'},
  ];
  constructor(
    public dialogRef: MatDialogRef<EditParticipantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private eventProfileService: EventProfileService
  ) { 
    console.log(data);
    this.route_id = data.route_id;
    this.profileId = data.participant.id;
    this.participantName = data.participant.name;
    this.form.controls['points'].setValue(data.participant.points);
    this.form.controls['participant_number'].setValue(data.participant.participant_number);
    this.form.controls['category'].setValue(data.category);
    this.form.controls['gender'].setValue(data.gender);    
  }

  ngOnInit(): void {
  }

  saveParticipant() {
    console.log(this.form.value);
    this.form.value.profile_id = this.profileId;
    this.form.value.current_lat = this.form.value.current_lat == "" ? null : this.form.value.current_lat;
    this.form.value.current_lng = this.form.value.current_lng == "" ? null : this.form.value.current_lng;
    this.form.value.gender = this.form.value.gender.toLowerCase();
    this.eventProfileService.updateEventProfile(this.form.value, this.route_id, this.profileId).then(response => {
      this.dialogRef.close();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

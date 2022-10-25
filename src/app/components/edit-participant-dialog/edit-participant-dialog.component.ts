import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  category: string
};

@Component({
  selector: 'app-edit-participant-dialog',
  templateUrl: './edit-participant-dialog.component.html',
  styleUrls: ['./edit-participant-dialog.component.scss']
})
export class EditParticipantDialogComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    current_lat: new FormControl(''),
    current_lng: new FormControl(''),
    points: new FormControl(''),
    participant_number: new FormControl(''),
    category: new FormControl(''),
    gender: new FormControl('')
  });
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 
    console.log(data);
    this.form.controls['name'].setValue(data.participant.name);
    this.form.controls['points'].setValue(data.participant.points);
    this.form.controls['participant_number'].setValue(data.participant.participant_number);
    this.form.controls['category'].setValue(data.category);
    this.form.controls['gender'].setValue(data.gender);
  }

  ngOnInit(): void {
  }

  saveParticipant(form: any) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

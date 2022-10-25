import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, map, Observable, of } from 'rxjs';
import { Moment } from 'moment/moment';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


export interface DialogData {
  profile: {
    category: string,
    challenges: Int16Array,
    checkins: Int16Array,
    email: string,
    gender: string,
    id: string,
    name: string,
    participant_number: Int16Array,
    points: Int16Array,
    position: Int16Array,
    title: string
  },
  checkins: {
    checkpoint_id: Int16Array,
    created_at: string,
    distance: Float32Array,
    id: Int16Array,
    is_valid: boolean,
    lat: Float32Array,
    lng: Float32Array,
    original_lat: Float32Array,
    original_lng: Float32Array,
    picture: string,
    points: Int16Array,
    profile_id: string,
    route_id: Int16Array,
    updated_at: string,
    checkpoints: {
      address: string,
      created_at: string,
      description: string,
      distance_difference: Int16Array,
      icon: string,
      id: Int16Array,
      lat: Float32Array,
      lng: Float32Array,
      name: string,
      order: Int16Array,
      picture: string,
      points: Int16Array,
      route_id: Int16Array,
      terrain: string,
      updated_at: string
    }
  }
};

@Component({
  selector: 'app-check-ins-participant-dialog',
  templateUrl: './check-ins-participant-dialog.component.html',
  styleUrls: ['./check-ins-participant-dialog.component.scss']
})
export class CheckInsParticipantDialogComponent implements OnInit {
  moment = require('moment/moment');
  apiLoaded: Observable<boolean>;
  profile: any;
  checkins: any;
  checkinSelected: any;
  constructor(httpClient: HttpClient,
    public dialogRef: MatDialogRef<CheckInsParticipantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDTMgxBpvPeDBv_0Ncy1nk-MPRtXHRglBM', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
      console.log(data);
    this.profile = data.profile;
    this.checkins = data.checkins;
    this.checkinSelected = this.checkins[0];
   }
  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 24,
      lng: 12
  };
  zoom = 4;
  ngOnInit(): void {
  }

  selectCheckin(checkin_id: any) {
    this.checkinSelected = this.checkins.filter((c: { id: any; }) => { return c.id == checkin_id })[0];
    console.log(this.checkinSelected);
  }

  moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  updateIsValidCheckin() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        is_valid: this.checkinSelected.is_valid,
        points: this.checkinSelected.points,
        id: this.checkinSelected.id
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CheckInsService } from 'src/app/services/check-ins.service';
import { ParticipantsService } from 'src/app/services/participants.service';
import { Routes, RouteService } from 'src/app/services/route.service';
import { CheckInsParticipantDialogComponent } from '../check-ins-participant-dialog/check-ins-participant-dialog.component';
import { EditParticipantDialogComponent } from '../edit-participant-dialog/edit-participant-dialog.component';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  public participants: Array<any> = [];
  public participantsList: Array<any> = [];
  public routes: Routes[] | any;
  public result: any;
  selectedRouteId: any;
  searchForm: FormGroup = new FormGroup({
    searchName: new FormControl(''),
    searchCategory: new FormControl(''),
    searchGender: new FormControl(''),
    searchOrder: new FormControl('')
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

  constructor(private participantsService: ParticipantsService,
    private readonly routeService: RouteService,
    private readonly checkinsService: CheckInsService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.getRoutes();
  }

  getRoutes() {
    this.routeService.getAllRoutes().then(response => {
      this.routes = response.data;
    });
  }

  getParticipants = async (event: any) => {
    this.selectedRouteId = event.value;
    this.getEventProfileDetails(this.selectedRouteId);
  }

  getEventProfileDetails(routeId: any) {
    this.participantsList = [];
    this.participants = [];
    console.log(this.searchForm.value.searchName);
    this.participantsService.getEventProfileWithDetail(routeId).then(async response => {
      this.result = response.data;
      console.log(this.result);
      let checkins = await this.getCheckinsWithCheckpoint(routeId);
      let challenges = await this.getChallengesWithCheckpoint(routeId);
      for(var i = 0; i < this.result.length; i++)
      {
        let category = this.CATEGORIES.filter(c => { return c.id == this.result[i].category })[0];
        let gender = this.GENDERS.filter(g => { return g.id.toLowerCase() == this.result[i].gender })[0];
        let checkinsParticipant = checkins?.filter(c => { return c.profile_id == this.result[i].profile.id });
        let challengesParticipant = challenges?.filter(c => { return c.profile_id == this.result[i].profile.id });
        this.participants.push({
          id: this.result[i].profile.id,
          position: i+1,
          points: this.result[i].points,
          participant_number: this.result[i].participant_number,
          name: this.result[i].profile.name,
          category: category?.title,
          email: this.result[i].profile.email,
          title: this.result[i].route.title,
          gender: gender?.title,
          checkins: checkinsParticipant?.length,
          challenges: challengesParticipant?.length,
          profile: this.result[i].profile,
          category_id: this.result[i].category,
          gender_id: this.result[i].gender
        });
      }
      this.participantsList = this.participants;
    });
  }

  getCheckinsWithCheckpoint = async (routeId: any) => {
    return await this.checkinsService.getCheckinsWithCheckpoints(routeId).then(response => {
      return response.data;
    });
  }

  getChallengesWithCheckpoint = async (routeId: any) => {
    return await this.checkinsService.getChallengesWithCheckpoints(routeId).then(response => {
      return response.data;
    });
  }

  editParticipant(participantId:any): void {
    var participant = this.participants.filter(p => { return p.id == participantId });

    let category = this.CATEGORIES.filter(c => { return c.title == participant[0].category })[0];
    let gender = this.GENDERS.filter(g => { return g.title == participant[0].gender })[0];
    console.log(participant);
    const dialogRef = this.dialog.open(EditParticipantDialogComponent, {
      width: '500px',
      data: {participant: participant[0], gender: gender.id, category: category.id} ,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  showCheckins = async (participantId: any) => {
    var checkins = await this.checkinsService.getAllCheckins(this.selectedRouteId, participantId).then(response => {
      return response.data;
    });
    var profile = this.participantsList.filter(p => { return p.profile.id == participantId });
    console.log(checkins);
    console.log(profile);
    const dialogRef = this.dialog.open(CheckInsParticipantDialogComponent, {
      width: '1300px !important',
      data: { profile: profile[0], checkins: checkins }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEventProfileDetails(this.selectedRouteId);
    });
  }

  filterParticipants(filterBy: any, event: any) {
    this.participantsList = [];
    console.log(this.participants);
    console.log(event.value);
    switch(filterBy) {
      case 'name': this.participantsList = this.participants.filter(p => { 
        if(p.profile.name.toLowerCase().includes(this.searchForm.value.searchName.toLowerCase())) {
            return p;
          }
        });
        break;

      case 'gender': this.participantsList = this.participants.filter(p => {
        return p.gender_id.toLowerCase() == event.value.toLowerCase()
      });
      break;

      case 'category': this.participantsList = this.participants.filter(p => {
        return p.category_id.toLowerCase() == event.value.toLowerCase()
      });
      break;

      case 'order': event.value == 'points' ? this.participantsList = this.participants.sort((a, b) => (a.points > b.points) ? -1 : 1) : this.participantsList = this.participants.sort((a, b) => (a.profile.name < b.profile.name) ? -1 : 1);
      break;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckInsService } from 'src/app/services/check-ins.service';
import { ParticipantsService } from 'src/app/services/participants.service';
import { Routes, RouteService } from 'src/app/services/route.service';
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
    console.log(event.value);
    this.selectedRouteId = event.value;
    console.log(this.selectedRouteId);
    this.participantsService.getEventProfileWithDetail(this.selectedRouteId).then(async response => {
      this.result = response.data;
      console.log(this.result);
      for(var i = 0; i < this.result.length; i++)
      {
        let category = this.CATEGORIES.filter(c => { return c.id == this.result[i].category })[0];
        let gender = this.GENDERS.filter(g => { return g.id.toLowerCase() == this.result[i].gender })[0];
        let checkins = await this.getCheckins(this.selectedRouteId, this.result[i].profile.id);
        let challenges = await this.getChallenges(this.selectedRouteId, this.result[i].profile.id);
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
          checkins: checkins,
          challenges: challenges
        });
      }
      this.participantsList = this.participants;
    });
  }

  getCheckins = async (routeId: any, profileId: any) => {
    return await this.checkinsService.getCheckins(routeId, profileId).then(response => {
      return response.data?.length;
    });
  }

  getChallenges = async (routeId: any, profileId: any) => {
    return await this.checkinsService.getChallenges(routeId, profileId).then(response => {
      return response.data?.length;
    });
  }

  /*editParticipant(participantId:any){
    console.log(participantId);
  }*/

  editParticipant(participantId:any): void {
    var participant = this.participants.filter(p => { return p.id == participantId });
    console.log(participant);
    const dialogRef = this.dialog.open(EditParticipantDialogComponent, {
      width: '500px',
      data: participant,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventConfigurationComponent } from './components/event-configuration/event-configuration.component';
import { ParticipantsComponent } from './components/participants/participants.component';

const routes: Routes = [
  {
    path: 'event-configuration',
    component: EventConfigurationComponent
  },
  {
    path: 'participants',
    component: ParticipantsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

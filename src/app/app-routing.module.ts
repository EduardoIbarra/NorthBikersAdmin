import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventConfigurationComponent } from './components/event-configuration/event-configuration.component';
import { LoginComponent } from './components/login/login.component';
import { ParticipantsComponent } from './components/participants/participants.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'participants',
    pathMatch: 'full'
  },
  {
    path: 'event-configuration',
    component: EventConfigurationComponent
  },
  {
    path: 'participants',
    component: ParticipantsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, ViewChild } from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import {MatSidenav} from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { UtilService } from './services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NorthBikersAdmin';
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  
  session = this.authService.session;
  public user: any = null;
  public logged: boolean = false;

  constructor(private readonly supabase: SupabaseService,
    private readonly authService: AuthService,
    private utilService: UtilService) {
    authService.userLogged.subscribe(logged => {
      this.logged = logged;
      this.setUser();
      console.log('******', this.logged);
    });
  }

  ngOnInit() {
    this.authService.authChanges((_, session) => {
      this.session = session
      this.setUser();
    });
    //this.supabase.authChanges((_, session) => (this.session = session))
  }

  private setUser = () => {
    this.user = this.utilService.getUserFromLocalStorage();
  }

  public logout = () => {
    if (confirm('Seguro que desea cerrar sesión?')) {
      this.user = {};
      window.localStorage.removeItem('nb_user');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('session');
      this.authService.signOut();
    }
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
}

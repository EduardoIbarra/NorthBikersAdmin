import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../../environments/environment";
import { ProfileService, Profile as ProfileInterface } from './profile.service';
import { UtilService } from './util.service';

export interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  @Output() userLogged: EventEmitter<any> = new EventEmitter();
  private user: any;
  
  constructor(
    private router: Router,
    private utilService: UtilService,
    private profileService: ProfileService
  ) { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.user = this.utilService.getUserFromLocalStorage();
  }

  get userFunction() {
    return this.supabase.auth.user();
  }

  get session() {
    return this.supabase.auth.session();
  }

  get profile() {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', this.user?.id)
      .single();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({email, password});
  }

  resetPassword = (email: string) => {
    return this.supabase.auth.api.resetPasswordForEmail(email);
  }

  signIn(email: string, password: string) {
    this.supabase.auth.signIn({email, password}).then((response: any) => {
      if (!response.error) {
        console.log(response);
        const user = response.data.user;
        localStorage.setItem('accept_terms', 'true');
        localStorage.setItem('refresh_token', response?.session?.refresh_token);
        this.profileService.getProfileById(response.data.user.id).then(responseProfile => {
          user.details = responseProfile;
          console.log(user);
          window.localStorage.setItem('nb_user', JSON.stringify(user));
          window.localStorage.setItem('token', response.data.access_token);
          window.localStorage.setItem('session', JSON.stringify(response.data.session));
          console.log(JSON.parse(window.localStorage.getItem('nb_user') || '{}'));
          this.userLogged.emit(true);
          this.router.navigateByUrl('/participants');
        });
      }else{
        const error = response?.error?.message;
        switch (error) {
          case 'Invalid login credentials':
            alert(`Correo o contraseña inválidos. Favor de intentar nuevamente.`);
            break;
          case 'Email not confirmed':
            alert(`Primero debes confirmar tu correo (verifica tu bandeja de entrada).`);
            break;
          default:
            break;
        }
      }
    }).catch(err => {
      console.log(err);
      //this.utilService.presentToast('Ocurrió un error, por favor verifique sus credenciales e inténtelo de nuevo', 'danger');
    });
  }

  signOut() {
    return this.supabase.auth.signOut().then(() => {
      localStorage.setItem('refresh_token', '');
      this.userLogged.emit(false);
      this.router.navigateByUrl('/login');
    });
  }

  refreshToken()  {
    let refreshToken =  localStorage.getItem('refresh_token') || '';
    if(!refreshToken) {
      const supabaseAuth = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      if(supabaseAuth?.currentSession?.refresh_token){
        refreshToken = supabaseAuth?.currentSession?.refresh_token
      }
    }

    return this.supabase.auth.signIn({refreshToken}).then((response) => {
      if(response.error) return;
      localStorage.setItem('refresh_token', response?.session?.refresh_token || '');
      localStorage.setItem('token', response.session?.access_token || '');
      localStorage.setItem('session', JSON.stringify(response.session));
    });
  }

  /*signInWithFacebook = async () => {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(async user => {
      console.log('|||||||||||', user);
      let userCheck = await this.profileService.getProfileByEmail(user.email);
      userCheck = userCheck.data && userCheck.data[0];
      if(userCheck) {
        this.signIn(user.email, user.id);
      } else {
        this.utilService.presentLoading('Enviando confirmación...');
        this.signUp(user.email, user.id).then((signUpResponse: any) => {
          if (signUpResponse.error) {
            const error = signUpResponse.error.message;
            switch(error) {
              case 'Password should be at least 6 characters':
                alert('Error: La contraseña debe estar formada de por lo menos 6 caracteres');
                break;
              default:
                this.utilService.stopLoading();
                break;
            }
            return;
          }
          const profile:ProfileInterface = {
            id: signUpResponse?.user?.id,
            email: user.email,
            name: user.name,
          };
          this.profileService.createProfile(profile).then(res => {
            this.utilService.presentToast('Registrado correctamente con Facebook', 'warning');
            this.signIn(user.email, user.id);
            console.log('||||||', res)
          }, error => { console.log('||||||', error) });
          this.utilService.stopLoading();
        }).catch(err => {
          console.log(err);
          this.utilService.presentToast('Ocurrió un error, por favor verifique sus credenciales e inténtelo de nuevo', 'danger');
          this.utilService.stopLoading();
        });
      }
    }).catch(error => {
      console.log('||||||||||', error);
    });
  }*/

}

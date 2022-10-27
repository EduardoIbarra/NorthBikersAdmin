import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Profile, ProfileService } from 'src/app/services/profile.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public user: any = {};
  public operation = 'login';
  public acceptTerms: boolean = false;
  public credentials = {
    email: '',
    password: '',
    name: '',
    c_password: '',
  };
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    name: new FormControl(''),
    c_password: new FormControl('')
  });
  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    const lastEmail = localStorage.getItem('lastUsedEmail');
    if(lastEmail) this.form.value.email = lastEmail;
  }

  public login = () => {
    console.log('login');
    this.authService.signIn(this.form.value.email, this.form.value.password);
    localStorage.setItem('lastUsedEmail', this.form.value.email)
  }

  public register = () => {
    if (this.form.value.password !== this.form.value.c_password) {
      //this.utilService.presentToast('Las contraseñas ingresadas no coinciden. Por favor verifique', 'warning');
      return;
    }
    this.profileService.getProfileByEmail(this.form.value.email).then(res => {
      console.log(res);
      if (res?.data?.[0]) {
        //this.utilService.presentToast('Error: Está tratando de registrarse con un correo previamente registrado. Favor de ir a la pantalla de Login.', 'error', 'top');
      } else {
        this.doRegister();
      }
    });
    return;
  }

  public doRegister = () => {
    //this.utilService.presentLoading('Enviando confirmación...');
    this.authService.signUp(this.form.value.email, this.form.value.password).then((signUpResponse: any) => {
      if (signUpResponse.error) {
        const error = signUpResponse.error.message;
        switch(error) {
          case 'Password should be at least 6 characters':
            alert('Error: La contraseña debe estar formada de por lo menos 6 caracteres');
            break;
          default:
            //this.utilService.stopLoading();
            break;
        }
        return;
      }
      const profile:Profile = {
        id: signUpResponse?.user?.id,
        email: this.form.value.email,
        name: this.form.value.name,
      };
      this.profileService.updateProfile(profile).then(res => {
        // this.utilService.presentToast('Te hemos enviado un correo de confirmación', 'warning');
        // this.operation = 'confirmation_sent';
        this.login();
      });
      //this.utilService.stopLoading();
    }).catch(err => {
      console.log(err);
      //this.utilService.presentToast('Ocurrió un error, por favor verifique sus credenciales e inténtelo de nuevo', 'danger');
      //this.utilService.stopLoading();
    });
  }

  public resetPassword = () => {
    this.operation = 'password';
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

  public doResetPassword = () => {
    this.authService.resetPassword(this.form.value.email).then(result => {
      if (result.error) {
        const error = result?.error?.message;
        switch(error) {
          case 'User not found':
            //this.utilService.presentToast(`El correo ingresado no existe. Favor de comprobar`);
            break;
          default:
            break;
        }
      } else {
        this.operation = 'login';
        //this.utilService.presentToast(`Hemos enviado un correo para recuperar tu contraseña a ${this.credentials.email}`);
      }
    }).catch(error => {
      //this.utilService.presentToast(`Ocurrió un error: ${JSON.stringify(error)}`);
    });
  }

  public signOut = () => {
    this.authService.signOut();
  }

}

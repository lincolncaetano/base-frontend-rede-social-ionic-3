import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds : CredenciaisDTO = {
    username : "",
    password : ""
  };

  constructor(public navCtrl: NavController,public auth: AuthService) {
  }

  ionViewDidEnter(){
    this.auth.refreshToken()
    .subscribe(response =>{
      this.auth.successfulLogin(response.headers.get("Authorization"));
      this.navCtrl.setRoot('TabsPage');
    },
      error =>{}
    );
  }

  login() {
    this.auth.authentication(this.creds)
    .subscribe(response =>{
      this.auth.successfulLogin(response.headers.get("Authorization"));
      this.navCtrl.setRoot('TabsPage');
    },
      error =>{}
    );
  }

  signup(){
    this.navCtrl.push('SignupPage');
  }

}

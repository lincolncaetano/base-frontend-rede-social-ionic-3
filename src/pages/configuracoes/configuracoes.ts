import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html',
})
export class ConfiguracoesPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthService,
    public app: App
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracoesPage');
  }

  logout(){
    this.auth.logout();
    this.app.getRootNav().setRoot('HomePage');
  }

  openUsuariosBloqueados(){
    this.navCtrl.push('UsuariosBloqueadosPage');
  }

  openEditarPerfil(){
    this.navCtrl.push('EditarPerfilPage');
  }

}

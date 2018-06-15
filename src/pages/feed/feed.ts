import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriasPage');
  }

  goUsuario(){
    this.navCtrl.push('ProfilePage', {usuario_id : '2'});
  }

  newPostagem(){
    //this.navCtrl.push('PostagemPage');
    let profileModal = this.modalCtrl.create('PostagemPage');
    profileModal.present();
  }

  openBuscaUsuario(){
    this.navCtrl.push('UsuariosPage');
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TradutorService } from '../../services/tradutor.service';
import { DenunciaService } from '../../services/domain/denuncia.service';
import { DenunciaDto } from '../../models/denuncia.dto';
import { UsuarioService } from '../../services/domain/usuario.service';
import { StorageService } from '../../services/storage.service';
import { UsuarioDTO } from '../../models/usuario.dto';

@IonicPage()
@Component({
  selector: 'page-denuncia-perfil',
  templateUrl: 'denuncia-perfil.html',
})
export class DenunciaPerfilPage {

  private usuarioLogado: UsuarioDTO;
  private idUsuarioDenunciado;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public tradutor: TradutorService,
    public alertCtrl: AlertController,
    public service: DenunciaService,
    public usuarioService: UsuarioService,
    public storage: StorageService
  ) {
  }

  ionViewDidLoad() {

    this.idUsuarioDenunciado = this.navParams.get('usuarioDenunciado');

    let localUser = this.storage.getLocalUser();
      if (localUser && localUser.username) {
        this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.usuarioLogado = response as UsuarioDTO;
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        });
      }
  }

  goBack() {
    this.navCtrl.pop();
  }

  showConfirm(tipoDenuncia) {

    let confirmar = this.tradutor.retornaMsg('CONFIRMAR');
    let denunciar = this.tradutor.retornaMsg('MSG_DENUNICA_CONFIR');
    let sim = this.tradutor.retornaMsg('SIM');
    let nao = this.tradutor.retornaMsg('NAO');

    let confirm = this.alertCtrl.create({
      title: confirmar,
      message: denunciar,
      buttons: [
        {
          text: nao,
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: sim,
          handler: () => {
            this.denunciar(tipoDenuncia);
          }
        }
      ]
    });
    confirm.present();
  }

  denunciar(tipo){

    let dto : DenunciaDto = {
      idUsuario : this.usuarioLogado.id,
      tipoDenuncia : tipo,
      idUsuarioDenunciado : this.idUsuarioDenunciado
    };
    
    this.service.insert(dto)
    .subscribe( res => {
      this.showAlert();
    }, error =>{})
  }

  showAlert() {

    let title = this.tradutor.retornaMsg('OBRIGADO');
    let subTitle = this.tradutor.retornaMsg('MSG_DENUNICA_OBRIGADO');

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    });
    alert.present();
  }

}

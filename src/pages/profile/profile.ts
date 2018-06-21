import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { UsuarioService } from '../../services/domain/usuario.service';
import { API_CONFIG } from '../../config/api.config';

import { TranslateService } from '@ngx-translate/core';
import { UsuarioBloqueadoService } from '../../services/domain/usuario-bloqueado.service';
import { UsuarioBloqueadoDTO } from '../../models/usuarioBloqueado.dto';
import { UsuarioSeguidoService } from '../../services/domain/usuario-seguido.service';
import { UsuarioSeguidoDTO } from '../../models/usuarioSeguido.dto';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  usuario: UsuarioDTO;
  usuarioParan : UsuarioDTO;
  usuarioLogado : UsuarioDTO;
  cameraOn: boolean = false;
  isSegue: boolean = false;
  perfilAdmin = false;
  currentStyles = {};
  isBloqueado = false;
  picture : string;
  profileImage;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public usuarioBloqService : UsuarioBloqueadoService,
    public usuarioSeguidoService : UsuarioSeguidoService, 
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public camera : Camera,
    public sanitizer : DomSanitizer
  ) {
    this.profileImage = 'assets/imgs/profile.png';
  }

  ionViewDidEnter() {
    this.loadData();
  }

  loadUsuarioParam(usuario_id){
    this.usuarioService.findById(usuario_id)
    .subscribe(response => {
      this.usuario = response as UsuarioDTO;
      this.getImageIfExists();
      this.isSegueTest();
    },
    error => {});
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.usuarioLogado = response as UsuarioDTO;
          let usuario_id = this.navParams.get('usuario_id');
          if(usuario_id){
            this.loadUsuarioParam(usuario_id);
            this.loadBloqueados(usuario_id);
            if(response.id == usuario_id){
              this.perfilAdmin = true;
            }
          }else{
            this.loadUsuarioParam(response.id);
            this.perfilAdmin = true;
          }
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }    
  }

  loadBloqueados(usuario_id){

    this.usuarioBloqService.findBloqueadosPorUsuario(this.usuarioLogado.id)
    .subscribe(response => {
      let lista : UsuarioDTO[] = response;
      for(let item of lista) {
        if(item.id == usuario_id){
          this.isBloqueado = true;
        }
      }
    },
    error => {});
  }

  getImageIfExists() {
    this.usuarioService.getImageFromBucket(this.usuario.id)
    .subscribe(response => {
      this.usuario.imageUrl = `${API_CONFIG.bucketBaseUrlProfile}/cp${this.usuario.id}.jpg`;
      this.blobToDataURL(response).then(dataUrl =>{
        let img : string = dataUrl as string;
        this.profileImage = this.sanitizer.bypassSecurityTrustUrl(img);
      });
      this.currentStyles = {     
        'background-image': 'url('+this.usuario.imageUrl+')'
      };
    },
    error => {
      this.profileImage = 'assets/imgs/profile.png';
    });
  }

  // https://gist.github.com/frumbert/3bf7a68ffa2ba59061bdcfc016add9ee
  blobToDataURL(blob) {
    return new Promise((fulfill, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => fulfill(reader.result);
        reader.readAsDataURL(blob);
    })
  }

  isSegueTest(){
    if(this.usuario.id != this.usuarioLogado.id){
      this.usuarioSeguidoService.isSeguido(this.usuario.id, this.usuarioLogado.id)
      .subscribe(response => {
        this.isSegue = response;
      },
      error => {});
    }
  }

  goConfiguracoes(){
    this.navCtrl.push('ConfiguracoesPage');    
  }

  

  openMaisOpcoes() {

    let bloquer = this.retornaMsg('BLOQUEAR');
    let desbloquer = this.retornaMsg('DESBLOQUEAR');

    let denunciar = this.retornaMsg('DENUNCIAR');
    let cancelar = this.retornaMsg('CANCELAR');

 
    if(this.isBloqueado){
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: desbloquer,
            role: 'destructive',
            handler: () => {
              this.desbloquearUsuario();
            }
          },{
            text: denunciar,
            role: 'destructive',
            handler: () => {
              let usuario = {id : this.usuario.id};
              let postagemModal = this.modalCtrl.create('DenunciaPerfilPage', {usuario: usuario});
              postagemModal.present();
            }
          },{
            text: cancelar,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }else{
      let actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: bloquer,
            role: 'destructive',
            handler: () => {
              this.bloquearUsuario();
            }
          },{
            text: denunciar,
            role: 'destructive',
            handler: () => {
              let postagemModal = this.modalCtrl.create('DenunciaPerfilPage', {usuarioDenunciado: this.usuario.id});
              postagemModal.present();
            }
          },{
            text: cancelar,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  retornaMsg(msg){
    let retorno;
    this.translate.get(msg).subscribe(
      value => {
       retorno =  value;
      }
    )
    return retorno;
  }


  bloquearUsuario(){

    let bloqueado : UsuarioBloqueadoDTO = {usuarioId: this.usuarioLogado.id, usuarioBloqueadoId: this.usuario.id};
    console.log(bloqueado);

    this.usuarioBloqService.insert(bloqueado)
      .subscribe(response => {
        this.isBloqueado = true;
        console.log(response);
      },
      error => {});
  }

  desbloquearUsuario(){
    let bloqueado : UsuarioBloqueadoDTO = {usuarioId: this.usuarioLogado.id, usuarioBloqueadoId: this.usuario.id};
    this.usuarioBloqService.delete(bloqueado)
      .subscribe(response => {
        console.log(response);
      },
      error => {});
  }

  seguirUsuario(){
    let seguido : UsuarioSeguidoDTO = {usuarioId: this.usuarioLogado.id, usuarioSeguidoId: this.usuario.id};
      this.usuarioSeguidoService.insert(seguido)
      .subscribe(response => {
        this.isSegue = true;
        console.log(response);
      },
      error => {});
  }

  excluirSeguir(){
    let seguido : UsuarioSeguidoDTO = {usuarioId: this.usuarioLogado.id, usuarioSeguidoId: this.usuario.id};
    this.usuarioSeguidoService.delete(seguido)
      .subscribe(response => {
        this.isSegue = false;
        console.log(response);
      },
      error => {});
  }

  openListaUsuario(item, opcao){
    this.navCtrl.push('UsuariosSeguidosPage', {idUsuario: item.id, opcao: opcao});
  }

  getCameraPicture(){
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
     // Handle error
    });
  }

  getGalleryPicture() {

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  sendPicture() {
    this.usuarioService.uploadPicture(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.getImageIfExists();
      },
      error => {
      });
  }

  cancel() {
    this.picture = null;
  }

}

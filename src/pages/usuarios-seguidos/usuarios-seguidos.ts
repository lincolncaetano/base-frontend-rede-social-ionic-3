import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioSeguidoDTO } from '../../models/usuarioSeguido.dto';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioSeguidoService } from '../../services/domain/usuario-seguido.service';
import { API_CONFIG } from '../../config/api.config';
import { UsuarioDTO } from '../../models/usuario.dto';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-usuarios-seguidos',
  templateUrl: 'usuarios-seguidos.html',
})
export class UsuariosSeguidosPage {

  listaUsuario : UsuarioDTO[] = [];
  listaUsuarioLogado : UsuarioDTO[] = [];
  idUsuario : string;
  usuarioLogado : UsuarioDTO;
  opcao : string;
  seguidos : boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public usuarioSeguidoService: UsuarioSeguidoService
  ) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          
          this.loadUsuarioLogadoListaSeguindo(response.id);
          this.usuarioLogado = response;

          this.idUsuario = this.navParams.get('idUsuario');
          this.opcao = this.navParams.get('opcao');
          if(this.opcao == 'seguidos'){
            this.seguidos = true;
            this.loadListaSeguindo();
          }else{
            this.seguidos = false;
            this.loadListaSeguidores();
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

  loadUsuarioLogadoListaSeguindo(id) {
    this.usuarioSeguidoService.findListaSeguindo(id)
    .subscribe(response => {
      this.listaUsuarioLogado = response;
    },
    error => {});
  }

  loadListaSeguindo() {
    this.usuarioSeguidoService.findListaSeguindo(this.idUsuario)
    .subscribe(response => {
      this.listaUsuario = response;
      this.loadImageUrls();
    },
    error => {});
  }

  loadListaSeguidores() {
    this.usuarioSeguidoService.findListaSeguidores(this.idUsuario)
    .subscribe(response => {
      this.listaUsuario = response;
      this.loadImageUrls();
    },
    error => {});
  }

  loadImageUrls() {
    for (var i=0; i<this.listaUsuario.length; i++) {
      let item = this.listaUsuario[i];
      this.usuarioService.getImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrlProfile}/cp${item.id}.jpg`;
        },
        error => {});
    }
  }

  openPerfil(usuario){
    this.navCtrl.push('ProfilePage', {usuario_id : usuario.id});
  }

  isSegue(usuario, add){
    let retorno : boolean = false;
    if(usuario && this.usuarioLogado){
      if(usuario.id == this.usuarioLogado.id){
        retorno = false;
        if(add){
          return true;
        }
      }else{
        for(let item of this.listaUsuarioLogado) {
          if(item.id == usuario.id){
            retorno = true;
          }
        }
      }
    }
    return retorno;
  }

  seguirUsuario(usuario){
    let seguido : UsuarioSeguidoDTO = {usuarioId: this.usuarioLogado.id, usuarioSeguidoId: usuario.id};
      this.usuarioSeguidoService.insert(seguido)
      .subscribe(response => {
        this.listaUsuarioLogado.push(usuario);
        console.log(response);
      },
      error => {});
  }

  excluirSeguir(usuario){
    let seguido : UsuarioSeguidoDTO = {usuarioId: this.usuarioLogado.id, usuarioSeguidoId: usuario.id};
    this.usuarioSeguidoService.delete(seguido)
      .subscribe(response => {
        for (var i = 0; i < this.listaUsuarioLogado.length; i++) {
          if(this.listaUsuarioLogado[i].id == usuario.id){
            this.listaUsuarioLogado.splice(i,1);
          }
        }
        console.log(response);
      },
      error => {});
  }

}

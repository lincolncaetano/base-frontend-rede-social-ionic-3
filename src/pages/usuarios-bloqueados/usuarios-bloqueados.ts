import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioDTO } from '../../models/usuario.dto';
import { UsuarioBloqueadoService } from '../../services/domain/usuario-bloqueado.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { StorageService } from '../../services/storage.service';
import { API_CONFIG } from '../../config/api.config';
import { UsuarioBloqueadoDTO } from '../../models/usuarioBloqueado.dto';

@IonicPage()
@Component({
  selector: 'page-usuarios-bloqueados',
  templateUrl: 'usuarios-bloqueados.html',
})
export class UsuariosBloqueadosPage {

  listaUsuario : UsuarioDTO[] = [];
  usuario: UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public service: UsuarioBloqueadoService,
    public usuarioService: UsuarioService,
    public storage: StorageService,
  ) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.usuario = response as UsuarioDTO;
          this.loadBloqueados();
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        });
    }
  }

  loadBloqueados(){
    this.service.findBloqueadosPorUsuario(this.usuario.id)
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
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${item.id}.jpg`;
        },
        error => {});
    }
  }


  desbloquearUsuario(userSelect : UsuarioDTO){
    let bloqueado : UsuarioBloqueadoDTO = {usuarioId: this.usuario.id, usuarioBloqueadoId: userSelect.id};
    this.service.delete(bloqueado)
      .subscribe(response => {
        for (var i = 0; i < this.listaUsuario.length; i++) {
          if(this.listaUsuario[i].id == userSelect.id){
            this.listaUsuario.splice(i,1);
          }
        }
      },
      error => {});
  }

  openPerfil(usuario){
    this.navCtrl.push('ProfilePage', {usuario_id : usuario.id});
  }


}

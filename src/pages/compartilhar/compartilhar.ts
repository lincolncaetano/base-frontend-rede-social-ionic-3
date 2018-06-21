import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioSeguidoService } from '../../services/domain/usuario-seguido.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { StorageService } from '../../services/storage.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-compartilhar',
  templateUrl: 'compartilhar.html',
})
export class CompartilharPage {

  listaUsuario : UsuarioDTO[] = [];
  usuarioLogado : UsuarioDTO;
  searchQuery: string = '';
  items: UsuarioDTO[];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public usuarioSeguidoService: UsuarioSeguidoService
  ) {
  }

  ionViewDidLoad() {
    this.loadAmigos();
  }

  loadAmigos(){
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.loadListaSeguindo(response.id);
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
  
  loadListaSeguindo(id) {
    this.usuarioSeguidoService.findListaSeguindo(id)
    .subscribe(response => {
      this.listaUsuario = response;
      this.items = this.listaUsuario;
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

  goBack() {
    this.navCtrl.pop();
  }

  getItems(ev: any) {
    this.items = this.listaUsuario;
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}

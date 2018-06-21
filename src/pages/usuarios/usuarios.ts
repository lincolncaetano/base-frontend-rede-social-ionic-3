import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioDTO } from '../../models/usuario.dto';
import { UsuarioService } from '../../services/domain/usuario.service';
import { API_CONFIG } from "../../config/api.config";

@IonicPage()
@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
})
export class UsuariosPage {

  searchQuery: string = '';

  items : UsuarioDTO[] = [];
  page : number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public usuarioService: UsuarioService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuariosPage');
  }

  onInput(ev: any) {

    let val = ev.target.value;
    if(val == ''){
      this.items = [];
    }else{
      this.usuarioService.findByUsername(val, this.page, 20)
      .subscribe(response => {
        this.items = response as UsuarioDTO[];
        //this.items = this.items.concat(response['content']);
        let end = this.items.length - 1;
        //loader.dismiss();
        /* console.log(val);
        console.log(this.page);
        console.log(this.items); */
        this.loadImageUrls(end);
      },
      error => {
        //loader.dismiss();
      }); 
    }
  }

  loadImageUrls(end: number) {
    for (var i=0; i<=end; i++) {
      let item = this.items[i];
      this.usuarioService.getImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrlProfile}/cp${item.id}.jpg`;
        },
        error => {});
    }
  }

  goUsuario(usuario_id){
    this.navCtrl.push('ProfilePage', {usuario_id : usuario_id});
  }

}

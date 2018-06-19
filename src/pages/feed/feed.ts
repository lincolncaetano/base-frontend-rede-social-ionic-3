import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PostagemService } from '../../services/domain/postagem.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { PostagemDTO } from '../../models/postagem.dto';
import { CurtidaDTO } from '../../models/curtida.dto';
import { CurtidaService } from '../../services/domain/curtida.service';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  private usuarioLogado : UsuarioDTO;
  private listaPostagem: PostagemDTO[] = [];

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public curtidaService: CurtidaService,
    public service: PostagemService
  ) {
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.usuarioLogado = response as UsuarioDTO;
          this.loadPostagens();
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

  loadPostagens(){
    if(this.usuarioLogado != null){
      this.service.findByUsuarioId(this.usuarioLogado.id)
      .subscribe(response => {
        this.listaPostagem = response;
        this.loadImageUrls();
      },
      error => {});
    }
  }
  
  loadImageUrls() {
    for (var i=0; i<this.listaPostagem.length; i++) {
      let item = this.listaPostagem[i].usuario;
      this.usuarioService.getImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${item.id}.jpg`;
        },
        error => {});
    }
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
  
  openComentarios(postagem: PostagemDTO){
    //this.navCtrl.push('ComentarioPage', {postagem : postagem});
    let profileModal = this.modalCtrl.create('ComentarioPage', {postagem : postagem});
    profileModal.present();
  }

  curtir(postagem){
    let curtida : CurtidaDTO = {
      id:{
        usuario: this.usuarioLogado,
        postagem: {id: postagem.id , usuario : postagem.usuario}
      }
    }
    this.curtidaService.insert(curtida)
      .subscribe(response => {
        postagem.listaCurtidas.push(this.usuarioLogado.id);
      },
      error => {});
  }

  descurtir(postagem){
    this.curtidaService.delete(this.usuarioLogado.id, postagem.id)
      .subscribe(response => {
        postagem.listaCurtidas.pop(this.usuarioLogado.id);
      },
      error => {});
  }

  isCurtida(postagem : PostagemDTO){
    
    let curtiu = false;
    for (let index = 0; index < postagem.listaCurtidas.length; index++) {
      if(this.usuarioLogado.id == postagem.listaCurtidas[index]){
        curtiu = true;
        break;
      }
    }
    return curtiu;
  }
}

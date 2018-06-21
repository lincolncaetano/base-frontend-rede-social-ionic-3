import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { ComentarioDTO } from '../../models/comentario.dto';
import { ComentarioService } from '../../services/domain/comentario.service';
import { PostagemDTO } from '../../models/postagem.dto';
import { API_CONFIG } from '../../config/api.config';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-comentario',
  templateUrl: 'comentario.html',
})
export class ComentarioPage {

  @ViewChild(Content) content: Content;
  
  public usuarioLogado : UsuarioDTO;
  public listaComentarios: ComentarioDTO[];
  public postagem: PostagemDTO;
  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public service: ComentarioService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      msg: ['', [Validators.required, Validators.maxLength(120)]]
    });
  }

  ionViewDidLoad() {
    this.postagem = this.navParams.get('postagem');
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.usuarioLogado = response as UsuarioDTO;
          this.loadComentarios();
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

  loadComentarios(){
    this.service.findByPostagemId(this.postagem.id)
    .subscribe(response =>{
      this.listaComentarios = response;
      this.loadImageUrls();
    },
    error =>{
    });
  }

  pushComentario(){

    let comentario : ComentarioDTO = {
      usuario : this.usuarioLogado,
      postagem : {id: this.postagem.id},
      texto: this.formGroup.get("msg").value
    }

    this.service.insert(comentario)
    .subscribe(response =>{
      this.content.scrollToBottom();
      this.formGroup.reset();
      comentario.id = this.extractId(response.headers.get('location'));
      this.listaComentarios.push(comentario);
      this.loadImageUrls();
    },
    error =>{
    });
    
  }

  private extractId(location : string) : string {
    let position = location.lastIndexOf('/');
    return location.substring(position + 1, location.length);
  }

  isAdmin(comentario){
    if(comentario.usuario.id == this.usuarioLogado.id){
      return true;
    }
    if(this.postagem.usuario.id == this.usuarioLogado.id){
      return true;
    }
    return false;
  }

  loadImageUrls() {
    for (var i=0; i<this.listaComentarios.length; i++) {
      let item = this.listaComentarios[i].usuario;
      this.usuarioService.getImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrlProfile}/cp${item.id}.jpg`;
        },
        error => {});
    }
  }

  excluirComentario(comentario){
    this.service.delete(comentario.id)
    .subscribe(response =>{
      for (let index = 0; index < this.listaComentarios.length; index++) {
        const element = this.listaComentarios[index];
        if(element.id == comentario.id){
          this.listaComentarios.splice(index, 1);
        }
      }
    },
    error =>{
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostagemDTO } from '../../models/postagem.dto';
import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { PostagemService } from '../../services/domain/postagem.service';


@IonicPage()
@Component({
  selector: 'page-postagem',
  templateUrl: 'postagem.html',
})
export class PostagemPage {

  post : PostagemDTO;
  formGroup: FormGroup;
  usuarioLogado: UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public service: PostagemService,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public navParams: NavParams) {

      this.formGroup = this.formBuilder.group({
        pergunta: ['', [Validators.maxLength(120)]],
        privado: [false],
        opcao1: ['1', [Validators.required]],
        opcao2: ['2', [Validators.required]]
      });
  }

  ionViewDidLoad() {
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

  onNovaPostagem(){
    if(this.formGroup.value.privado == true){
      this.navCtrl.push('CompartilharPage', { postagem: this.formGroup.value });
    }else{
      this.post = this.formGroup.value;
      this.post.usuario = this.usuarioLogado;
      this.service.insert(this.post)
        .subscribe(response => {
          this.presentToast("Salvo com Sucesso");
        },
        error => {});
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'middle'
    });
  
    toast.onDidDismiss(() => {
      this.navCtrl.pop();
    });
  
    toast.present();
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostagemDTO } from '../../models/postagem.dto';
import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';


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
    public modalCtrl: ModalController,
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
    }
    this.post = this.formGroup.value;
    console.log(this.post);
  }

}

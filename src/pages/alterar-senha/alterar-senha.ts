import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SenhaDTO } from '../../models/senha.dto';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { StorageService } from '../../services/storage.service';
import { TradutorService } from '../../services/tradutor.service';

@IonicPage()
@Component({
  selector: 'page-alterar-senha',
  templateUrl: 'alterar-senha.html',
})
export class AlterarSenhaPage {

  formGroup: FormGroup;
  senhaDto: SenhaDTO;
  usuario: UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public storage: StorageService,
    public service: UsuarioService,
    public alertCtr : AlertController,
    public tradutor : TradutorService
  ) 
  {
    this.formGroup = this.formBuilder.group({
      senhaAntiga: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      senha: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      confirmacao : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]]
    });
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.service.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.usuario = response as UsuarioDTO;
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

  salvarSenha(){
    this.service.editSenha(this.formGroup.value, this.usuario.id)
    .subscribe(response =>{
        this.showInsertOk();
    },
      error =>{}
    );
  }

  showInsertOk(){
    let alert = this.alertCtr.create({
      title : this.tradutor.retornaMsg("MSG_SUCESSO"),
      message : this.tradutor.retornaMsg("MSG_SUCESSO_EDIT_SENHA"),
      enableBackdropDismiss : false,
      buttons : [
        {
          text : "Ok",
          handler : () =>{
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { StorageService } from '../../services/storage.service';
import { TradutorService } from '../../services/tradutor.service';

@IonicPage()
@Component({
  selector: 'page-editar-perfil',
  templateUrl: 'editar-perfil.html',
})
export class EditarPerfilPage {

  formGroup: FormGroup;
  usuario: UsuarioDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public alertCtr : AlertController,
    private tradutor: TradutorService,
  ) {  
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      sexo : [''],
      nascimento : ['']
    });
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.username) {
      this.usuarioService.findByUsernameUnique(localUser.username)
        .subscribe(response => {
          this.usuario = response as UsuarioDTO;
          console.log(response);
          this.formGroup.setValue({
            nome : response.nome,
            email : response.email,
            sexo: (response.sexo != null) ? response.sexo : '1',
            nascimento: response.nascimento
          });
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

  editarUser(){
    this.usuarioService.edit(this.formGroup.value, this.usuario.id)
    .subscribe( res => {
      this.showInsertOk();
    }, error =>{})
  }

  showInsertOk(){
    let alert = this.alertCtr.create({
      title : this.tradutor.retornaMsg("MSG_SUCESSO"),
      message : this.tradutor.retornaMsg("MSG_SUCESSO_EDIT"),
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

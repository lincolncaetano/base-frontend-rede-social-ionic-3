import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { StorageService } from '../../services/storage.service';

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
    public alertCtr : AlertController
  ) {  
    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      sexo : ['1', [Validators.required]],
      nascimento : ['', [Validators.required]]
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
            sexo: response.sexo,
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
      title : "Sucesso",
      message : "Edição Efetuada com Sucesso",
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

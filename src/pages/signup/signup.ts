import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/domain/usuario.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public usuarioService : UsuarioService,
    public alertCtr : AlertController) {

    this.formGroup = this.formBuilder.group({
      nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
      sexo : ['1', [Validators.required]],
      nascimento : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha : ['123', [Validators.required]],
      username : ['Rua Via', [Validators.required]]    
    });
  }

  ionViewDidLoad() {
  }

  signupUser() {
    this.usuarioService.insert(this.formGroup.value)
    .subscribe( res => {
      this.showInsertOk();
    }, error =>{})
  }

  showInsertOk(){
    let alert = this.alertCtr.create({
      title : "Sucesso",
      message : "Cadastro Efetuado com Sucesso",
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
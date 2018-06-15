import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../services/storage.service';
import { TradutorService } from '../../services/tradutor.service';

@IonicPage()
@Component({
  selector: 'page-idioma',
  templateUrl: 'idioma.html',
})
export class IdiomaPage {

  private formGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private translate: TranslateService,
    public storage : StorageService,
    public alertCtrl: AlertController,
    private tradutor: TradutorService,
  ) {

    this.formGroup = this.formBuilder.group({
      idioma: [this.storage.getLocaIdioma().toString()]
    });
  }

  ionViewDidLoad() {
  }

  onChangeIdioma(){
    console.log(this.formGroup.get('idioma').value);
    this.translate.use(this.formGroup.get('idioma').value);
    this.storage.setIdioma(this.formGroup.get('idioma').value)
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: this.tradutor.retornaMsg("CONFIRMAR"),
      message: this.tradutor.retornaMsg("MSG_EDIT_IDIOMA"),
      buttons: [
        {
          text: this.tradutor.retornaMsg("NAO"),
          handler: () => {
          }
        },
        {
          text: this.tradutor.retornaMsg("SIM"),
          handler: () => {
            this.onChangeIdioma();
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

}

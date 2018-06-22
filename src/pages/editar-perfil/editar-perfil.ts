import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/domain/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dto';
import { StorageService } from '../../services/storage.service';
import { TradutorService } from '../../services/tradutor.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-editar-perfil',
  templateUrl: 'editar-perfil.html',
})
export class EditarPerfilPage {

  formGroup: FormGroup;
  usuario: UsuarioDTO;
  picture : string;
  profileImage;
  cameraOn: boolean = false;
  editPicture : boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public storage: StorageService,
    public usuarioService: UsuarioService,
    public alertCtr : AlertController,
    private tradutor: TradutorService,
    public actionSheetCtrl: ActionSheetController,
    public camera : Camera,
    public sanitizer : DomSanitizer
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
          this.getImageIfExists();
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
      if(this.editPicture){
        this.sendPicture();
      }
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

  presentActionSheet() {

    let tirarFoto = this.tradutor.retornaMsg('TIRA FOTO');
    let tirarBiblioteca = this.tradutor.retornaMsg('USAR BIBLIOTECA');
    let cancelar = this.tradutor.retornaMsg('CANCELAR');


    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: tirarFoto,
          handler: () => {
            this.getCameraPicture();
          }
        },{
          text: tirarBiblioteca,
          handler: () => {
            this.getGalleryPicture();
          }
        },{
          text: cancelar,
          role: 'cancel',
          handler: () => {
            //this.viewCtrl.dismiss();
          }
        }
      ]
    });
    actionSheet.present();
  }

  getCameraPicture(){
    this.cameraOn = true;
    this.editPicture = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      saveToPhotoAlbum : false,
      targetWidth: 300,
      targetHeight: 300
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
     // Handle error
    });
  }

  getGalleryPicture() {
    this.cameraOn = true;
    this.editPicture = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true,
      saveToPhotoAlbum : false,
      targetWidth: 300,
      targetHeight: 300
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  sendPicture() {
    this.usuarioService.uploadPicture(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.getImageIfExists();
      },
      error => {
      });
  }

  cancel() {
    this.picture = null;
  }

  getImageIfExists() {
    this.usuarioService.getImageFromBucket(this.usuario.id)
    .subscribe(response => {
      this.usuario.imageUrl = `${API_CONFIG.bucketBaseUrlProfile}/cp${this.usuario.id}.jpg`;
      this.blobToDataURL(response).then(dataUrl =>{
        let img : string = dataUrl as string;
        this.profileImage = this.sanitizer.bypassSecurityTrustUrl(img);
      });
      //this.currentStyles = {     
        //'background-image': 'url('+this.usuario.imageUrl+')'
      //};
    },
    error => {
      this.profileImage = 'assets/imgs/profile.png';
    });
  }

  // https://gist.github.com/frumbert/3bf7a68ffa2ba59061bdcfc016add9ee
  blobToDataURL(blob) {
    return new Promise((fulfill, reject) => {
        let reader = new FileReader();
        reader.onerror = reject;
        reader.onload = (e) => fulfill(reader.result);
        reader.readAsDataURL(blob);
    })
  }

}

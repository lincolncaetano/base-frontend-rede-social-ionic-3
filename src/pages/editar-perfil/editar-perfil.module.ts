import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarPerfilPage } from './editar-perfil';
import { TranslateModule } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    EditarPerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarPerfilPage),TranslateModule
  ],
  providers:[
    Camera
  ]
})
export class EditarPerfilPageModule {}

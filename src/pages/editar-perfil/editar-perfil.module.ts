import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarPerfilPage } from './editar-perfil';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EditarPerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarPerfilPage),TranslateModule
  ],
})
export class EditarPerfilPageModule {}

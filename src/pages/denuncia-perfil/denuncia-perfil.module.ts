import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DenunciaPerfilPage } from './denuncia-perfil';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DenunciaPerfilPage,
  ],
  imports: [
    IonicPageModule.forChild(DenunciaPerfilPage),TranslateModule
  ],
})
export class DenunciaPerfilPageModule {}

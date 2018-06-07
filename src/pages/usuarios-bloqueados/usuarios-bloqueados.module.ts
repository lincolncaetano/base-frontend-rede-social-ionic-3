import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuariosBloqueadosPage } from './usuarios-bloqueados';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UsuariosBloqueadosPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuariosBloqueadosPage),TranslateModule
  ],
})
export class UsuariosBloqueadosPageModule {}

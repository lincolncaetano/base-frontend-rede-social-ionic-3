import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuariosSeguidosPage } from './usuarios-seguidos';

@NgModule({
  declarations: [
    UsuariosSeguidosPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuariosSeguidosPage),
  ],
})
export class UsuariosSeguidosPageModule {}

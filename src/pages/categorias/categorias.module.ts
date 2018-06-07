import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriasPage } from './categorias';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    CategoriasPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoriasPage),TranslateModule
  ],
})
export class CategoriasPageModule {}

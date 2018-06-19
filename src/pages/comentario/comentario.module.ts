import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComentarioPage } from './comentario';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ComentarioPage,
  ],
  imports: [
    IonicPageModule.forChild(ComentarioPage),TranslateModule
  ],
})
export class ComentarioPageModule {}

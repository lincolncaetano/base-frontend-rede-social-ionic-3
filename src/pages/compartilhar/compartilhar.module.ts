import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompartilharPage } from './compartilhar';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CompartilharPage,
  ],
  imports: [
    IonicPageModule.forChild(CompartilharPage),TranslateModule
  ],
})
export class CompartilharPageModule {}

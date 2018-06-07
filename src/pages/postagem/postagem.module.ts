import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostagemPage } from './postagem';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    PostagemPage,
  ],
  imports: [
    IonicPageModule.forChild(PostagemPage),TranslateModule
  ],
})
export class PostagemPageModule {}

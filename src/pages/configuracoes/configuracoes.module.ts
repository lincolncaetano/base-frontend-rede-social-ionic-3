import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfiguracoesPage } from './configuracoes';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ConfiguracoesPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfiguracoesPage),TranslateModule
  ],
})
export class ConfiguracoesPageModule {}

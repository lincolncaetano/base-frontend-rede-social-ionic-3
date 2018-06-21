import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { TranslateModule } from '@ngx-translate/core'
import { Camera } from '@ionic-native/camera'

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),TranslateModule
  ],
  providers:[
    Camera
  ]
})
export class ProfilePageModule {}

import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { UserProfile } from '../pages/user-profile/user-profile';
import { UserBack } from '../providers/user-back';
import {DetalleService} from '../providers/detalle-service'



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    UserProfile,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    UserProfile,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler},UserBack,DetalleService]
})
export class AppModule { }

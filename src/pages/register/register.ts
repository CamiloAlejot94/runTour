import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserBack } from '../../providers/user-back';

declare var firebase: any;
/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  //-----------------------------------------------------------------
  // Atributos
  //-----------------------------------------------------------------
  /* Name of user*/
  name: string
  /* email of user*/
  email: String
  /* password of user*/
  password: String
  /* active or desactive load animation */
  load: boolean

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,public provider: UserBack) { }

  ionViewDidLoad() {
    console.log('Hello RegisterPage Page');
  
  }

  //-----------------------------------------------------------------
  // RegisterEmail
  //-----------------------------------------------------------------
  RegisterEmail() {
    debugger
    if (this.email == null || this.password == null || this.name == null) {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'No flields can be empty',
        buttons: ['OK']
      });
      alert.present()
    }
    else {
      this.load = true
      
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
        this.load = false
        console.log(user)
        firebase.database().ref('users/' + user.uid).set({
          name: this.name,
          email: this.email,
          
        });
      }).catch((error) => {
        this.load = false
        console.log(error.message)
        let errorMessage = error.message;
        let alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: '' + errorMessage,
          buttons: ['OK']
        });
        alert.present()
      });
      this.provider.name = this.name
    } //cierra el else
  } //cierra el metodo 
} //cierra la clase



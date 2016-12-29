import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserBack } from '../../providers/user-back';
import { HomePage } from '../home/home';
declare var firebase


@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfile {
  //-----------------------------------------------------------------
  // Atributos
  //-----------------------------------------------------------------
  pageHome: any
  name: string = "adam sandler" //Nombre del usuario
  genre = "Genre" //genero del usuario 
  Weight: any //peso del usuario
  height: string // Altura del usuaio
  Bday: string = "birth day" //fecha de nacimiento del usuario 
  uWeigth = "Kg" //unidades de peso 
  uHeigth = "cm"; //unidades de altura

  //-----------------------------------------------------------------
  // Constructor
  //-----------------------------------------------------------------
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public provider: UserBack) {
    this.pageHome = HomePage
  }

  //-----------------------------------------------------------------
  // Metodos
  //-----------------------------------------------------------------
  ionViewDidLoad() {
    let a = <HTMLElement>document.getElementsByClassName('datetime-text')[0]
    a.innerHTML = 'Birth day'
    //metodo para selecionar el genero 
  }
  popGenre() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Selec your genre');

    alert.addInput({
      type: 'radio',
      label: 'Male',
      value: 'Male',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Female',
      value: 'Memale',
      checked: false
    });

    alert.addButton('Cancel')
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.genre = data
      }
    });
    alert.present();
  }
  //metodo para unidades de medida (peso)
  unitWeigth() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Weight unit');

    alert.addInput({
      type: 'radio',
      label: 'kilograms',
      value: 'Kg',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Pounds',
      value: 'Lb',
      checked: false
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data)
        this.uWeigth = data
      }
    });
    alert.present();
  }

  // //metodo para unidades de medida (peso)
  unitHeigth() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Height unit');

    alert.addInput({
      type: 'radio',
      label: 'Centimeters',
      value: 'cm',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Feet',
      value: 'ft',
      checked: false
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data)
        this.uHeigth = data
      }
    });
    alert.present();
  }

  RUN() {
    if (this.genre == "Genre" || this.Weight == null || this.height == null || this.Bday == "birth day") {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'All the fields have to be complete',
        buttons: ['OK']
      });
      alert.present();
     

    }
    else {
      debugger
      if (this.height.toString().indexOf('.') !== -1) {
        let alert = this.alertCtrl.create({
          title: 'Eror',
          subTitle: 'the height can not have dots',
          buttons: ['OK']
        });
        alert.present();
      }
      else {
        firebase.database().ref('users/' + this.provider.UID + '/info/').set({
          genero: this.genre,
          peso: this.Weight,
          uPeso: this.uWeigth,
          altura: this.height,
          uAltura: this.uHeigth,
          FechaNac: this.Bday,
        })
        this.navCtrl.setRoot(HomePage)

      }
    }
  }
}






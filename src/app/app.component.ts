import { Component, NgZone } from '@angular/core'; // NgZone se llama "despertar el escuchador"
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { environment } from './environment'
import { UserProfile } from '../pages/user-profile/user-profile'
import { UserBack } from '../providers/user-back';




declare var firebase

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  //-----------------------------------------------------------------
  // Atributos
  //-----------------------------------------------------------------

  rootPage: any;
  



  //-----------------------------------------------------------------
  // Constructor
  //-----------------------------------------------------------------
  constructor(platform: Platform, public provider: UserBack, private zone: NgZone) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.loadScript('https://www.gstatic.com/firebasejs/3.6.2/firebase.js', () => {
        firebase.initializeApp(environment.config);
        // debugger
        
        this.userState()
      })
    });
  }


  //-----------------------------------------------------------------
  // Metodos
  //-----------------------------------------------------------------



  /**
   * Carga dinamicamente una libreria JS y llama un callback cuando haya temrinado
   * @param {any} filename URL de la libreria que se va ha cargar
   * @param {any} callback metodo que se llama despues de la carga
   * @memberOf MyApp
   */
  loadScript(filename, callback) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.onload = callback;
    fileref.setAttribute("src", filename);
    if (typeof fileref != "undefined") {
      document.getElementsByTagName("head")[0].appendChild(fileref)
    }
  }

  /**
   * method than check if the user is login or logout
   * @memberOf MyApp
   */
  userState() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.provider.UID = user.uid
        firebase.database().ref("user/" + user.uid + "/info").once("value", (snap) => {
          if (snap.val()) {
            this.zone.run(() => {
              this.rootPage = HomePage
            })
          }
          else {
            this.zone.run(() => {
              this.rootPage = UserProfile
            })

          }
        })
      }
      else {
        this.zone.run(() => {
          this.rootPage = LoginPage
        })
      }
    })
  }
}

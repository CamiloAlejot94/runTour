import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { environment } from './environment'

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
  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      this.loadScript('https://www.gstatic.com/firebasejs/3.6.2/firebase.js', () => {
        firebase.initializeApp(environment.config);
        this.rootPage = LoginPage
      })
    });
  }


  //-----------------------------------------------------------------
  // Metodos
  //-----------------------------------------------------------------

  /**
   * Carga dinamicamente una libreria JS y llama un callback cuando halla temrinado
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
}

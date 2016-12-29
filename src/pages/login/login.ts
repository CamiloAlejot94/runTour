import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Facebook } from 'ionic-native';
import { RegisterPage } from '../register/register';
declare var firebase: any;


@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {

	//-----------------------------------------------------------------
	// Atributos
	//-----------------------------------------------------------------
	/* Referencia del HTML*/
	pageRegistrar: any
	/* email of user*/
	email: String
	/* password of user*/
	password: String
	/* active or desactive load animation */
	load: boolean



	//-----------------------------------------------------------------
	// Constructor
	//-----------------------------------------------------------------
	constructor(public navCtrl: NavController, public alertCtrl: AlertController) { 
		this.load = false
		this.pageRegistrar=RegisterPage
	}


	//-----------------------------------------------------------------
	// Metodos
	//-----------------------------------------------------------------

	/**
	 * method for login with email
	 * @memberOf LoginPage
	 */
	signInEmail() {
		// TODO: Verificar data binding de email y pass 
		if (this.email == null || this.password==null) {
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'User and password is necessary',
				buttons: ['OK']
			});
			alert.present()
		}
		else {
			this.load = true
			firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(() =>{
				this.load = false
			},error => {
				this.load = false
				let errorMessage = error.message;
				let alert = this.alertCtrl.create({
					title: 'Error',
					subTitle: '' + errorMessage,
					buttons: ['OK']
				});
				alert.present()
			})
		}
	}

	/**
	 * method for login with Facebook
	 * @memberOf LoginPage
	 */
	signInFacebook() {
		this.load = true
		Facebook.login(['email']).then((_response) => {
			var creds = firebase.auth.FacebookAuthProvider.credential(_response.authResponse.accessToken)
			firebase.auth().signInWithCredential(creds)
		}).then((authData) => {
			this.load = false
		}).catch((error) => {
			this.load = false
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: error,
				buttons: ['OK']
			});
			alert.present();
		});
	}

	/**
	 * method that is call when the page is load 
	 * @memberOf LoginPage
	 */
	ionViewDidLoad() {
		console.log('Hello LoginPage Page');
	}

}

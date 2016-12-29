import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject }    from 'rxjs/Subject';
/*
  Generated class for the UserBack provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserBack {
  UID: any 
  
  

  constructor(public http: Http) {
    console.log('Hello UserBack Provider');
  }

}

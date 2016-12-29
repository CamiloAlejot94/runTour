import { Injectable, Component } from '@angular/core';
import {DetalleService} from './detalle-service';
import 'rxjs/add/operator/map';

/*
  Generated class for the Back provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

declare var firebase: any;
declare var google: any

@Injectable()
export class Back {

  constructor(private detalle: DetalleService) { }

  
  /**
   * Sube una foto a la base de datos del usuario
   * 
   * @param {any} img image64 de la imagen que se va a subir
   * @param {any} id id del usuario
   * @param {any} name nombre de la imagen con el formato 'ejemplo.jpg'
   * @returns Promise con la url de la foto o el error si no se pudo subir 
   * 
   * @memberOf Back
   */
  subirFoto(img, id, name) {
    return new Promise((result, err) => {
      let bold = this.dataURItoBlob(img)
      var storageRef = firebase.storage().ref();
      let time = new Date()
      var uploadTask = storageRef.child('images/' + id + '/' + name).put(bold);
      uploadTask.on('state_changed', (snapshot) => {
      }, (error) => {
        console.log(error)
        err()
        // Handle unsuccessful uploads
      }, () => {
        var downloadURL = uploadTask.snapshot.downloadURL;
        result(downloadURL)
      });
    })

  }

  /**
   * Retorna una lista de los puntos para mostrar en el mapa
   * @returns Promise promesa que se ejecuta cuando carga los puntos
   * @memberOf Back
   */
  cargarPuntos() {
    return new Promise((resolver) => {
      firebase.database().ref('/points').once("value", (snapshot, prevChildKey) => {
        resolver(snapshot.val());
      });
    })
  }

  /**
   * Convierte una imagen de formato image64 a un archivo Blob
   * 
   * @param {any} dataURI archivo con la imagen en fortmato img64
   * @returns imagen en formta Blob
   * 
   * @memberOf Back
   */
  dataURItoBlob(dataURI) {
    var arr = dataURI.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Devuelve los puntos que se encuentran dentro del radio de una posicion dada 
   * 
   * @param {any} parametro 
   * @param {any} distancia radio de busqueda
   * @param {any} map instancia del mapa de google maps api
   * @param {any} position centro del radio de busqueda
   * @returns 
   * 
   * @memberOf Back
   */
  darPuntosRadio(parametro, distancia, map, position) {
    return new Promise(result => {
      this.detalle.getMap(parametro[0].address_components).then(mapas => {
        mapas['lat'] = parametro[0].geometry.location.lat();
        mapas['lng'] = parametro[0].geometry.location.lng();
        mapas['addres'] = parametro[0].formatted_address;
        let distanciaUsuario = distancia / 2;
        this.darPuntosPais(mapas, distanciaUsuario).then(
          (resul: Array<any>) => {
            this.buscarMiniPuntos(map, position, resul.length).then(
              lista => {
                result({
                  puntos: resul,
                  miniPuntos: lista
                })
              }
            )
          }
        )
      })
    })


  }

  darPuntosPais(mapas, distancia) {
    return new Promise(resolve => {
      let lista;
      firebase.database().ref('/points').orderByChild("localitation/Country").equalTo(mapas['Country']).once('value', snapshot => {
        lista = snapshot.val();
        let places = [];
        for (let key in mapas) {
          if (Object.keys(lista).length < 0)
            break;
          for (let place in lista) {
            if (lista[place].localitation[key] === mapas[key]) {
              let dist = this.getDistanceFromLatLonInKm(mapas['lat'], mapas['lng'], lista[place].localitation['lat'], lista[place].localitation['lng']);
              if (dist <= distancia) {
                let temporal = lista[place]
                temporal.localitation['distancia'] = dist;
                places = this.organizar(places, temporal);
              }
              delete lista[place];
            }
          }
        }
        resolve(places);
      });
    })
  }

  
  /**
   * Da la distancia entre dos cordenadas en kilometros
   * 
   * @param {any} lat1 latitud punto 1
   * @param {any} lon1 longitud del punto 1
   * @param {any} lat2 latitud punto 2
   * @param {any} lon2 longitud del punto 2
   * @returns
   * 
   * @memberOf Back
   */
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  
   /**
    * Convierte grados a radianes
    * 
    * @param {any} deg grados que se van a convertir
    * @returns
    * 
    * @memberOf Back
    */
   deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  
  /**
   * Devuelve una lista organizada de puntos segun un punto de referencia
   * 
   * @param {any} lista lista de puntos
   * @param {any} elemento nuevo elemento que se va a indexar en la lista
   * @returns lista organizada con el nuevo elemento
   * 
   * @memberOf Back
   */
  organizar(lista, elemento) {
    if (lista.length < 1) {
      lista.push(elemento);
      return lista;
    }
    else {
      let tamInicial = lista.length;
      for (let i = lista.length - 1; i >= 0; i--) {
        let actual = lista[i];
        if (elemento.localitation['distancia'] > actual.localitation['distancia']) {
          lista.splice(i + 1, 0, elemento);
          break;
        }
      }
      if (tamInicial === lista.length)
        lista.splice(0, 0, elemento);
      return lista;
    }
  }

  
  /**
   * Retorna una lista de minipuntos sacados de la base de datos de google maps api
   * 
   * @param {*} map isntancia del mapa de google maps api
   * @param {*} position centro del radio de busqueda
   * @param {number} tamano cantidad de puntos que se van a guardar
   * @returns lista d eminipuntos
   * 
   * @memberOf Back
   */
  buscarMiniPuntos(map: any, position: any, tamano: number) {
    return new Promise(resolve => {
      let lista = []
      let service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: position,
        radius: 500,
        types: ['store', 'amusement_park', 'aquarium', 'art_gallery', 'bakery', 'bar', 'beauty_salon', 'book_store', 'cafe', 'cemetery', 'church', 'city_hall', 'food', 'museum', 'night_club', 'park', 'place_of_worship', 'restaurant', 'store']
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let place of results) {
            lista.push({
              localitation: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            })
            if ((lista.length + tamano) == 8) {
              break
            }
          }
          resolve(lista)
        }
      });
    })
  }
}

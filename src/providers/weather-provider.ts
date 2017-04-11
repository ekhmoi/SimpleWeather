import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WeatherProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WeatherProvider {
  private OWM_APIID: string = 'c303039ced10b5ed591bdfe9c383764f';
  private OWM_URL: string = 'http://api.openweathermap.org/data/2.5';
  private GM_URL: string = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true';
  constructor(public http: Http) {
    console.log('Hello WeatherProvider Provider');
  }


  public getByCoords(coords, type): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.OWM_URL}/${type}?lat=${coords.latitude}&lon=${coords.longitude}&appid=${this.OWM_APIID}&units=metric`).map(res => res.json()).subscribe(
        (res: Response) => {
          resolve(res);
        },
        (err: Response) => {
          reject(err);
        }
      )
    });
  }

  public getLocationName(coords): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.GM_URL}&latlng=${coords.latitude},${coords.longitude}`).map(res => res.json()).subscribe(
        (res: Response) => {
          // console.log(res);
          resolve(res);
        },
        (err: Response) => {
          resolve(err);
        }
      )
    });
  }
}

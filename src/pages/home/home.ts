import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { WeatherProvider } from '../../providers/weather-provider';
import { OWMForecast, OWMCurrent } from '../../models/owm.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Geolocation]
})
export class HomePage {
  public current : any = {bg: '01d'};
  private weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  public forecasts: any = [{items:[]}];
  public currentForecast: number = 0;

  get foreCastBG(): string {
    return this.current.bg.indexOf('d') > -1 ? '#00b9c9' : '#006598'
  }
  
  get headerColor(): string {
    return this.current.bg.indexOf('d') > -1 ? '#222' : '#e4e4e4';
  }

  constructor(public navCtrl: NavController, private geolocation: Geolocation, private weather: WeatherProvider, private actionSheetCtrl: ActionSheetController) {
    this.current.temperature = '+19°';
    this.current.type = 'sunny';
    this.current.city = '';

    this.getGeolocation();
  }


  getGeolocation() {
    this.geolocation.getCurrentPosition().then(pos => {
        this.weather.getByCoords(pos.coords, 'forecast').then((res: OWMForecast) => this.processForecast(res));
        this.weather.getByCoords(pos.coords, 'weather').then((res: OWMCurrent) => this.processCurrent(res));
        this.weather.getLocationName(pos.coords).then((res: any) => this.processLocation(res));
      }).catch(err => {
        console.log(err);
      });
  }

  private processForecast(res: OWMForecast): void {

    let days = [];
    let currentDay = new Date().getDay();
    res.list.map(forecast => {
      forecast.dt_txt = forecast.dt_txt.split('-').join('/');
      let n = forecast.dt_txt.split(' ')[0];
      let current = days.find(d => d.id === n);
      let hours: any = new Date(forecast.dt_txt).getHours();
      hours = hours < 10 ? '0' + hours : hours;
      hours +=':00';
      
      let item = {
        time: hours,
        temperature: (forecast.main.temp > 0 ? '+' : '') + forecast.main.temp,
        icon: this.getIconName(forecast.weather[0].icon)
      };

      if (typeof current === 'undefined') {
        let d = new Date(forecast.dt_txt).getDay()
        days.push({
          id: n,
          text: d === currentDay ? 'Today' : this.weekDays[d],
          items: [item]
        })
      } else {
        current.items.push(item);
      }
    });
    this.forecasts = days;
    setTimeout(() => {
      this.updateForecastMargin();
    }, 150);
  }

  private processCurrent(res: OWMCurrent): void {
    // this.current.city = `${res.sys.country} - ${res.name}`;
    this.current.temperature = `${res.main.temp > 0 ? '+' + res.main.temp : res.main.temp}°`;
    this.current.type = `${res.weather[0].main}`;
    this.current.bg = res.weather[0].icon;
    this.current.icon = this.getIconName(res.weather[0].icon);
    this.current.wind = res.wind.speed;
    this.current.humidity = res.main.humidity;
    this.current.sunset = new Date(res.sys.sunset * 1000).toString().split(' ')[4];
    this.current.sunrise = new Date(res.sys.sunrise * 1000).toString().split(' ')[4];
  }

  private processLocation(res: any): void {
    let ac = res.results[0].address_components;
    this.current.city = ac[ac.length - 1].long_name + ' - ' + ac[ac.length - 2].long_name
  } 

  private getIconName(iconName: string): string {
    let allIcons = {
      '01d': 'ios-sunny-outline',
      '02d': 'ios-partly-sunny-outline',
      '03d': 'ios-cloud-outline',
      '04d': 'ios-cloud-outline',
      '09d': 'ios-rainy-outline',
      '10d': 'ios-rainy-outline',
      '11d': 'ios-thunderstorm-outline',
      '13d': 'ios-snow-outline',
      '50d': 'ion-thunderstorm-outline',

      '01n': 'ios-moon-outline',
      '02n': 'ios-cloudy-night-outline',
      '03n': 'ios-cloud-outline',
      '04n': 'ios-cloud-outline',
      '09n': 'ios-rainy-outline',
      '10n': 'ios-rainy-outline',
      '11n': 'ios-thunderstorm-outline',
      '13n': 'ios-snow-outline',
      '50n': 'ion-thunderstorm-outline'
    }

    return allIcons[iconName];
  }

  public onClickCurrentForecast(): void {

    console.log('clicked');
    let buttons = [];

    for (let i = 0; i < this.forecasts.length; i++) {
      buttons.push({
        text: this.forecasts[i].text,
        handler: () => {
          this.currentForecast = i;
        }
      })
    }
    buttons.push({
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
    });
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Day to view weather',
      buttons: buttons
    });
    actionSheet.present();
  }

  private updateForecastMargin() {
    let marginTop =  (document.querySelector('ion-scroll.upcoming-details').clientHeight - document.querySelector('ion-scroll.upcoming-details .scroll-zoom-wrapper').clientHeight) / 2;


    let elem = <HTMLElement>document.querySelector('ion-scroll.upcoming-details .scroll-zoom-wrapper');
    elem.style.marginTop = marginTop + 'px';
  }
}

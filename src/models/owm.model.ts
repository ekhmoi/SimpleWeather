
    export interface Main {
        temp: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    }

    export interface Weather {
        id: number;
        main: string;
        description: string;
        icon: string;
    }

    export interface Clouds {
        all: number;
    }

    export interface Wind {
        speed: number;
        deg: number;
    }

    export interface Sys {
        pod: string;
    }

    export interface Rain {
        h: number;
    }

    export interface List {
        dt: number;
        main: Main;
        weather: Weather[];
        clouds: Clouds;
        wind: Wind;
        sys: Sys;
        dt_txt: string;
        rain: Rain;
    }

    export interface Coord {
        lat: number;
        lon: number;
    }

    export interface City {
        id: number;
        name: string;
        coord: Coord;
        country: string;
        population: number;
    }

    export interface OWMForecast {
        cod: string;
        message: number;
        cnt: number;
        list: List[];
        city: City;
    }



    export interface MainCurrent {
        temp: number;
        pressure: number;
        humidity: number;
        temp_min: number;
        temp_max: number;
    }

    export interface SysCurrent {
        type: number;
        id: number;
        message: number;
        country: string;
        sunrise: number;
        sunset: number;
    }

    export interface OWMCurrent {
        coord: Coord;
        weather: Weather[];
        base: string;
        main: MainCurrent;
        visibility: number;
        wind: Wind;
        clouds: Clouds;
        dt: number;
        sys: SysCurrent;
        id: number;
        name: string;
        cod: number;
    }


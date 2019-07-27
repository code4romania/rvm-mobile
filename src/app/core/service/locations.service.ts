import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Provider for locations: counties and cities
 */
@Injectable()
export class LocationsService {

    /**
     * Class constructor
     * @param http Angular Http service injected reference for sending http requests
     */
    constructor(private http: HttpClient) {}

    /**
     * Getter for the list of counties
     * @returns An observable that contains the list of counties from resource files
     */
    public getCountyList(): Observable<any> {
        return this.http.get('/assets/files/counties.json');
    }

    /**
     * Getter for the list of cities
     * @returns An observable that contains the list of cities from resource files
     */
    public getCityList(): Observable<any> {
        return this.http.get('/assets/files/cities.json');
    }

}
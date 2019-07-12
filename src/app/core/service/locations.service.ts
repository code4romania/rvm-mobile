import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LocationsService {

    constructor(private http: HttpClient) {}

    public getCountyList(): Observable<any> {
        return this.http.get('/assets/files/counties.json');
    }

    public getCityList(): Observable<any> {
        return this.http.get('/assets/files/cities.json');
    }

}
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';

/**
 * Reference for local PouchDB Statics Database
 */
const localDB = new PouchDB('statics');

/**
 * PouchDB find plugin added
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Statics Database
 */
const remoteDB = new PouchDB(environment.databaseURL + '/statics');

/**
 * Provider for locations: counties and cities
 */
@Injectable()
export class StaticsService {
    /**
     * Type for city entries
     */
    city_type = 'cities';

    /**
     * Type for county entries
     */
    county_type = 'counties';

    /**
     * Class constructor, sets the synchronization options for CouchDB and PouchDB Statics Database
     */
    constructor() {
        const options = {
            live: true,
            retry: true,
            continuous: true
        };

        localDB.replicate.from(remoteDB, options);
    }

    /**
     * Getter for the list of counties
     * @returns An observable that contains the list of counties from resource files
     */
    public getCountyList(): Observable<any> {
        return from(localDB.allDocs(
            {
                include_docs: true,
                startkey: 'county_romania_',
                endkey: 'county_romania_\ufff0'
            }
        ));
    }

    /**
     * Getter for the list of cities
     * @param countyId The id of the county from which the cities will be selected
     * @returns An observable that contains the list of cities from resource files
     */
    public getCityList(countyId: string): Observable<any> {
        return from(localDB.query('cities/slug',
            {
                startkey: [countyId, null],
                endkey: [countyId, {}]
            }
        ));
    }
}

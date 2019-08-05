import * as PouchDB from 'pouchdb/dist/pouchdb';
import { environment } from '../../../environments/environment';

/**
 * Reference for local PouchDB Volunteers Database
 */
var localVolunteersDB = new PouchDB('volunteers');
/**
 * Reference for server CouchDB Volunteers Database
 */
var remoteVolunteersDB = new PouchDB(environment.databaseURL + '/volunteers');

/**
 * Reference for local PouchDB Courses Database
 */
var localCoursesDB = new PouchDB('courses');
/**
 * Reference for server CouchDB Courses Database
 */
var remoteCoursesDB = new PouchDB(environment.databaseURL + '/courses');

/**
 * Reference for local PouchDB Organisations Database
 */
var localOrganisationsDB = new PouchDB('organisations');
/**
 * Reference for server CouchDB Organisations Database
 */
var remoteOrganisationsDB = new PouchDB(environment.databaseURL + '/organisations');

/**
 * Reference for local PouchDB Allocations Database
 */
var localAllocationsDB = new PouchDB('allocations');
/**
 * Reference for server CouchDB Allocations Database
 */
var remoteAllocationsDB = new PouchDB(environment.databaseURL + '/allocations');

/**
 * Service for database synchronization (local and remote)
 */
export class DatabaseSyncService { 

    /**
     * @ignore
     */
    constructor() { }

    /**
     * Strats database synchronization
     */
    sync() {
        let options = {
            live: true,
            retry: true,
            continuous: true
          };

        localVolunteersDB.sync(remoteVolunteersDB, options);    
        localCoursesDB.sync(remoteCoursesDB, options); 
        localOrganisationsDB.sync(remoteOrganisationsDB, options); 
        localAllocationsDB.sync(remoteAllocationsDB, options); 
    }
}
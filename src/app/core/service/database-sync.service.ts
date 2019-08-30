import * as PouchDB from 'pouchdb/dist/pouchdb';
import { environment } from '../../../environments/environment';
import { forkJoin, of } from 'rxjs';

/**
 * Reference for local PouchDB Volunteers Database
 */
const localVolunteersDB = new PouchDB('volunteers');
/**
 * Reference for server CouchDB Volunteers Database
 */
const remoteVolunteersDB = new PouchDB(environment.databaseURL + '/volunteers');

/**
 * Reference for local PouchDB Courses Database
 */
const localCoursesDB = new PouchDB('courses');
/**
 * Reference for server CouchDB Courses Database
 */
const remoteCoursesDB = new PouchDB(environment.databaseURL + '/courses');

/**
 * Reference for local PouchDB Organisations Database
 */
const localOrganisationsDB = new PouchDB('organisations');
/**
 * Reference for server CouchDB Organisations Database
 */
const remoteOrganisationsDB = new PouchDB(environment.databaseURL + '/organisations');

/**
 * Reference for local PouchDB Allocations Database
 */
const localAllocationsDB = new PouchDB('allocations');
/**
 * Reference for server CouchDB Allocations Database
 */
const remoteAllocationsDB = new PouchDB(environment.databaseURL + '/allocations');

/**
 * Reference for local PouchDB Statics Database
 */
const localStaticsDB = new PouchDB('statics');
/**
 * Reference for server CouchDB Allocations Database
 */
const remoteStaticsDB = new PouchDB(environment.databaseURL + '/statics');

/**
 * Service for database synchronization (local and remote)
 */
export class DatabaseSyncService {

    /**
     * @ignore
     */
    constructor() { }

    /**
     * Starts database synchronization
     */
    sync() {
        const options = {
            live: false,
            retry: true,
            continuous: true
          };

        return forkJoin(
            [
                of(localVolunteersDB.sync(remoteVolunteersDB, options)),
                of(localCoursesDB.sync(remoteCoursesDB, options)),
                of(localOrganisationsDB.sync(remoteOrganisationsDB, options)),
                of(localAllocationsDB.sync(remoteAllocationsDB, options)),
                of(localStaticsDB.sync(remoteStaticsDB, options))
            ]);
    }
}

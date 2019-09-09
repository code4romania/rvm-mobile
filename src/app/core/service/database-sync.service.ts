import * as PouchDB from 'pouchdb/dist/pouchdb';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { from } from 'rxjs/internal/observable/from';

declare const emit;

/**
 * Service for database synchronization (local and remote)
 */
export class DatabaseSyncService {
  /**
   * Reference for local PouchDB Volunteers Database
   */
  localVolunteersDB: any;
  /**
   * Reference for server CouchDB Volunteers Database
   */
  remoteVolunteersDB: any;

  /**
   * Reference for local PouchDB Courses Database
   */
  localCoursesDB: any;
  /**
   * Reference for server CouchDB Courses Database
   */
  remoteCoursesDB: any;

  /**
   * Reference for local PouchDB Organisations Database
   */
  localOrganisationsDB: any;
  /**
   * Reference for server CouchDB Organisations Database
   */
  remoteOrganisationsDB: any;

  /**
   * Reference for local PouchDB Allocations Database
   */
  localAllocationsDB: any;
  /**
   * Reference for server CouchDB Allocations Database
   */
  remoteAllocationsDB: any;

  /**
   * Reference for local PouchDB Statics Database
   */
  localStaticsDB: any;
  /**
   * Reference for server CouchDB Allocations Database
   */
  remoteStaticsDB: any;

    /**
     * @ignore
     */
    constructor() {
      this.localVolunteersDB = new PouchDB('volunteers');
      this.remoteVolunteersDB = new PouchDB(environment.databaseURL + '/volunteers');

      this.localCoursesDB = new PouchDB('courses');
      this.remoteCoursesDB = new PouchDB(environment.databaseURL + '/courses');

      this.localOrganisationsDB = new PouchDB('organisations');
      this.remoteOrganisationsDB = new PouchDB(environment.databaseURL + '/organisations');

      this.localAllocationsDB = new PouchDB('allocations');
      this.remoteAllocationsDB = new PouchDB(environment.databaseURL + '/allocations');

      this.localStaticsDB = new PouchDB('statics');
      this.remoteStaticsDB = new PouchDB(environment.databaseURL + '/statics');
     }

    /**
     * Starts database synchronization
     */
    sync(): Promise<void> {
      return Promise.all(
          [
            this.localStaticsDB.replicate.from(this.remoteStaticsDB),
            this.localVolunteersDB.replicate.from(this.remoteVolunteersDB),
            this.localCoursesDB.replicate.from(this.remoteCoursesDB),
            this.localOrganisationsDB.replicate.from(this.remoteOrganisationsDB),
            this.localAllocationsDB.replicate.from(this.remoteAllocationsDB)
          ]).then(() => {
            return this.localStaticsDB.query('cities/slug', { limit: 0 });
           }).catch(error => console.log(`Error in promises ${error}`));
    }
}

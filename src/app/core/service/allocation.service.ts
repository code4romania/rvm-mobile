import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication';
import { VolunteerService } from './volunteer.service';
import { Allocation } from '../model/allocation.model';
import { Volunteer } from '../model/volunteer.model';
import * as moment from 'moment';

/**
 * Reference for local PouchDB Allocations Database
 */
const localDB = new PouchDB('allocations');

/**
 * PouchDB find plugin added
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Allocations Database
 */
const remoteDB = new PouchDB(environment.databaseURL + '/allocations');

/**
 * Provider for allocations related operations
 */
@Injectable()
export class AllocationService {
  /**
   * Table type
   */
  private type = 'allocations';

  /**
   * Class constructor, sets the synchronization options for CouchDB and PouchDB Allocations Database
   */
  constructor(private authenticationService: AuthenticationService,
              private volunteerService: VolunteerService) {
    const options = {
      live: true,
      retry: true,
      continuous: true
    };

    localDB.sync(remoteDB, options);

    localDB.createIndex({
      index: {fields: ['volunteer._id', 'rescue_officer._id']}
    });
   }

    /**
     *  Creates an allocation entry in the local database and updates volunteer's allocation status
     * @param volunteer Volunteer object
     * @param county County entry from statics database
     * @param city City entry from statics database
     * @param organisation Object value containing the allocated volunteer's organisation
     * Either contains an object with the following properties {id, name, website}, or it's null
     * @returns An Observable with the created object
     */
   createAllocation(volunteer: Volunteer, county: any, city: any, organisation: any) {
    const rescue_officer = this.authenticationService.user;
    const allocation = new Allocation();
    allocation.volunteer = {
      _id: volunteer._id,
      name: volunteer.name
    };
    allocation.rescue_officer = {
      _id: rescue_officer._id,
      name: rescue_officer.name
    };
    allocation.county = {
      _id: county._id,
      name: county.name
    };
    allocation.city = city;
    allocation.created_at = moment().format('Y-MM-DD HH:mm:ss');
    allocation.updated_at = moment().format('Y-MM-DD HH:mm:ss');
    allocation.type = this.type;

    if (organisation) {
        allocation.organisation = {
          _id: organisation._id,
          name: organisation.name,
        };
    }

    return from(localDB.post(allocation))
    .pipe(
        map((response: any) => {
          this.volunteerService.allocateVolunteer(response.id, volunteer._id);
          return response;
        })
      );
   }

   /**
    * Returns an allocation entry by its id
    * @param allocationId The id of the allocation
    */
   public getAllocationById(allocationId: string) {
    return from(localDB.find({
      selector: {
        _id: {$eq: allocationId},
        type: this.type
      },
      limit: 1
    }));
  }
}

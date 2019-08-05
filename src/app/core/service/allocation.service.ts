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

/**
 * Reference for local PouchDB Allocations Database
 */
var localDB = new PouchDB('allocations');

/**
 * PouchDB find plugin added 
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Allocations Database
 */
var remoteDB = new PouchDB(environment.databaseURL + '/allocations');

/**
 * Provider for allocations related operations
 */
@Injectable()
export class AllocationService {

  /**
  * Class constructor, sets the synchronization options for CouchDB and PouchDB Allocations Database
  */
  constructor(private authenticationService: AuthenticationService,
    private volunteerService: VolunteerService) {
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    localDB.sync(remoteDB, options);    

    localDB.createIndex({
      index: {fields: ['volunteer.id', 'rescue_officer.id']}
    });
   }

    /**
   *  Creates an allocation entry in the local database and updates volunteer's allocation status
   * @param volunteer Volunteer object
   * @param county String value containing the county in which the volunteer is allocated
   * @param city String value containing the county in which the volunteer is allocated
   * @param organisation Object value containing the allocated volunteer's organisation 
   * Either contains an object with the following properties {id, name, website}, or it's null
   * @returns An Observable with the created object
   */
   createAllocation(volunteer: Volunteer, county: string, city: string, organisation: any) {
    const rescue_officer = this.authenticationService.user;
    const allocation= new Allocation();
    allocation.volunteer = {
      'id': volunteer._id,
      'name': volunteer.name
    };
    allocation.rescue_officer = {
      'id': rescue_officer._id,
      'name': rescue_officer.name
    };
    allocation.county = county;
    allocation.city = city;
    allocation.created_at = new Date();

    if(organisation) {
        allocation.organisation = {
          'id': organisation.id,
          'name': organisation.name,
          'website': organisation.website
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
}
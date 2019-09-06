import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb/dist/pouchdb';
import * as PouchDBFind from 'pouchdb-find/lib/index';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';
import { AuthenticationService } from '../authentication';
import { Organisation } from '../model/organisation.model';
import * as moment from 'moment';

/**
 * Reference for local PouchDB Organisations Database
 */
const localDB = new PouchDB('organisations');

/**
 * PouchDB find plugin added
 */
PouchDB.plugin(PouchDBFind);

/**
 * Reference for server CouchDB Organisations Database
 */
const remoteDB = new PouchDB(environment.databaseURL + '/organisations');

/**
 * Provider for organisation related operations
 */
@Injectable()
export class OrganisationService {
  /**
   * Table type
   */
  private type = 'organisations';

  /**
   * Class constructor, sets the synchronization options for CouchDB and PouchDB Organisations Database
   * @param authenticationService Injected reference for AuthenticationService
   */
  constructor(private authenticationService: AuthenticationService) {
    const options = {
      live: true,
      retry: true,
      continuous: true
    };

    localDB.sync(remoteDB, options);

    localDB.createIndex({
      index: {fields: ['name', 'slug']}
    });
   }

  /**
   * Getter method for all organisations from the local database
   * @returns An Observable with all organisations
   */
  getOrganisations(): Observable<any> {
    return from(localDB.find({
      selector: {
          type: this.type
      },
      include_docs: true,
      attachments: true
    }));
  }

  /**
   * Finds an organisation by its id in the local database
   * @param organisationId Organisation's id
   * @returns An Observable containing the organisation with that id
   */
  getOrganisationById(organisationId: string): Observable<any> {
    return from(localDB.find({
      selector: {
        _id: {$eq: organisationId},
        type: this.type
      }
    }));
  }

  /**
   * Finds an organisation by its name in the local database
   * @param organisationName The name of the organisation
   * @returns An Observable with all organisation with that name
   */
  getOrganisationByName(organisationName: string): Observable<any> {
    return from(localDB.find({
      selector: {
        name: {$eq: organisationName},
        type: this.type
      }
    }));
  }

  /**
   * Creates an organisation entry in the local database
   * @param name String value containing the new organisation's name
   * @returns An Observable with the created object
   */
  createOrganisation(name: string): Observable<any> {
    const currentUser = this.authenticationService.user;
    const organisation = new Organisation();
    organisation.name = name;
    organisation.slug = this.removeSpecialChars(name);
    organisation.added_by = currentUser._id;
    organisation.created_at = moment().format('Y-MM-DD H:mm:ss');
    organisation.updated_at = moment().format('Y-MM-DD H:mm:ss');
    organisation.type = this.type;
    organisation.status = 'inactiv';

    return from(localDB.post(organisation));
  }

  /**
   * Updates an organisation entry in the local database
   * @param organisation The new organisation entry
   */
  updateOrganisation(organisation: Organisation) {
    localDB.get(organisation._id).then((doc) => {
      doc.name = organisation.name ? organisation.name : doc.name;
      doc.slug = organisation.name ? this.removeSpecialChars(organisation.name) : doc.slug;
      localDB.put(doc);
    });
  }

  /**
   * Deletes an entry by its id from the local database
   * @param organisationId The organisation id
   */
  deleteOrganisationById(organisationId: string) {
    localDB.get(organisationId).then((doc) => {
      return localDB.remove(doc);
    });
  }

   /**
    * Removes diacritics from a string
    * @param text A string with diacritics
    * @returns the new string, without diacritics
    */
  private removeSpecialChars(text: string): string {
    const input   = 'ăâîșț';
    const output  = 'aaist';
    const regex = new RegExp('[' + input + ']', 'g');
    const transl = {};

    const lookup = (m) => transl[m] || m;

    for (let i = 0; i < input.length; i++) {
      transl[input[i]] = output[i];
    }

    return text.replace(regex, lookup);
  }
}

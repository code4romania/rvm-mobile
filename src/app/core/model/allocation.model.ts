/**
 * Model for allocation object
 */
export class Allocation {
    /**
     * Allocation id
     */
    _id: string;

    /**
     * CouchDB parameter; it is automatically set
     */
    _rev: string;

    /**
     * The rescue officer user that created the allocation entry
     */
    rescue_officer: {
      /**
       * User's id
       */
        _id: string;

      /**
       * User's name
       */
        name: string;
    };

    /**
     * The volunteer that is being allocated
     */
    volunteer: {
      /**
       * User's id
       */
        _id: string;

        /**
         * User's name
         */
        name: string;
    };

    /**
     * The county in which the volunteer is being allocated
     */
    county: {
      /**
       * County id
       */
      _id: string;

      /**
       * County name
       */
      name: string;
    };

    /**
     * The city in which the volunteer is being allocated
     */
    city: {
      /**
       * City's id
       */
      _id: string;

      /**
       * City's name
       */
      name: string;
    };

    /**
     * Volunteer's organisation
     */
    organisation: {
      /**
       * Organisation id
       */
        _id: string;

      /**
       * Organisation name
       */
      name: string;
    };

    /**
     * Entry creation date
     */
    created_at: any;

    /**
     * Entry last update date
     */
    updated_at: any;

    /**
     * Entry type, for allocations it's 'allocations'
     */
    type: string;
}

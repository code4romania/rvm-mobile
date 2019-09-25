/**
 * Model for organisation object
 */
export class Organisation {
    /**
     * Organisation id
     */
    _id: string;

    /**
     * CouchDB parameter; it is automatically set
     */
    _rev: string;

    /**
     * Organisation name
     */
    name: string;

    /**
     * Organisation slug, the name without diacritics (Romanian special characters)
     */
    slug: string;

    /**
     * Organisation website url
     */
    website: string;

    /**
     * Organisation contact person object
     */
    contact_person: {
        /**
         * Ngo Admin user id from Users table
         */
        _id: string;

        /**
         * Ngo Admin user name
         */
        name: string;

        /**
         * Ngo Admin email address
         */
        email: string;

        /**
         * Ngo Admin phone number
         */
        phone: string;
    };

    /**
     * Address
     */
    address: string;

    /**
     * Organisation's county, from the statics database
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
     * Organisation's city, from the statics database
     */
    city: {
        /**
         * City id
         */
        _id: string;

        /**
         * City name
         */
        name: string;
    };

    /**
     * Additional comments/details to an organisation entry
     */
    comments: string;

    /**
     * Creation date
     */
    created_at: any;

    /**
     * Date of the last update on the entry
     */
    updated_at: any;

    /**
     * The id of the user that added this entry
     */
    added_by: string;

    /**
     * Database type, in this case 'organisations'
     */
    type: string;

    /**
     * Organisation's status 'activ'/'inactiv', organisations added by the mobile app will always have 'inactiv'
     */
    status: string;

    /**
     * Organisation's cover area, has 'locală'/'națională' value
     */
    cover: string;
}

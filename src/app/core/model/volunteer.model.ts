/**
 * Model for volunteer object
 */
export class Volunteer {
    /**
     * Volunteer's id
     */
    _id: string;

    /**
     * CouchDB parameter; it is automatically set
     */
    _rev: string;

    /**
     * Volunteer's name
     */
    name: string;

    /**
     * Volunteer name without romanian special characters (diacritics)
     */
    slug: string;

    /**
     * Volunteer's ssn code (CNP)
     */
    ssn: string;

    /**
     * Email address
     */
    email: string;

    /**
     * Phone number
     */
    phone: string;

    /**
     * Volunteer's county, from the statics database
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
     * Volunteer's city, from the statics database
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
     * Volunteer's organisation; Can either be an object from the Organisation's database
     * or 'null', in the second case it means that the volunteer has the 'Neafiliat' status
     */
    organisation: {
        /**
         * Organisation's id
         */
       _id: string,

       /**
        * Organisation's name
        */
       name: string,

       /**
        * Organisation's slug (name without diacritics)
        */
       slug: string,

       /**
        * Organisation's website
        */
       website: string
    };

    /**
     * Volunteer's courses: a list of all the course's (from the Courses Database) that belong to the current volunteer
     * If it's empty, than the volunteer has no specialisation
     */
    courses: {
        /**
         * Course name object, from the course_name Database
         */
        course_name: {
            /**
             * Course name id
             */
            _id: string;

            /**
             * Course name
             */
            name: string;

            /**
             * Course name slug
             */
            slug: string;
        }

        /**
         * Course obtained date
         */
        obtained: string;

        /**
         * Course acredited organisation from the acreditors database
         */
        acredited: {
            /**
             * Acreditor organisation id
             */
            _id: string;

            /**
             * Acreditor organisation name
             */
            name: string;
        }
    }[];

    /**
     * Volunteer's allocation status: if the value is null then the volunteer has never been allocated before,
     * otherwise it contains the id of the volunteer's last allocation entry from the Allocations Database
     */
    allocation: string;

    /**
     * Volunteer's additional comments/details
     */
    comments: string;

    /**
     * Volunteer's job name
     */
    job: string;

    /**
     * Volunteer entry creation date
     */
    created_at: any;

    /**
     * The date of the last update
     */
    updated_at: any;

    /**
     * The id of the user (in the mobile case the rescue officer) that added the current volunteer in the database
     */
    added_by: number;

    /**
     * Database type, in this case 'volunteers'
     */
    type: string;
}

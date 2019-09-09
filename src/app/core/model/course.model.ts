/**
 * Model for course object
 */
export class Course {
    /**
     * Course id
     */
    _id: string;

    /**
     * CouchDB parameter; it is automatically set
     */
    _rev: string;

    /**
     * The id of the volunteer to which the course belongs to
     */
    volunteer_id: string;

    /**
     * Course name entry from course_name database
     */
    course_name: {
        /**
         * Course name id
         */
        _id: string;

        /**
         * Course name name
         */
        name: string;
    };

    /**
     * The acreditor for the course from the course_acreditors database
     */
    acredited: {
        /**
         * Acreditor id
         */
        _id: string;

        /**
         * Acreditor name
         */
        name: string;
    };

    /**
     * The date in which the course was obtained
     */
    obtained: Date;

    /**
     * Entry creation date
     */
    created_at: any;

    /**
     * Date of the last update on the entry
     */
    updated_at: any;

    /**
     * The id of the user that added this course to a volunteer
     */
    added_by: string;

    /**
     * Database type, in this case it's 'courses'
     */
    type: string;
}

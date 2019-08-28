/**
 * Model for course object
 */
export class Course {
    _id: string;
    _rev: string;
    volunteer_id: string;
    course_name: {
        id: string;
        name: string;
    };
    acredited: {
        id: string;
        name: string;
    };
    obtained: Date;
    created_at: any;
    updated_at: any;
    added_by: string;
    type: string;

    constructor() {}
}

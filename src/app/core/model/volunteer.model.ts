/**
 * Model for volunteer object
 */
export class Volunteer {
    _id: string;
    _rev: string;
    name: string;
    slug: string;
    ssn: string;
    email: string;
    phone: string;
    county: {
        id: string;
        name: string;
    };
    city: {
        id: string;
        name: string;
    };
    organisation: {
       _id: string,
       name: string,
       slug: string,
       website: string
    };
    courses: {
        id: string;
        course_name_id: string;
        name: string;
        obtained: string;
        acredited: string;
    }[];
    allocation: string;
    comments: string;
    job: string;
    created_at: any;
    updated_at: any;
    added_by: number;
    type: string;

    constructor() {}
}

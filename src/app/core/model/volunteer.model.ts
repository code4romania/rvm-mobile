/**
 * Model for volunteer object
 */
export class Volunteer {
    _id: string;
    organisation: {
       id: string,
       name: string,
       name_slug: string,
       website: string
    };
    name: string;
    name_slug: string;
    ssn: string;
    phone: string;
    email: string;
    county: string;
    city: string;
    address: string;
    comments: string;
    job: string;
    added_by: number;
    created: Date;
    updated: Date;
    allocation: string;
    type: string;

    constructor() {}
}

// TODO edit all models and services

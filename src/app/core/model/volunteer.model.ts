/**
 * Model for volunteer object
 */
export class Volunteer {
    _id: string;
    organisation: {
       id: string,
       name: string,
       website: string
    };
    name: string;
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
    
    constructor() {}
}
export class Volunteer {
    _id: string;
    organisation: {
       id: string,
       name: string,
       website: string
    };
    name: string;
    ssn: string;
    email: string;
    phone: string;
    county: string;
    city: string;
    address: string;
    courses: {
        id: string,
        name: string,
        acredited: string
    }[];
    comments: string;
    job: string;
    added_by: number;
    created: Date;
    updated: Date;

    constructor() {}
}
/**
 * Model for organisation object
 */
export class Organisation {
    _id: string;
    _rev: string;
    name: string;
    slug: string;
    website: string;
    contact_person: string;
    phone: string;
    address: string;
    email: string;
    county: {
        id: string;
        name: string;
    };
    city: {
        id: string;
        name: string;
    };
    comments: string;
    created_at: Date;
    updated_at: Date;
    added_by: string;
    type: string;

    constructor() {}
}

/**
 * Model for allocation object
 */
export class Allocation {
    _id: string;
    rescue_officer: {
        id: string;
        name: string;
    };
    volunteer: {
        id: string;
        name: string;
    };
    county: string;
    city: string;
    organisation: {
        id: string;
        name: string;
        website: string;
    };
    created_at: Date;
}
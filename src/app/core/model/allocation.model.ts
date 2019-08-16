/**
 * Model for allocation object
 */
export class Allocation {
    _id: string;
    _rev: string;
    rescue_officer: {
        id: string;
        name: string;
    };
    volunteer: {
        id: string;
        name: string;
    };
    county: {
      id: string;
      name: string;
    };
    city: {
      id: string;
      name: string;
    };
    organisation: {
        id: string;
        name: string;
    };
    created_at: Date;
    updated_at: Date;
    type: string;
}

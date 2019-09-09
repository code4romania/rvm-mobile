/**
 * Model for allocation object
 */
export class Allocation {
    _id: string;
    _rev: string;
    rescue_officer: {
        _id: string;
        name: string;
    };
    volunteer: {
        _id: string;
        name: string;
    };
    county: {
      _id: string;
      name: string;
    };
    city: {
      _id: string;
      name: string;
    };
    organisation: {
        _id: string;
        name: string;
    };
    created_at: any;
    updated_at: any;
    type: string;
}

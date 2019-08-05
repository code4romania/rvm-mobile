/**
 * Namespace for authentication object
 */
declare namespace Authentication {
  /**
 * Interface for login payload
 */
  export interface LoginPayload {
    username: string;
    password: string;
  }

  /**
 * Interface for user object
 */
  export interface User {
    _id: string;
    name: string;
    phone?: any;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }

  /**
 * Interface for credentials object
 */
  export interface Credentials {
    user: User;
    token: string;
    session: string;
  }
}

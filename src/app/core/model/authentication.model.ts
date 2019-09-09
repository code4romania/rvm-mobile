/**
 * Namespace for authentication object
 */
declare namespace Authentication {
  /**
   * Interface for login payload
   */
  export interface LoginPayload {
    /**
     * Login username/email
     */
    username: string;

    /**
     * Login password
     */
    password: string;
  }

  /**
   * Interface for user object
   */
  export interface User {
    /**
     * User id
     */
    _id: string;

    /**
     * User name
     */
    name: string;

    /**
     * User phone number
     */
    phone?: any;

    /**
     * User email address
     */
    email: string;

    /**
     * User creation date
     */
    createdAt: Date;

    /**
     * Date of the last update to the user's progile
     */
    updatedAt: Date;
  }

  /**
   * Interface for credentials object
   */
  export interface Credentials {
    /**
     * User object
     */
    user: User;

    /**
     * Authentication token
     */
    token: string;
  }
}

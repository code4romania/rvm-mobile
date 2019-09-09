/**
 * Namespace for error object
 */
declare namespace ErrorModel {

  /**
   * Interface for error object
   */
  export interface RootObject {
    /**
     * Error status code
     */
    statusCode: number;

    /**
     * Error
     */
    error: string;

    /**
     * Error message
     */
    message: string;

    /**
     * Error attributes
     */
    attributes?: any;
  }

  /**
   * Interface for error message
   */
  export interface ErrorMessageObject {
    /**
     * Error message id
     */
    id: number;

    /**
     * Error message
     */
    error: string;

    /**
     * Error type
     */
    type: string;

    /**
     * Error url
     */
    serviceUrl: string;
  }
}

/**
 * Namespace for error object
 */
declare namespace ErrorModel {
  /**
   * Interface for error object
   */
  export interface RootObject {
    statusCode: number;
    error: string;
    message: string;
    attributes?: any;
  }

  /**
   * Interface for error message
   */
  export interface ErrorMessageObject {
    id: number;
    error: string;
    type: string;
    serviceUrl: string;
  }
}

import { EventEmitter, Injectable } from '@angular/core';

/**
 * Provider for error messages
 */
@Injectable()
export class ErrorMessageService {
  /**
   * Value that stores the error messages
   */
  private _errors: ErrorModel.ErrorMessageObject[] = [];

  /**
   * Value that emitts events when error messages are changed
   */
  public errors$ = new EventEmitter<ErrorModel.ErrorMessageObject[]>();

  /**
   * @ignore
   */
  constructor() {}

  /**
   * Getter for current error messages
   * @returns current error messages
   */
  get errors(): ErrorModel.ErrorMessageObject[] {
    return this._errors;
  }

  /**
   * Sets the error messages and emits an event
   * @param error Error message
   * @param type Error type
   * @param serviceUrl Service Url that generated the error
   */
  public set(error: string, type: string, serviceUrl: string) {
    this._errors.push({
      id: Date.now(),
      error: error,
      type: type,
      serviceUrl: serviceUrl
    });
    console.log(this._errors);
    this.errors$.emit(this._errors);
  }

  /**
   * Clears the error messages and emits an event
   */
  public clear() {
    this._errors = [];
    this.errors$.emit(this._errors);
  }
}

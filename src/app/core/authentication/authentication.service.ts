import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage.service';

/**
 * Stores the value of credentials' key
 */
const credentialsKey = 'credentials';

/**
 * Provides the basic authentication operations.
 */
@Injectable()
export class AuthenticationService {
  /**
   * Value that stores user's credentials after authentication
   * It's null if the user never authenticates
   */
  private _credentials: Authentication.Credentials | null;

  /**
   * Value which emits events when credentials' values change (on login/logout)
   */
  public credentials$ = new EventEmitter<Authentication.Credentials>();

  /**
   * Class constructor, initializes current credentials value if some credentials are found in local storage
   * @param httpClient Class reference injection, handles http requests sent from this service
   * @param localStorageService Service reference injection, handles operations on local storage
   */
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService) {
    const savedCredentials = this.localStorageService.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Sends a login request to the backend server
   * If it's successful stores the credentials and returns the response body
   * @param payload Login credentials
   * @returns An observable that contains the authentication credentials
   */
  login(
    payload: Authentication.LoginPayload
  ): Observable<Authentication.Credentials> {
    const loginInfo: any = payload;
    loginInfo.device = 'mobile';
    return this.httpClient.post('/login', loginInfo).pipe(
      map((body: any) => {
        this.setCredentials(body);
        return body;
      })
    );
  }

  /**
   * Sends a logout rewuest to the backend server
   * If it's successful clears the credentials information from local storage
   * @returns An observable with a boolean value for success (true)
   */
  logout(): Observable<boolean> {
    return this.httpClient
      .get('/logout')
      .pipe(
        map(() => {
          this.setCredentials();
          return true;
        })
      );
  }

  /**
   * Determines if the current user is authenticated
   * @returns A boolean value with the authenticated status
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Getter method for the credentials object
   * @returns The current credentials
   */
  get credentials(): Authentication.Credentials | null {
    return this._credentials;
  }

  /**
   * Getter method for the authentication token
   * @returns The current token
   */
  get accessToken(): string | null {
    return this.credentials ? this.credentials.token : null;
  }

  /**
   * Saves current user's credentials in local storage
   * @param credentials An object that contains the authentication token and data from server if user performed a login,
   * or nothing if user just performed a log out
   */
  private setCredentials(credentials?: Authentication.Credentials) {
    this._credentials = credentials || null;
    if (credentials) {
      this.localStorageService.setItem(
        credentialsKey,
        JSON.stringify(credentials)
      );
      this.credentials$.emit(this._credentials);
    } else {
      this.localStorageService.clearItem(credentialsKey);
    }
  }

   /**
    * Getter method for current user's profile
    * @returns The current user
    */
  get user(): Authentication.User | null {
    return this.credentials ? this.credentials.user : null;
  }

  /**
   * Sends a request to the backend server for password recovery
   * @param email User's email, it's the one that will receive the password reset link
   * @returns an observable that contains a truth value: successful or not
   */
  public recoverPassword(email: string) {
    return this.httpClient.post('/recoverpassword', {email, device: 'mobile'});
  }

   /**
    * Sends a request to the backend server for password reset
    * @param password User's new password
    * @param token The token from the email send by password recovery to prove that it's the same user
    * @returns an observable that contains a truth value: successful or not
    */
  public resetPassword(password: string, token: string) {
    return this.httpClient.post('/resetpassword', {password, password_confirmation: password, token, device: 'mobile'});
  }
}

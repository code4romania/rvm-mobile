import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../local-storage.service';


const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  private _credentials: Authentication.Credentials | null;
  public credentials$ = new EventEmitter<Authentication.Credentials>();

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    const savedCredentials = this.localStorageService.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  login(
    payload: Authentication.LoginPayload
  ): Observable<Authentication.Credentials> {
    return this.httpClient.post('/login', payload).pipe(
      map((body: Authentication.Credentials) => {
        this.setCredentials(body);
        return body;
      })
    );
  }

  signup(
    payload: Authentication.SignupPayload
  ): Observable<Authentication.User> {
    return this.httpClient.post('/register', payload).pipe(
      map((body: Authentication.User) => {
        return body;
      })
    );
  }

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

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  get credentials(): Authentication.Credentials | null {
    return this._credentials;
  }

  get accessToken(): string | null {
    return this.credentials ? this.credentials.token : null;
  }

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
}

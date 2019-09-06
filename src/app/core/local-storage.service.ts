import { Injectable } from '@angular/core';

/**
 * Creates a cookie entry
 * @param name Cookie name
 * @param value Cookie value
 * @param days Cookie expiration number of days
 */
function createCookie(name: any, value: any, days: any) {
  let date: any, expires;

  if (days) {
    date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

/**
 * Getter for a cookie document by its name
 * @param name Cookie's name
 * @returns cookie document 
 */
function readCookie(name: any) {
  const nameEQ = name + '=',
    ca = document.cookie.split(';');
  let i, c;

  for (i = 0; i < ca.length; i++) {
    c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

/**
 * Sets data into storage
 * @param type Storage type (local or session)
 * @param data Information that needs to be stored
 */
function setData(type: any, data: any) {
  // Convert data into JSON and encode to accommodate for special characters.
  data = encodeURIComponent(JSON.stringify(data));
  // Create cookie.
  if (type === 'session') {
    createCookie(getSessionName(), data, 365);
  } else {
    createCookie('localStorage', data, 365);
  }
}

/**
 * Clears data from storage
 * @param type Storage type (local or session)
 */
function clearData(type: any) {
  if (type === 'session') {
    createCookie(getSessionName(), '', 365);
  } else {
    createCookie('localStorage', '', 365);
  }
}

/**
 * Retrieves all data from storage
 * @param type Storage type (local or session)
 * @returns stored data
 */
function getData(type: any) {
  // Get cookie data.
  const data =
    type === 'session'
      ? readCookie(getSessionName())
      : readCookie('localStorage');
  // If we have some data decode, parse and return it.
  return data ? JSON.parse(decodeURIComponent(data)) : {};
}

/**
 * Getter for session name
 * @returns current session name
 */
function getSessionName() {
  // If there is no name for this window, set one.
  // To ensure it's unquie use the current timestamp.
  if (!window.name) {
    window.name = new Date().getTime().toString();
  }
  return 'sessionStorage' + window.name;
}

/**
 * Provider for storing information in local storage
 */
@Injectable()
export class LocalStorageService {
  /**
   * Handles storing inside local storage
   */
  localStorage: any;

  /**
   * Handles storing inside session storage
   */
  sessionStorage: any;

  /**
   * Checks if localStorage can be used for basic storing operations
   * If not, then a custom storage is created to handle this operations
   */
  constructor() {
    try {
      // Test webstorage existence.
      if (!window.localStorage || !window.sessionStorage) {
        throw new Error('exception');
      }
      // Test webstorage accessibility - Needed for Safari private browsing.
      window.localStorage.setItem('storage_test', '1');
      window.localStorage.removeItem('storage_test');
      this.localStorage = window.localStorage;
    } catch (e) {

      /**
       * Custom storage class
       */
      class CustomStorage {
        type: any;
        data: any;
        length = 0;

        /**
         * 
         * @param type Storage type (local or session)
         */
        constructor(type: any) {
          this.type = type;
          // Init data, if already present
          this.data = getData(type);
        }

        /**
         * Clears the existing storage
         */
        public clear() {
          this.data = {};
          this.length = 0;
          clearData(this.type);
        }

        /**
         * Retrieves an item by its key
         * @param key Item key
         */
        public getItem(key: any) {
          return this.data[key] === undefined ? null : this.data[key];
        }

        /**
         * 
         * @param i key index
         * @returns key index
         */
        public key(i: any) {
          let ctr = 0;
          for (const k in this.data) {
            if (ctr === i) {
              return k;
            } else {
              ctr++;
            }
          }
          return null;
        }

        /**
         * Removes an item from storage by its key
         * @param key Item key
         */
        public removeItem(key: any) {
          delete this.data[key];
          this.length--;
          setData(this.type, this.data);
        }

        /**
         * Adds an item to storage
         * @param key Item's key
         * @param value Item itself
         */
        public setItem(key: any, value: any) {
          this.data[key] = value + ''; // forces the value to a string
          this.length++;
          setData(this.type, this.data);
        }
      }

      const localStorage = new CustomStorage('local');
      const sessionStorage = new CustomStorage('session');
      Object.defineProperty(window, 'localStorage', {
        get: () => localStorage
      });
      this.localStorage = localStorage;
      this.sessionStorage = sessionStorage;
    }
  }

  /**
   * Adds an item to storage
   * @param key Item's key
   * @param value Item itself
   */
  public setItem(key: string, value: any) {
    return this.localStorage.setItem(key, value);
  }

   /**
    * Retrieves an item by its key
    * @param key Item key
    */
  public getItem(key: string) {
    return this.localStorage.getItem(key);
  }

  /**
   * Removes an item from storage by its key
   * @param key Item key
   */
  public clearItem(key: string) {
    return this.localStorage.removeItem(key);
  }

  /**
   * Clears the existing storage
   */
  public clearAll() {
    return this.localStorage.clear();
  }
}

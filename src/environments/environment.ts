// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * Default environment values
 */
export const environment = {
  env: 'DEFAULT',
  production: false,
  serverBaseUrl: 'https://rvm-api.lxhost.ro',
  serverUrl: 'https://rvm-api.lxhost.ro/api',
  databaseURL: 'http://rvm.lxhost.ro:5984'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

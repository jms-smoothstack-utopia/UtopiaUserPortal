// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { NgxLoggerLevel } from 'ngx-logger';

const hostUrl = 'http://localhost:8080';

export const environment = {
  production: false,
  logLevel: NgxLoggerLevel.DEBUG,
  mapbox: {
    accessToken:
      'pk.eyJ1Ijoiam9yZGFuZGl2aW5hIiwiYSI6ImNrbWYyYzM4bDA4Mzgyb3FocW9xeWp0bzIifQ.VV2Rsag8L9Yohjc5eqlQkg',
  },
  authEndpoint: `${hostUrl}/login`,
  accountsEndpoint: `${hostUrl}/accounts`,
  airportsEndpoint: `${hostUrl}/airports`,
  flightsEndpoint: `${hostUrl}/flights`,
  servicingAreaEndpoint: `${hostUrl}/servicing-area`,
  hostUrl: hostUrl,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

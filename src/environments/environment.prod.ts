import { NgxLoggerLevel } from 'ngx-logger';

const hostUrl = 'https://services.utopia-air.click';

export const environment = {
  production: true,
  logLevel: NgxLoggerLevel.ERROR,
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

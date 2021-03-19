import { NgxLoggerLevel } from "ngx-logger";

const hostUrl = 'https://services.utopia-air.click';

export const environment = {
  production: true,
  logLevel: NgxLoggerLevel.DEBUG,
  authEndpoint: `${hostUrl}/login`,
  accountsEndpoint: `${hostUrl}/accounts`,
  airportsEndpoint: `${hostUrl}/airports`,
  flightsEndpoint: `${hostUrl}/flights`,
  servicingAreaEndpoint : `${hostUrl}/servicing-area`,
  hostUrl: hostUrl,
};

import { Address } from './address';

/*
    UUIDs aren't strictly strings. However, since an ID's main purpose in the frontend
    is to identify the user for things like viewing their profile, and it's not meant
    to be user-mutable, creating a custom TS type for operating on them seems unnecessary.
*/

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  addresses: Address[];
  loyaltyPoints: number;
  phoneNumber: string;
  addrLine1: string;
  addrLine2: string;
  city: string;
  state: string;
  zipcode: string;
  ticketEmails: boolean;
  flightEmails: boolean;
}

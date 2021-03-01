import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { environment } from '../../../environments/environment';

export interface CustomerAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  addresses: CustomerAddress[];
  phoneNumber: string;
  loyaltyPoints: number;
}

export interface CustomerAddress {
  cardinality: number;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface CreateCustomerAccountDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addrLine1: string;
  addrLine2?: string;
  city: string;
  state: string;
  zipcode: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  readonly URL = environment.hostUrl + '/customers';

  constructor(private http: HttpClient, private log: NGXLogger) {}

  createAccount(createAccountDto: CreateCustomerAccountDto) {
    this.log.info('POST new account.');
    return this.http.post<CustomerAccount>(this.URL, createAccountDto);
  }
}

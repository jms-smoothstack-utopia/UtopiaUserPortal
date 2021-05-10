import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { PaymentMethod } from 'src/app/paymentMethod';
import { PaymentMethodDto } from 'src/app/paymentMethodDto'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private urlRoot = environment.hostUrl + '/customers';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient, private log: NGXLogger) {}

  //GET all payment methods for a specified customer
  getAllPaymentMethodsForCustomer(customerId: string): Observable<PaymentMethod[]> {
    const url = `${this.urlRoot}/${customerId}/payment-method/all`;
    return this.http.get<PaymentMethod[]>(url);
  }

  //GET a payment method by ID for a specified customer
  getPaymentMethodById(customerId: string, paymentMethodId: number): Observable<PaymentMethod> {
    const url = `${this.urlRoot}/${customerId}/payment-method/${paymentMethodId}`;
    return this.http.get<PaymentMethod>(url);
  }

  //POST add a payment method to the customer
  addPaymentMethod(customerId: string, dto: PaymentMethodDto) {
    const url = `${this.urlRoot}/${customerId}/payment-method`;
    return this.http.post(url, dto, this.httpOptions);
  }

  //DELETE remove a customer's payment method
  removePaymentMethod(customerId: string, paymentMethodId: number) {
    const url = `${this.urlRoot}/${customerId}/payment-method/${paymentMethodId}`;
    return this.http.delete<PaymentMethod>(url, this.httpOptions);
  }
}

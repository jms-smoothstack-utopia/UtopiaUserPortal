import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  post(url: string, object: any) {
    return this.http.post(url, object);
  }

  get(url: string) {
    return this.http.get(url);
  }
}

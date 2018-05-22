import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable()
export class StripeChargeService {

  constructor(private http: HttpClient) { }

  chargePostRequest(cost: number, currency: string, description: string, tokenid: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + environment.stripe_sk_key)
      .set('content-type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('amount', cost.toString().split('.').join(''));
    body.set('currency', currency);
    body.set('description', description);
    body.set('source', tokenid);

    return this.http.post<any>(environment.stripe_api_url, body.toString(), { headers: headers });
  }
}

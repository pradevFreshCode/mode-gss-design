import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Headers, RequestOptions, ResponseContentType} from '@angular/http';

import {environment} from '../../environments/environment';
import {RatesRequest} from '../models/rates-request';
import {ShipmentsRequest} from '../models/shipments-request';
import {PickupRequestModel} from '../models/pickup-request.model';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

const httpOptions = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('access_key', '5AA873DB0D4E821883CBB7A5FE17DC496534CCABEA89484264')
};

@Injectable()
export class GssRequestService {
  api_rate = environment.api_url + 'rates';
  api_shipments = environment.api_url + 'shipments';
  api_label = environment.api_url + 'labels?format=label_pdf&connote=';
  bookpickup_url = 'https://ship.gosweetspot.com/bookpickup';

  constructor(private http: HttpClient) {
  }

  getAvails(ratesRequest: RatesRequest): Observable<any> {
    // return of ();
    return this.http.post<any>(this.api_rate, JSON.stringify(ratesRequest), httpOptions);
  }

  postShipments(shipmentsRequest: ShipmentsRequest): Observable<any> {
    return this.http.post<any>(this.api_shipments, JSON.stringify(shipmentsRequest), httpOptions);
  }

  downloadLabel(connote: string): Observable<any> {

    return this.http.get(this.api_label + connote, httpOptions);
    /*
      {responseType: 'blob',
       headers: {'content-type': 'application/json',
                 'access_key': '5AA873DB0D4E821883CBB7A5FE17DC496534CCABEA89484264' }});
                 */
  }

  pickupShipment(pickupRequest: PickupRequestModel): Observable<any> {
    if (!pickupRequest.SiteId || !pickupRequest) {
      return new ErrorObservable('required');
    }

    // return new EmptyObservable();
    return this.http.post<any>(this._getFullBookPickupUrl(pickupRequest), JSON.stringify(pickupRequest), httpOptions);
  }

  private _getFullBookPickupUrl(pickupRequest: PickupRequestModel) {
    return `${this.bookpickup_url}/${pickupRequest.SiteId}-${pickupRequest.ConnoteConsignmentNumber}`;
  }
}

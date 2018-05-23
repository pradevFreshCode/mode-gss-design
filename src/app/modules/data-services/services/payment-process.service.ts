import {Injectable} from '@angular/core';
import {ApiClientService} from './api-client.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {ShipmentsRequest} from '../../../models/shipments-request';
import {ProcessedShipmentModel} from '../../../models/processed-shipment.model';
import {PickupRequestModel} from '../../../models/pickup-request.model';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

@Injectable()
export class PaymentProcessService extends ApiClientService {
  private _apiBasePath: string = 'booking_process';

  constructor(http: HttpClient,
              localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  postShipments(requestData: ShipmentsRequest): Observable<ProcessedShipmentModel> {
    return this.post(`${this._apiBasePath}/post_shipments`, requestData).pipe(map(response => {
      return ProcessedShipmentModel.FromJson(this.handleResponse(response));
    }));
  }

  pickupShipment(pickupRequest: PickupRequestModel): Observable<any> {
    if (!pickupRequest.SiteId || !pickupRequest) {
      return new ErrorObservable('required');
    }

    return this.post(`${this._apiBasePath}/pickup`, pickupRequest).pipe(map(response => {
      return this.handleResponse(response);
    }));
  }
}

import {Component, OnInit, Input} from '@angular/core';
import {RatesRequest} from '../rates-request';
import {PickupRequestConnoteModel, PickupRequestModel} from '../models/pickup-request.model';
import {GssRequestService} from '../gss-request.service';

@Component({
  selector: 'app-pickup-form',
  templateUrl: './pickup-form.component.html',
  styleUrls: ['./pickup-form.component.css']
})
export class PickupFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Input() pickupRequestModel: PickupRequestModel;

  timeList: number[] = [];

  isPackageReady = false;

  constructor(private _gssRequestService: GssRequestService) {
    for (let i = 8; i <= 19; i++) {
      this.timeList.push(i);
    }
  }

  ngOnInit() {}

  processPickup() {
    this._gssRequestService.pickupShipment(this.pickupRequestModel).subscribe(resp => {
        console.log('shipment processed');
        console.log('resp', resp);
      }, err => {
        console.log('error occured when pick up shipment');
      }
    );
  }
}

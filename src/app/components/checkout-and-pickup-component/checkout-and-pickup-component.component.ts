import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProcessedShipmentModel} from '../../models/processed-shipment.model';
import {RatesRequest} from '../../models/rates-request';
import {Available} from '../../models/available';
import {PickupRequestModel} from '../../models/pickup-request.model';

@Component({
  selector: 'app-checkout-and-pickup-component',
  templateUrl: './checkout-and-pickup-component.component.html'
})
export class CheckoutAndPickupComponentComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Input() availToGo: Available;

  @Output() pickupProcessed = new EventEmitter<any>();

  checkoutResult: ProcessedShipmentModel;

  pickupRequest: PickupRequestModel;

  constructor() { }

  ngOnInit() {
  }

  onCheckoutDone(checkoutResult: any) {
    if (!checkoutResult) {
      // alert('error occurred.');
    } else {
      this.checkoutResult = checkoutResult;
    }
  }

  onPickupProcessed(event) {
    this.pickupProcessed.emit(event);
  }
}

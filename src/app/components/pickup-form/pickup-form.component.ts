import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {RatesRequest} from '../../models/rates-request';
import {PickupRequestModel} from '../../models/pickup-request.model';
import {GssRequestService} from '../../services/gss-request.service';
import {PaymentProcessService} from '../../modules/data-services/services/payment-process.service';

@Component({
  selector: 'app-pickup-form',
  templateUrl: './pickup-form.component.html',
  styleUrls: ['./pickup-form.component.css']
})
export class PickupFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Input() pickupRequestModel: PickupRequestModel;

  @Output() pickupProcessed = new EventEmitter<any>();

  timeList: number[] = [];

  isPackageReady: boolean = false;
  isPickupProcessing: boolean = false;
  pickupProcessingError: string;

  constructor(private _gssRequestService: GssRequestService, private _paymentProcessSewrvice: PaymentProcessService) {
    for (let i = 8; i <= 19; i++) {
      this.timeList.push(i);
    }
  }

  ngOnInit() {
    // uncomment to test using fake data
    // this.pickupRequestModel = new PickupRequestModel(6215943, 'AIG00012137', 4180, 10, '');
  }

  processPickup() {
    this.isPickupProcessing = true;
    this.pickupProcessingError = null;
    this._paymentProcessSewrvice.pickupShipment(this.pickupRequestModel).subscribe(resp => {
        this.isPickupProcessing = false;
        this.pickupProcessed.emit(resp);
        console.log('resp', resp);
      }, err => {
        console.log('error occured when pick up shipment', err);
        this.pickupProcessingError = err;
        this.isPickupProcessing = false;
      }
    );
  }
}

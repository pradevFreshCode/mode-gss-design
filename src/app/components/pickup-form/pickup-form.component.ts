import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {PickupRequestModel} from '../../models/pickup-request.model';
import {GssRequestService} from '../../services/gss-request.service';
import {PaymentProcessService} from '../../modules/data-services/services/payment-process.service';
import {BlobWithNameModel} from '../../models/blob-with-name.model';
import {saveAs} from 'file-saver';
import {ProcessedShipmentModel} from '../../models/processed-shipment.model';

@Component({
  selector: 'app-pickup-form',
  templateUrl: './pickup-form.component.html',
  styleUrls: ['./pickup-form.component.css']
})
export class PickupFormComponent implements OnChanges {
  @Input() pickupRequestModel: PickupRequestModel;
  @Input() checkoutResult: ProcessedShipmentModel;

  @Output() pickupProcessed = new EventEmitter<any>();

  timeList: number[] = [];

  isPackageReady: boolean = false;
  isPickupProcessing: boolean = false;
  pickupProcessingError: string;
  currentShipmentHasConsignments: boolean = false;
  pdfFormattingProcessing: boolean = false;
  blobsToSave: BlobWithNameModel[] = [];

  constructor(private _gssRequestService: GssRequestService,
              private _paymentProcessService: PaymentProcessService) {
    for (let i = 8; i <= 19; i++) {
      this.timeList.push(i);
    }
  }

  ngOnChanges() {
    if (!!this.checkoutResult && !this.pickupRequestModel) {
      this._checkCurrentShipmentHasConsignments();

      this.pickupRequestModel = new PickupRequestModel(
        this.checkoutResult.Consignments[0] ? this.checkoutResult.Consignments[0].ConsignmentId : null,
        this.checkoutResult.Consignments[0] ? this.checkoutResult.Consignments[0].Connote : null,
        this.checkoutResult.SiteId,
        9,
        '',
        this.checkoutResult._id
      );

      this._prepareTickets();
    }
  }

  processPickup() {
    this.isPickupProcessing = true;
    this.pickupProcessingError = null;
    this._paymentProcessService.pickupShipment(this.pickupRequestModel).subscribe(resp => {
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

  private _checkCurrentShipmentHasConsignments() {
    this.currentShipmentHasConsignments = !!this.checkoutResult
      && !!this.checkoutResult.Consignments
      && !!this.checkoutResult.Consignments.length;
  }

  private _prepareTickets() {
    this.pdfFormattingProcessing = true;
    this.blobsToSave = [];

    if (this.currentShipmentHasConsignments) {
      this.checkoutResult.Consignments.forEach(item => {
        this._gssRequestService.downloadLabel(item.Connote)
          .subscribe(
            response => {
              const binaryPdf = atob(response[0]);
              const length = binaryPdf.length;
              const arrayBuf = new ArrayBuffer(length);
              const uintArray = new Uint8Array(arrayBuf);
              for (let i = 0; i < length; i++) {
                uintArray[i] = binaryPdf.charCodeAt(i);
              }
              const blob = new Blob([uintArray], {type: 'application/pdf'});
              this.blobsToSave.push(new BlobWithNameModel(item.Connote + '.pdf', blob));
              this.pdfFormattingProcessing = false;
            },
            error => {
              console.log('error occured when label downloaded', error);
            }
          );
      });
    } else {
      this.pdfFormattingProcessing = false;
    }
  }

  saveAllBlobs() {
    this.blobsToSave.forEach(bs => {
      saveAs(bs.Blob, bs.Name);
    });
  }
}

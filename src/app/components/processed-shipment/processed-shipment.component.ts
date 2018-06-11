import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ProcessedShipmentModel} from '../../models/processed-shipment.model';
import {BlobWithNameModel} from '../../models/blob-with-name.model';
import {GssRequestService} from '../../services/gss-request.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-processed-shipment',
  templateUrl: './processed-shipment.component.html'
})
export class ProcessedShipmentComponent implements OnInit, OnChanges {
  @Input() shipment: ProcessedShipmentModel;
  pdfFormattingProcessing: boolean = false;
  blobsToSave: BlobWithNameModel[] = [];
  currentShipmentHasConsignments: boolean = false;

  constructor(private _gssRequestService: GssRequestService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this._checkCurrentShipmentHasConsignments();
  }

  private _checkCurrentShipmentHasConsignments() {
    this.currentShipmentHasConsignments = !!this.shipment
      && !!this.shipment.Consignments
      && !!this.shipment.Consignments.length;
  }

  prepareTickets() {
    console.log('currentShipmentHasConsignments', this.currentShipmentHasConsignments);
    this.pdfFormattingProcessing = true;
    this.blobsToSave = [];

    if (this.currentShipmentHasConsignments) {
      this.shipment.Consignments.forEach(item => {
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
              const blobToSave = new BlobWithNameModel(item.Connote + '.pdf', blob);
              this.blobsToSave.push(blobToSave);
              this.pdfFormattingProcessing = false;
              saveAs(blobToSave.Blob, blobToSave.Name);
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

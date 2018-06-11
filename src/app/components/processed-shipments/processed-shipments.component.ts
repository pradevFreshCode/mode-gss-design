import {Component, OnInit} from '@angular/core';
import {ProcessedShipmentModel} from '../../models/processed-shipment.model';
import {ProcessedShipmentsService} from '../../modules/data-services/services/processedShipmentsService';

@Component({
  selector: 'app-processed-shipments',
  templateUrl: './processed-shipments.component.html'
})
export class ProcessedShipmentsComponent implements OnInit {
  shipmentsToDisplay: ProcessedShipmentModel[] = [];
  isLoaded: boolean = false;
  isLoading: boolean = false;

  constructor(private _processedShipmentsService: ProcessedShipmentsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this._processedShipmentsService.getAll().subscribe(data => {
      this.shipmentsToDisplay = data;
      this.isLoaded = true;
      this.isLoading = false;
      console.log(this.shipmentsToDisplay);
    });
  }
}

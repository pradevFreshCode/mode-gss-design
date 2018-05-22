import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {saveAs} from 'file-saver/FileSaver';
import {GssRequestService} from '../../services/gss-request.service';
import {RatesRequest} from '../../models/rates-request';
import {Available} from '../../models/available';
import {Origin} from '../../models/origin';
import {Destination} from '../../models/destination';
import {Address} from '../../address';
import {Package} from '../../models/package';
import {ShipmentsRequest} from '../../models/shipments-request';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Input() availToGo: Available;
  @Output() checkoutDone = new EventEmitter<any>();

  shipmentResponse: any;
  shipmentErrorResponse: any;

  constructor(private gssRequestService: GssRequestService) {
  }

  ngOnInit() {
  }

  public processCheckout(isEmail: boolean) {
    // this.isLoading = true;
    this.shipmentErrorResponse = null;

    // console.log('index: ' + i + ', isEmail: ' + isEmail);
    const req = new ShipmentsRequest();
    req.Origin = new Origin();
    req.Origin.Address = new Address();
    req.Destination = new Destination();
    req.Destination.Address = new Address();
    // origin
    req.Origin.Name = this.ratesRequest.Origin.Name;
    req.Origin.Address.BuildingName = this.ratesRequest.Origin.Address.BuildingName;
    req.Origin.Address.StreetAddress = this.ratesRequest.Origin.Address.StreetAddress;
    req.Origin.Address.Suburb = this.ratesRequest.Origin.Address.Suburb;
    req.Origin.Address.City = this.ratesRequest.Origin.Address.City;
    req.Origin.Address.PostCode = this.ratesRequest.Origin.Address.PostCode;
    req.Origin.Address.CountryCode = this.ratesRequest.Origin.Address.CountryCode;
    req.Origin.Email = this.ratesRequest.Origin.Email;
    req.Origin.ContactPerson = this.ratesRequest.Origin.ContactPerson;
    req.Origin.PhoneNumber = this.ratesRequest.Origin.PhoneNumber;
    // destination
    req.Destination.Name = this.ratesRequest.Destination.Name;
    req.Destination.Address.BuildingName = this.ratesRequest.Destination.Address.BuildingName;
    req.Destination.Address.StreetAddress = this.ratesRequest.Destination.Address.StreetAddress;
    req.Destination.Address.Suburb = this.ratesRequest.Destination.Address.Suburb;
    req.Destination.Address.City = this.ratesRequest.Destination.Address.City;
    req.Destination.Address.PostCode = this.ratesRequest.Destination.Address.PostCode;
    req.Destination.Address.CountryCode = this.ratesRequest.Destination.Address.CountryCode;
    req.Destination.Email = this.ratesRequest.Destination.Email;
    req.Destination.ContactPerson = this.ratesRequest.Destination.ContactPerson;
    req.Destination.PhoneNumber = this.ratesRequest.Destination.PhoneNumber;
    req.Destination.DeliveryInstructions = this.ratesRequest.Destination.DeliveryInstructions;
    req.Destination.SendTrackingEmail = this.ratesRequest.Destination.SendTrackingEmail;
    // packages
    req.Packages = [];
    this.ratesRequest.Packages.forEach(item => {
      const pkg = new Package();
      pkg.Name = item.Name;
      pkg.Length = item.Length;
      pkg.Height = item.Height;
      pkg.Width = item.Width;
      pkg.Kg = item.Kg;
      pkg.PackageCode = item.PackageCode;
      pkg.Type = item.Type;
      req.Packages.push(pkg);
    });
    // others
    req.Commodities = null;
    req.IsSaturdayDelivery = false;
    req.IsSignatureRequired = true;
    req.IsUrgentCouriers = false;
    req.DutiesAndTaxesByReceiver = false;
    req.DeliveryReference = this.ratesRequest.DeliveryReference;
    req.PrintToPrinter = true;
    req.Outputs = null;
    req.CarrierId = this.availToGo.CarrierId;
    req.Carrier = this.availToGo.CarrierName;
    req.Service = null;
    req.SiteId = 0;
    req.IncludeLineDetails = false;
    req.ShipType = 1,
      req.HasDG = false;
    req.DangerousGoods = null;
    req.DisableFreightForwardEmails = isEmail ? false : true;
    req.IncludeInsurance = false;
    // console.log(req);

    this.gssRequestService.postShipments(req)
      .subscribe(
        res => {
          this.shipmentResponse = res;
          // check if there're any errors
          if (this.shipmentResponse.Errors.length > 0) {
            // error occurred
            let errMsg = '';
            this.shipmentResponse.Errors.forEach(item => {
              errMsg += JSON.stringify(item) + '\n';
            });
            alert(errMsg);
            this.checkoutDone.emit(null);
          } else {
            // download labels

            // if data returned without errors, return response object
            if (this.shipmentResponse.Consignments.length > 0) {
              this.checkoutDone.emit(this.shipmentResponse);
            } else {
              this.checkoutDone.emit(null);
            }

            // this.shipmentResponse.Consignments.forEach(item => {
            //   this.gssRequestService.downloadLabel(item.Connote)
            //     .subscribe(
            //       response => {
            //         // console.log(response);
            //         const binaryPdf = atob(response[0]);
            //         const length = binaryPdf.length;
            //         const arrayBuf = new ArrayBuffer(length);
            //         const uintArray = new Uint8Array(arrayBuf);
            //         for (let i = 0; i < length; i++) {
            //           uintArray[i] = binaryPdf.charCodeAt(i);
            //         }
            //         const blob = new Blob([uintArray], {type: 'application/pdf'});
            //         saveAs(blob, item.Connote + '.pdf');
            //         this.checkoutDone.emit(true);
            //       },
            //       error => {
            //         this.checkoutDone.emit(false);
            //       }
            //     );
            // });
          }
        },
        err => {
          this.shipmentErrorResponse = err;
          alert('Unknown error occurred. Please try later again.');
          this.checkoutDone.emit(null);
        }
      );
    // this.checkoutDone.emit(true);
  }
}

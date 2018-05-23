import { Component, OnInit, Input, Output, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from 'ngx-stripe';
import { saveAs } from 'file-saver/FileSaver';

import { environment } from '../../../environments/environment';
import { StripeChargeService } from '../../services/stripe-charge.service';
import { GssRequestService } from '../../services/gss-request.service';
import { RatesRequest } from '../../models/rates-request';
import { Available } from '../../models/available';
import { Origin } from '../../models/origin';
import { Destination } from '../../models/destination';
import { Address } from '../../address';
import { Package } from '../../models/package';
import { ShipmentsRequest } from '../../models/shipments-request';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Input() availToGo: Available;
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Output() cardDone = new EventEmitter<any>();

  loaderpath = environment.assets_dir + 'ajax-loader.gif';
  shipmentResponse: any;
  shipmentErrorResponse: any;

  // stripe
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        /* lineHeight: '40px', */
        fontWeight: 300,
        /* fontFamily: '"Helvetica Neue", Helvetica, sans-serif', */
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    },
    hidePostalCode: true
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;
  isNameError: boolean;
  cardError: string;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private stripeChargeService: StripeChargeService,
    private gssRequestService: GssRequestService,
  ) { }

  ngOnInit() {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.isNameError = false;
    this.cardError = '';

    /*
    console.log('Cost: ' + this.availToGo.Cost.toFixed(2));
    console.log('isEmail: ' + this.availToGo.IsEmail);
    */
  }

  processPayment() {
    const name = this.stripeTest.get('name').value;
    this.cardError = '';
    if (name === undefined || name === null || name.trim() === '') {
      // alert ('name is required');
      this.isNameError = true;
      this.cardError = 'Name is required';
      this.cardDone.emit(false);
      return false;
    }

    // show loader
    // this.isProcessing = true;

    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(result => {
        if (result.token) {
          this.stripeChargeService
            .chargePostRequest(this.availToGo.Cost,
            'NZD',
            'Returning Cost from ' + this.ratesRequest.Origin.Name,
            result.token.id)
              .subscribe(
                data => {
                  // this.checkout();
                  this.cardDone.emit(true);
                },
                error => {
                  // hide loader
                  // this.isProcessing = false;
                  // console.log(error);
                  // Show error msg
                  if (error.message !== undefined && error.message !== null && error.message.length > 0) {
                    this.cardError = error.message;
                  } else {
                    this.cardError = 'Unknown error has occurred. Please try later again.';
                  }
                  this.cardDone.emit(false);
              }, () => {
                // completed
              });
        } else if (result.error) {
          // Error creating the token
          // console.log(result.error.message);
          // hide loader
          // this.isProcessing = false;
          this.cardDone.emit(false);
          // Show error modal
          this.cardError = result.error.message;
        } else {
          // hide loader
          // this.isProcessing = false;
          this.cardDone.emit(false);
        }
      });
  }

  // private checkout() {
  //   // this.isLoading = true;
  //   this.shipmentErrorResponse = null;
  //
  //   // console.log('index: ' + i + ', isEmail: ' + isEmail);
  //   const req = new ShipmentsRequest();
  //   req.Origin = new Origin();
  //   req.Origin.Address = new Address();
  //   req.Destination = new Destination();
  //   req.Destination.Address = new Address();
  //   // origin
  //   req.Origin.Name = this.ratesRequest.Origin.Name;
  //   req.Origin.Address.BuildingName = this.ratesRequest.Origin.Address.BuildingName;
  //   req.Origin.Address.StreetAddress = this.ratesRequest.Origin.Address.StreetAddress;
  //   req.Origin.Address.Suburb = this.ratesRequest.Origin.Address.Suburb;
  //   req.Origin.Address.City = this.ratesRequest.Origin.Address.City;
  //   req.Origin.Address.PostCode = this.ratesRequest.Origin.Address.PostCode;
  //   req.Origin.Address.CountryCode = this.ratesRequest.Origin.Address.CountryCode;
  //   req.Origin.Email = this.ratesRequest.Origin.Email;
  //   req.Origin.ContactPerson = this.ratesRequest.Origin.ContactPerson;
  //   req.Origin.PhoneNumber = this.ratesRequest.Origin.PhoneNumber;
  //   // destination
  //   req.Destination.Name = this.ratesRequest.Destination.Name;
  //   req.Destination.Address.BuildingName = this.ratesRequest.Destination.Address.BuildingName;
  //   req.Destination.Address.StreetAddress = this.ratesRequest.Destination.Address.StreetAddress;
  //   req.Destination.Address.Suburb = this.ratesRequest.Destination.Address.Suburb;
  //   req.Destination.Address.City = this.ratesRequest.Destination.Address.City;
  //   req.Destination.Address.PostCode = this.ratesRequest.Destination.Address.PostCode;
  //   req.Destination.Address.CountryCode = this.ratesRequest.Destination.Address.CountryCode;
  //   req.Destination.Email = this.ratesRequest.Destination.Email;
  //   req.Destination.ContactPerson = this.ratesRequest.Destination.ContactPerson;
  //   req.Destination.PhoneNumber = this.ratesRequest.Destination.PhoneNumber;
  //   req.Destination.DeliveryInstructions = this.ratesRequest.Destination.DeliveryInstructions;
  //   req.Destination.SendTrackingEmail = this.ratesRequest.Destination.SendTrackingEmail;
  //   // packages
  //   req.Packages = [];
  //   this.ratesRequest.Packages.forEach(item => {
  //     const pkg = new Package();
  //     pkg.Name = item.Name;
  //     pkg.Length = item.Length;
  //     pkg.Height = item.Height;
  //     pkg.Width = item.Width;
  //     pkg.Kg = item.Kg;
  //     pkg.PackageCode = item.PackageCode;
  //     pkg.Type = item.Type;
  //     req.Packages.push(pkg);
  //   });
  //   // others
  //   req.DeliveryReference = this.ratesRequest.DeliveryReference;
  //   req.CarrierId = this.availToGo.CarrierId;
  //   req.Carrier = this.availToGo.CarrierName;
  //   req.ShipType = 1;
  //   req.DisableFreightForwardEmails = this.availToGo.IsEmail ? false : true;
  //
  //   this.gssRequestService.postShipments(req)
  //     .subscribe(
  //       res => {
  //         this.shipmentResponse = res;
  //         // check if there're any errors
  //         if (this.shipmentResponse.Errors.length > 0) {
  //           // error occurred
  //           this.shipmentResponse.Errors.forEach(item => {
  //             this.cardError += JSON.stringify(item) + '\n';
  //           });
  //           this.cardDone.emit(false);
  //         } else {
  //           // download labels
  //           this.shipmentResponse.Consignments.forEach(item => {
  //             this.gssRequestService.downloadLabel(item.Connote)
  //               .subscribe(
  //                 response => {
  //                   // console.log(response);
  //                   const binaryPdf = atob(response[0]);
  //                   const length = binaryPdf.length;
  //                   const arrayBuf = new ArrayBuffer(length);
  //                   const uintArray = new Uint8Array(arrayBuf);
  //                   for (let i = 0; i < length; i++) {
  //                     uintArray[i] = binaryPdf.charCodeAt(i);
  //                   }
  //                   const blob = new Blob([uintArray], { type: 'application/pdf' });
  //                   saveAs(blob, item.Connote + '.pdf');
  //                   this.cardDone.emit(true);
  //                 },
  //                 error => {
  //                   this.cardDone.emit(false);
  //                 }
  //             );
  //           });
  //         }
  //       },
  //       err => {
  //         this.shipmentErrorResponse = err;
  //         this.cardError = 'Unknown error occurred. Please try later again.';
  //         this.cardDone.emit(false);
  //       }
  //     );
  // }
}

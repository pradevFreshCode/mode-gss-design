import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from 'ngx-stripe';
import { saveAs } from 'file-saver/dist/FileSaver';
import { Response } from '@angular/http';

import { environment } from '../../environments/environment';
import { GssRequestService } from '../gss-request.service';

import { RatesRequest } from '../rates-request';
import { Origin } from '../origin';
import { Destination } from '../destination';
import { Address } from '../address';
import { Package } from '../package';
import { ShipmentsRequest } from '../shipments-request';
import { Available } from '../available';

import { StripeChargeService } from '../stripe-charge.service';

@Component({
  selector: 'app-gss-form',
  templateUrl: './gss-form.component.html',
  styleUrls: ['./gss-form.component.css']
})
export class GssFormComponent implements OnInit {
  @Input() wizardStep: number;
  @ViewChild('myModal') myModal: ElementRef;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  ratesRequest: RatesRequest;
  available: any;
  errorResponse: any;
  shipmentResponse: any;
  shipmentErrorResponse: any;
  loaderpath = environment.assets_dir + 'ajax-loader.gif';
  isLoading: boolean;

  isSuccess: boolean;
  modalTitle: string;
  modalBody: string;

  availToGo: any;
  isEmail: boolean;
  isProcessing: boolean;

  // stripe
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
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
    private gssRequestService: GssRequestService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private stripeChargeService: StripeChargeService
  ) { }

  ngOnInit() {
    this.ratesRequest = new RatesRequest();
    this.ratesRequest.Origin = new Origin();
    this.ratesRequest.Origin.Address = new Address();
    this.ratesRequest.Destination = new Destination();
    this.ratesRequest.Destination.Address = new Address();
    this.ratesRequest.Packages = [];

    this.available = {};
    this.available.Available = [];
    this.isLoading = false;

    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });

    // document.getElementById('btnShowStripe').click();
    this.isNameError = false;
    this.cardError = '';

    // to go
    this.availToGo = {};
    this.isEmail = true;
    this.isProcessing = false;

  }

  public isStreetsOkay(): boolean {
    if (this.ratesRequest.Origin.Address.StreetAddress === undefined
      || this.ratesRequest.Origin.Address.StreetAddress === null
      || this.ratesRequest.Origin.Address.StreetAddress.trim() === '') {
      return false;
    }

    if (this.ratesRequest.Destination.Address.StreetAddress === undefined
      || this.ratesRequest.Destination.Address.StreetAddress === null
      || this.ratesRequest.Destination.Address.StreetAddress.trim() === '') {
      return false;
    }

    return true;
  }

  public isUnitAndKgOkay(): boolean {
    let itemTotal = 0;
    let isZero = false;
    this.ratesRequest.Packages.forEach(item => {
      itemTotal += item.Unit;
      if (item.Kg <= 0) {
        isZero = true;
        return false;
      }
      if (item.Length <= 0) {
        isZero = true;
        return false;
      }
      if (item.Height <= 0) {
        isZero = true;
        return false;
      }
      if (item.Width <= 0) {
        isZero = true;
        return false;
      }
    });

    if (isZero) {
      return false;
    }

    if (itemTotal <= 0) {
      return false;
    }

    return true;
  }

  public onSubmit() {
    this.isLoading = true;
    this.errorResponse = null;

    // reorganize Package: remove Unit
    const toGo = Object.assign({}, this.ratesRequest);

    // remove Packages
    toGo.Packages = [];
    // console.log(copy);

    this.ratesRequest.Packages.forEach(pkg => {
      let i = 0;
      for (i; i < pkg.Unit; i++) {
        const togoPkg = new Package();
        togoPkg.Id = pkg.Id;
        togoPkg.Length = pkg.Length;
        togoPkg.Width = pkg.Width;
        togoPkg.Height = pkg.Height;
        togoPkg.Name = pkg.Name;
        togoPkg.Kg = pkg.Kg;
        togoPkg.PackageCode = pkg.PackageCode;
        togoPkg.Type = pkg.Type;

        toGo.Packages.push(togoPkg);
      }
    });

    // console.log(toGo);
    this.getAvails(toGo);
  }

  getAvails(ratesRequest: RatesRequest): void {
    this.gssRequestService.getAvails(ratesRequest)
      .subscribe(
        avails => {
          this.isLoading = false;
          this.available = avails;
        },
        err => {
          this.isLoading = false;
          this.errorResponse = err;
        }
      );
  }

  public GoWithTheCarrier(avail: Available, isEmail: boolean = true) {
    this.availToGo = avail;
    this.isEmail = isEmail;

    // show StripeCardComponent
    document.getElementById('btnShowStripe').click();
  }

  private checkout() {
    this.isLoading = true;
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
    req.DisableFreightForwardEmails = this.isEmail ? false : true;
    req.IncludeInsurance = false;
    // console.log(req);

    this.gssRequestService.postShipments(req)
      .subscribe(
        res => {
          // hide loader
          this.isProcessing = false;
          // close card modal
          document.getElementById('cancelBtn').click();
          this.isLoading = false;
          this.shipmentResponse = res;
          // check if there're any errors
          if (this.shipmentResponse.Errors.length > 0) {
            // error occurred
            // show modal
            this.isSuccess = false;
            this.modalTitle = 'Error!';
            this.shipmentResponse.Errors.forEach(item => {
              this.modalBody += JSON.stringify(item) + '\n';
            });
            document.getElementById('btnShowModal').click();
          } else {
            // download labels
            this.shipmentResponse.Consignments.forEach(item => {
              this.gssRequestService.downloadLabel(item.Connote)
                .subscribe(
                  response => {
                    // console.log(response);
                    const binaryPdf = atob(response[0]);
                    const length = binaryPdf.length;
                    const arrayBuf = new ArrayBuffer(length);
                    const uintArray = new Uint8Array(arrayBuf);
                    for (let i = 0; i < length; i++) {
                      uintArray[i] = binaryPdf.charCodeAt(i);
                    }
                    // const blob = new Blob([atob(response[0])], { type: 'application/pdf' });
                    const blob = new Blob([uintArray], { type: 'application/pdf' });
                    saveAs(blob, item.Connote + '.pdf');
                }
              );
            });

            // show modal
            this.isSuccess = true;
            this.modalTitle = 'Success!';
            this.modalBody = this.shipmentResponse.Message + '\n\n' + 'done!';
            document.getElementById('btnShowModal').click();
          }
        },
        err => {
          // hide loader
          this.isProcessing = false;
          // close card modal
          document.getElementById('cancelBtn').click();

          this.isLoading = false;
          this.shipmentErrorResponse = err;

          // show error modal
          this.isSuccess = false;
          this.modalTitle = 'Error!';
          this.modalBody = 'Unknown error occurred. Please try later again.';
          document.getElementById('btnShowModal').click();
        }
      );
  }

  processPayment() {
    const name = this.stripeTest.get('name').value;
    this.cardError = '';
    if (name === undefined || name === null || name.trim() === '') {
      // alert ('name is required');
      this.isNameError = true;
      this.cardError = 'Name is required';
      return false;
    }

    // show loader
    this.isProcessing = true;

    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(result => {
        if (result.token) {
          // console.log(result.token.id);
          // console.log(this.availToGo);

          this.stripeChargeService
            .chargePostRequest(this.availToGo.Cost,
            'NZD',
            'Returning Cost from ' + this.ratesRequest.Origin.Name,
            result.token.id)
              .subscribe(
                data => {
                  // hide loader
                  // this.isProcessing = false;
                  // close modal
                  // document.getElementById('cancelBtn').click();
                  // console.log(data);
                  // proceed to the final step
                  this.checkout();
                },
                error => {
                  // hide loader
                  this.isProcessing = false;
                  // close modal
                  document.getElementById('cancelBtn').click();
                  // console.log(error);
                  // Show error modal
                  this.isSuccess = false;
                  this.modalTitle = 'Error!';
                  if (error.message !== undefined && error.message !== null && error.message.length > 0) {
                    this.modalBody = error.message;
                  } else {
                    this.modalBody = 'Unknown error has occurred. Please try later again.';
                  }
                  document.getElementById('btnShowModal').click();
              });
        } else if (result.error) {
          // Error creating the token
          // console.log(result.error.message);
          // hide loader
          this.isProcessing = false;
          // Show error modal
          this.cardError = result.error.message;
        } else {
          // hide loader
          this.isProcessing = false;
        }
      });
  }
}

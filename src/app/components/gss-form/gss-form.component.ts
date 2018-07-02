import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {Response} from '@angular/http';

import {trigger, transition, animate, style} from '@angular/animations';
import {environment} from '../../../environments/environment';

import {RatesRequest} from '../../models/rates-request';
import {Origin} from '../../models/origin';
import {Destination} from '../../models/destination';
import {Address} from '../../address';
import {ShipmentsRequest} from '../../models/shipments-request';

import {Available} from '../../models/available';

import {PaymentFormComponent} from '../payment-form/payment-form.component';
import {CheckoutComponent} from '../checkout/checkout.component';
import {saveAs} from 'file-saver';
import {PickupRequestModel} from '../../models/pickup-request.model';
import {SessionService} from '../../services/session.service';
import {UserModel} from '../../modules/data-services/models/User.model';
import {ProcessedShipmentModel} from '../../models/processed-shipment.model';

@Component({
  selector: 'app-gss-form',
  templateUrl: './gss-form.component.html',
  styleUrls: ['./gss-form.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(120%)'}),
        animate('200ms ease-out', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        // animate('200ms ease-in', style({transform: 'translateX(-120%)'}))
        animate('0ms ease-in', style({height: 0, width: 0}))
      ])
    ])
  ]
})

export class GssFormComponent implements OnInit {
  @ViewChild(PaymentFormComponent) paymentComponent: PaymentFormComponent;
  @ViewChild(CheckoutComponent) checkoutComponent: CheckoutComponent;

  loaderpath = environment.assets_dir + 'ajax-loader.gif';

  steps = ['sender details', 'recipient details', 'package size', 'payment', 'pickup', 'pickup success'];
  wizardStep: number;

  ratesRequest: RatesRequest;
  isPackageFormValid: boolean;
  available: any;
  errorResponse: any;

  availToGo: any;
  isProcessing: boolean;

  checkoutResult: ProcessedShipmentModel = null;
  pickupProcessMessage: string;
  currentUser: UserModel;
  userToken: string;
  authorizationStepLoading: boolean = false;

  constructor(private _sessionService: SessionService) {
  }

  ngOnInit() {
    this._sessionService.CurrentUserReplaySubject.subscribe(currentUser => {
      this.currentUser = currentUser;
    });
    this._sessionService.TokenReplaySubject.subscribe(token => {
      this.userToken = token;
    });

    this.wizardStep = 0;
    this.ratesRequest = new RatesRequest();
    this.ratesRequest.Origin = new Origin();
    this.ratesRequest.Origin.Address = new Address();
    this.ratesRequest.Destination = new Destination();
    this.ratesRequest.Destination.Address = new Address();
    this.ratesRequest.Packages = [];

    // to go
    this.availToGo = {};
    this.isProcessing = false;
    this.isPackageFormValid = false;
  }

  public isUnitAndKgOkay(): boolean {
    let itemTotal = 0;
    let isInvalid = false;
    this.ratesRequest.Packages.forEach(item => {
      itemTotal += item.Unit;
      if (item.Kg <= 0 || item.Kg > 20) {
        isInvalid = true;
        return false;
      }
      if (item.Length <= 0 || item.Length > 200) {
        isInvalid = true;
        return false;
      }
      if (item.Height <= 0 || item.Height > 200) {
        isInvalid = true;
        return false;
      }
      if (item.Width <= 0 || item.Width > 200) {
        isInvalid = true;
        return false;
      }
    });

    if (isInvalid) {
      return false;
    }

    if (itemTotal <= 0) {
      return false;
    }

    return true;
  }

  clickNext() {
    this.wizardStep = (this.wizardStep + 1) % 6;
  }

  clickBack() {
    this.wizardStep = (this.wizardStep - 1) % 6;
  }

  onGo(avail: Available) {
    this.availToGo = avail;
    this.clickNext();
  }

  // onCardDone(isDone: boolean) {
  //   this.isProcessing = false;
  //   if (isDone) {
  //     this.clickNext();
  //   }
  // }

  processPayment() {
    this.isProcessing = true;
    this.paymentComponent.processPayment();
  }

  goToStartClicked() {
    this.wizardStep = 0;
  }

  pickupProcessed(processingResult: any) {
    this.wizardStep = 5;
    this.pickupProcessMessage = processingResult;
  }

  onCheckoutDone(checkoutResult: any) {
    this.isProcessing = false;
    this.checkoutResult = checkoutResult;
    this.clickNext();
  }

  onAuthLoadingStateChanged(newState: boolean) {
    this.authorizationStepLoading = newState;
  }

  onConfirmEmailApiRespondSuccess(response) {
    this._sessionService.reinitCurrentUser().subscribe(user => {

    });
  }
}

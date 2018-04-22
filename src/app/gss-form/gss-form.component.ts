import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Response } from '@angular/http';

import { trigger, transition, animate, style } from '@angular/animations';
import { environment } from '../../environments/environment';

import { RatesRequest } from '../rates-request';
import { Origin } from '../origin';
import { Destination } from '../destination';
import { Address } from '../address';
import { ShipmentsRequest } from '../shipments-request';

import { Available } from '../available';

import { PaymentFormComponent } from '../payment-form/payment-form.component';

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

  loaderpath = environment.assets_dir + 'ajax-loader.gif';

  steps = ['sender details', 'recipient details', 'package size', 'payment', 'book pickup'];
  wizardStep: number;

  ratesRequest: RatesRequest;
  isPackageFormValid: boolean;
  available: any;
  errorResponse: any;

  availToGo: any;
  isProcessing: boolean;

  constructor() { }

  ngOnInit() {
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
    this.wizardStep = (this.wizardStep + 1) % 5;
  }

  clickBack() {
    this.wizardStep = (this.wizardStep - 1) % 5;
  }

  onGo(avail: Available) {
    this.availToGo = avail;
    this.clickNext();
  }

  onCardDone(isDone: boolean) {
    this.isProcessing = false;
    if (isDone) {
      this.clickNext();
    }
  }

  processPayment() {
    this.isProcessing = true;
    this.paymentComponent.processPayment();
  }
}

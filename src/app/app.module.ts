import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ReceiverFormComponent } from './receiver-form/receiver-form.component';
import { SenderFormComponent } from './sender-form/sender-form.component';
import { PackageFormComponent } from './package-form/package-form.component';
import { GssFormComponent } from './gss-form/gss-form.component';
import { GssRequestService } from './gss-request.service';

import { AgmCoreModule } from '@agm/core';
import { GeocodingService } from './geocoding.service';

import { NgxStripeModule } from 'ngx-stripe';

import { environment } from '../environments/environment';
import { StripeChargeService } from './stripe-charge.service';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PickupFormComponent } from './pickup-form/pickup-form.component';
import { CarrierFormComponent } from './carrier-form/carrier-form.component';
import { PackageComponent } from './package/package.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {CountriesListProviderService} from './services/countries-list-provider.service';
import {LocalStorageModule} from 'angular-2-local-storage';

@NgModule({
  declarations: [
    AppComponent,
    ReceiverFormComponent,
    SenderFormComponent,
    PackageFormComponent,
    GssFormComponent,
    PaymentFormComponent,
    PickupFormComponent,
    CarrierFormComponent,
    PackageComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.agm_key,
      libraries: ['places']
    }),
    NgxStripeModule.forRoot(environment.stripe_pk_key),
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    })
  ],
  providers: [GssRequestService, GeocodingService, StripeChargeService, CountriesListProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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

@NgModule({
  declarations: [
    AppComponent,
    ReceiverFormComponent,
    SenderFormComponent,
    PackageFormComponent,
    GssFormComponent
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
  ],
  providers: [GssRequestService, GeocodingService, StripeChargeService],
  bootstrap: [AppComponent]
})
export class AppModule { }

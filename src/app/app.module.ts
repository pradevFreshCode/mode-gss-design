import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {ReceiverFormComponent} from './components/receiver-form/receiver-form.component';
import {SenderFormComponent} from './components/sender-form/sender-form.component';
import {PackageFormComponent} from './components/package-form/package-form.component';
import {GssFormComponent} from './components/gss-form/gss-form.component';
import {GssRequestService} from './services/gss-request.service';

import {AgmCoreModule} from '@agm/core';
import {GeocodingService} from './services/geocoding.service';

import {NgxStripeModule} from 'ngx-stripe';

import {environment} from '../environments/environment';
import {StripeChargeService} from './services/stripe-charge.service';
import {PaymentFormComponent} from './components/payment-form/payment-form.component';
import {PickupFormComponent} from './components/pickup-form/pickup-form.component';
import {CarrierFormComponent} from './components/carrier-form/carrier-form.component';
import {PackageComponent} from './components/package/package.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CountriesListProviderService} from './services/countries-list-provider.service';
import {LocalStorageModule} from 'angular-2-local-storage';
import {DataServicesModule} from './modules/data-services/data-services.module';
import {SessionService} from './services/session.service';
import {AccessService} from './services/access.service';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app.routes';
import {MainLayoutComponent} from './components/main-layout/main-layout.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {RegisterSuccessComponent} from './components/register-success/register-success.component';
import { NotConfirmedComponent } from './components/not-confirmed/not-confirmed.component';
import { EmailConfirmationComponent } from './components/email-confirmation/email-confirmation.component';
import { TextMaskModule } from 'angular2-text-mask';
import {AuthorizedGuard} from './guards/authorized.guard';
import {UnauthorizedGuard} from './guards/unauthorized.guard';
import {ConfirmedAccountGuard} from './guards/confirmed-account.guard';
import {UnconfirmedAccountGuard} from './guards/unconfirmed-account.guard';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import { ProcessedShipmentsComponent } from './components/processed-shipments/processed-shipments.component';

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
    CheckoutComponent,
    PageNotFoundComponent,
    MainLayoutComponent,

    LoginComponent,
    RegisterComponent,
    RegisterSuccessComponent,
    NotConfirmedComponent,
    EmailConfirmationComponent,
    ProcessedShipmentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.agm_key,
      libraries: ['places']
    }),
    NgxStripeModule.forRoot(environment.stripe_pk_key),
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    DataServicesModule.forRoot(),
    TextMaskModule,
    AngularFontAwesomeModule
  ],
  providers: [
    GssRequestService,
    GeocodingService,
    StripeChargeService,
    CountriesListProviderService,
    SessionService,
    AccessService,
    AuthorizedGuard,
    UnauthorizedGuard,
    ConfirmedAccountGuard,
    UnconfirmedAccountGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

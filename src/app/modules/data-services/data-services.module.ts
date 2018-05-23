import {ModuleWithProviders, NgModule} from '@angular/core';
import {UsersService} from './services/usersService';
import {ApiClientService} from './services/api-client.service';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {PaymentProcessService} from './services/payment-process.service';
import {ProcessedShipmentsService} from './services/processedShipmentsService';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class DataServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DataServicesModule,
      providers: [
        ApiClientService,
        UsersService,
        PaymentProcessService,
        ProcessedShipmentsService
      ]
    };
  }
}

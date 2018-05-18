import {LocalStorageService} from 'angular-2-local-storage';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseSerializableModel} from '../models/BaseSerializableModel';
import {BaseClientService} from './base-client.service';

@Injectable()
export abstract class NamedClientService<T extends BaseSerializableModel> extends BaseClientService<T> {

  public constructor(http: HttpClient,
                     localStorage: LocalStorageService) {
    super(http, localStorage);
    this.apiBasePath = this.getApiBasePath();
  }

  abstract getServiceName(): string;

  abstract getApiBasePath(): string;

}

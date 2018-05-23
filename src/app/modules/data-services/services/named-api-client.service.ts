import {LocalStorageService} from 'angular-2-local-storage';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseClientService} from './base-client.service';
import {IRestAPICompatible} from '../../../interfaces/IRestAPICompatible';

@Injectable()
export abstract class NamedClientService<T extends IRestAPICompatible> extends BaseClientService<T> {

  public constructor(http: HttpClient,
                     localStorage: LocalStorageService) {
    super(http, localStorage);
    this.apiBasePath = this.getApiBasePath();
  }

  abstract getServiceName(): string;

  abstract getApiBasePath(): string;

}

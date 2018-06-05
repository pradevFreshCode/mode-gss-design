import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseClientService} from './base-client.service';
import {IRestAPICompatible} from '../../../interfaces/IRestAPICompatible';
import {LocalStorageExtendedService} from '../../../services/localStorageExtendedService';

@Injectable()
export abstract class NamedClientService<T extends IRestAPICompatible> extends BaseClientService<T> {

  public constructor(http: HttpClient,
                     localStorage: LocalStorageExtendedService) {
    super(http, localStorage);
    this.apiBasePath = this.getApiBasePath();
  }

  abstract getServiceName(): string;

  abstract getApiBasePath(): string;

}

import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from 'angular-2-local-storage';
import {IService} from '../../../interfaces/IService';
import {ApiClientService} from './api-client.service';
import {map} from 'rxjs/operators';
import {BaseSerializableModel} from '../models/BaseSerializableModel';
import {Observable} from 'rxjs/Observable';

export abstract class BaseClientService<T extends BaseSerializableModel> extends ApiClientService implements IService<T> {
  protected apiBasePath: string;

  public abstract fromJson(json: any): T;

  public abstract toJson(entity: T): any;

  constructor(http: HttpClient,
              localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  public getServiceName(): string {
    return 'BaseClientService';
  }

  public getAll(params: any = {}): Observable<T[]> {
    return this.get(this.apiBasePath, params).pipe(map(response => this.handleResponse(response).map(j => this.fromJson(j))));
  }

  public getById(id, isLoadingDisplayed: boolean = true): Observable<T> {
    return this.get(`${this.apiBasePath}/${id}`, {}).pipe(map(response => {
      return this.fromJson(this.handleResponse(response));
    }));
  }

  public create(entity: T): Observable<T> {
    return this.post(this.apiBasePath, this.toJson(entity)).pipe(map(response => {
      return this.fromJson(this.handleResponse(response));
    }));
  }

  public update(entity: T): Observable<T> {
    return this.post(`${this.apiBasePath}/${entity._id}`, this.toJson(entity)).pipe(map(response => {
      return this.fromJson(this.handleResponse(response));
    }));
  }

  public deleteById(id): Observable<any> {
    return this.delete(`${this.apiBasePath}/${id}`).pipe(map(response => {
      return this.handleResponse(response);
    }));
  }
}

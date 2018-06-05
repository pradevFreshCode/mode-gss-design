import {IService} from '../../../interfaces/IService';
import {map} from 'rxjs/operators';
import {BaseSerializableModel} from '../models/BaseSerializableModel';
import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {LocalStorageExtendedService} from '../../../services/localStorageExtendedService';

type FunctionWithSingleParam = (n: any) => any;

export abstract class BaseLocalStorageService<T extends BaseSerializableModel> implements IService<T> {
  public abstract fromJson(json: any): T;

  public abstract toJson(entity: T): any;

  public abstract getLocalStorageCollectionName(): string;

  constructor(protected localStorage: LocalStorageExtendedService) {
  }

  public getServiceName(): string {
    return 'BaseLSService';
  }

  public getAll(filterFunc: FunctionWithSingleParam): Observable<T[]> {
    return Observable.create(observer => {
      const localStorageCollection = this.localStorage.get(this.getLocalStorageCollectionName());
      let result = [];
      if (localStorageCollection && _.isArray(localStorageCollection)) {
        result = _.toArray(localStorageCollection).filter(filterFunc).map(j => this.fromJson(j));
      }
      observer.next(result);
      observer.complete();
    });
  }

  public getById(id): Observable<T> {
    return Observable.create(observer => {
      const localStorageCollection = this.localStorage.get(this.getLocalStorageCollectionName());
      let result = null;

      if (localStorageCollection && _.isArray(localStorageCollection)) {
        const foundedItem = _.toArray(localStorageCollection).find(item => item.id === id);
        result = foundedItem ? foundedItem.map(j => this.fromJson(j)) : null;
      }

      observer.next(result);
      observer.complete();
    });
  }

  public create(entity: T): Observable<T> {
    return Observable.create(observer => {
      const localStorageCollection = this.localStorage.get(this.getLocalStorageCollectionName());
      let newLocalStorageCollectionState = [];
      if (localStorageCollection && _.isArray(localStorageCollection)) {
        newLocalStorageCollectionState = _.toArray(localStorageCollection);
      }
      newLocalStorageCollectionState.push(entity.toJson());

      this.localStorage.add(this.getLocalStorageCollectionName(), newLocalStorageCollectionState);

      observer.next(entity);
      observer.complete();
    });
  }

  public update(entity: T): Observable<T> {
    return Observable.create(observer => {
      const localStorageCollection = this.localStorage.get(this.getLocalStorageCollectionName());
      let parsedFounded = null;
      if (localStorageCollection && _.isArray(localStorageCollection)) {
        const foundedItem = _.toArray(localStorageCollection).find(item => item._id === entity._id);
        parsedFounded = foundedItem ? foundedItem.map(j => this.fromJson(j)) : null;
      }

      if (parsedFounded) {
        _.merge(parsedFounded, entity);
      }

      observer.next(entity);
      observer.complete();
    });
  }

  // public deleteById(id): Observable<any> {
  //   return this.delete(`${this.apiBasePath}/${id}`).pipe(map(response => {
  //     return this.handleResponse(response);
  //   }));
  // }
}

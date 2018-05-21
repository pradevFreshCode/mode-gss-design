import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {LocalStorageService} from 'angular-2-local-storage';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {AppSettings} from '../../../../AppSettings';

// ToDo : will be used, when backend provided
@Injectable()
export class ApiClientService {
  constructor(private http: HttpClient,
              protected localStorage: LocalStorageService) {

  }

  createRequestOptions(getParams: any = {}): any {
    const headers = {};
    const token = this.localStorage.get('token');
    if (!!token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return {headers: headers, params: getParams, observe: 'response', responseType: 'json'};
  }

  get(url: string, data: any = {}): Observable<HttpResponse<Object>> {
    return this.http.get(AppSettings.getAPIUrl(url), this.createRequestOptions(data)).catch((err) => {
      return this.handleError(err);
    });
  }

  post(url: string, data: any): Observable<HttpResponse<Object>> {
    return this.http.post(AppSettings.getAPIUrl(url), data, this.createRequestOptions()).catch((err) => {
      return this.handleError(err);
    });
  }

  delete(url: string): Observable<HttpResponse<Object>> {
    return this.http.delete(AppSettings.getAPIUrl(url), this.createRequestOptions()).catch((err) => {
      return this.handleError(err);
    });
  }

  protected handleResponse(response: HttpResponse<Object>) {
    let body = response.body;
    if (body['status'] == 'error')
      throw new Error('Server error');

    return !!body['data'] ? body['data'] : body;
  }

  protected handleError(error: HttpResponse<Object> | any) {
    let errMessage: string;
    console.log(error);
    if (error instanceof HttpErrorResponse) {
      // let body = error.body || '';
      const err = error.error.data || JSON.stringify(error);
      if (error.status === 401) {
        this.handleSessionExpired();
      }

      errMessage = `${error.status} - ${error.statusText || ''}`;
    } else
      errMessage = error.message ? error.message : error.toString();

    console.log(`%c${errMessage}`, 'color:blue;');
    return Observable.throw(errMessage);
  }

  protected handleSessionExpired() {
    this.localStorage.remove('token');
  }
}

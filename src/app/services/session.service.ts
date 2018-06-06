import {EventEmitter, Injectable} from '@angular/core';
import {ISessionService} from '../interfaces/ISessionService';
import {UserModel} from '../modules/data-services/models/User.model';
import {ApiClientService} from '../modules/data-services/services/api-client.service';
import {catchError} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {RegistrationModel} from '../models/registration.model';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {environment} from '../../environments/environment';
import {LocalStorageExtendedService} from './localStorageExtendedService';

@Injectable()
export class SessionService implements ISessionService {
  private _token: string;
  private _currentUserReplaySubject = new ReplaySubject<UserModel>(1);
  private _currentUser: UserModel = null;
  private _tokenRefreshedEvent = new EventEmitter<string>();
  private _closeTabAfterSignIn: boolean;

  get Token(): string {
    return this._token;
  }

  get TokenRefreshedEvent(): EventEmitter<string> {
    return this._tokenRefreshedEvent;
  }

  get CurrentUserReplaySubject(): ReplaySubject<UserModel> {
    return this._currentUserReplaySubject;
  }

  get CurrentUser(): UserModel {
    return this._currentUser;
  }

  set CloseTabAfterSighnIn(value) {
    this._closeTabAfterSignIn = value;
  }

  constructor(private _apiService: ApiClientService, private _localStorageService: LocalStorageExtendedService) {
    this._currentUserReplaySubject.subscribe(user => {
      console.log('_currentUserReplaySubject called');
      this._currentUser = user;
    });

    this.reinitCurrentUser().subscribe();

    LocalStorageExtendedService.message$.subscribe(change => {
      if (typeof change['current_user_changed'] !== 'undefined') {
        this._currentUserReplaySubject.next(change['current_user_changed']);
      }
      if (typeof change['jwt_token_changed'] !== 'undefined') {
        this._token = change['jwt_token_changed'];
      }
    });
  }

  private reinitTokenFromLocalStorage(): void {
    this._token = this._localStorageService.get(environment.JWTTokenLocalStorageKey);
  }

  private processTokenResponse(response): boolean {
    const data = response.body && response.body['data'];
    const token = data.token;
    if (token) {
      this._token = token;
      this._localStorageService.set(environment.JWTTokenLocalStorageKey, token);
      return true;
    } else {
      return false;
    }
  }

  private parseJwt(token): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  public login(login: string, password: string): Observable<UserModel | any> {
    return Observable.create(observer => {
      this._apiService.post('/auth/signin', {login: login, password: password})
        .catch(this.handleError)
        .subscribe(resp => {
          const isTokenProcessed = this.processTokenResponse(resp);
          if (isTokenProcessed) {
            this.reinitCurrentUser().subscribe(userModel => {
              if (this._closeTabAfterSignIn) {
                window.close();
              }

              observer.next(userModel);
              observer.complete();
            });
          } else {
            this.processLogout();
            observer.next(null);
            observer.complete();
          }
        }, err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  register(registerModel: RegistrationModel): Observable<UserModel> {
    return Observable.create(observer => {
      this._apiService.post('/auth/register', registerModel.toJson())
        .catch(this.handleError)
        .subscribe(resp => {
          const isTokenProcessed = this.processTokenResponse(resp);
          if (isTokenProcessed) {
            this.reinitCurrentUser().subscribe(userModel => {
              if (this._closeTabAfterSignIn) {
                window.close();
              }

              observer.next(userModel);
              observer.complete();
            });
          } else {
            this.processLogout();
            observer.next(null);
            observer.complete();
          }
        }, err => {
          observer.error(err);
          observer.complete();
        });
    });
  }

  handleError(error) {
    return new ErrorObservable(error || 'Server error');
  }

  public logout(): Subject<boolean> {
    const logoutSubject = new Subject<any>();
    this._apiService.post('/auth/signout')
      .pipe(catchError(this.handleError))
      .subscribe(resp => {
        this.processLogout();
        logoutSubject.next(true);
      }, err => {
        this.processLogout();
        logoutSubject.next(false);
      });

    return logoutSubject;
  }

  private processLogout(): void {
    this._localStorageService.remove(environment.JWTTokenLocalStorageKey);
    this._token = null;
    this._currentUserReplaySubject.next(null);
    this._localStorageService.broadcastMessage({current_user_changed: null});
    this._localStorageService.broadcastMessage({jwt_token_changed: null});
  }

  public reinitCurrentUser(): Observable<UserModel> {
    this.reinitTokenFromLocalStorage();
    if (!this._token) {
      return Observable.create(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return Observable.create(observer => {
      this._apiService.get('/auth/me')
        .subscribe(response => {
          const data = response.body['data'];
          const parsedUser = UserModel.FromJson(data.user);
          this._currentUserReplaySubject.next(parsedUser);
          this._localStorageService.broadcastMessage({current_user_changed: parsedUser});
          this._localStorageService.broadcastMessage({jwt_token_changed: this._token});
          observer.next(parsedUser);
          observer.complete();
        }, err => {
          this.processLogout();
          observer.next(null);
          observer.complete();
        });
    });
  }
}

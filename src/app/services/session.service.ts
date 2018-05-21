import {EventEmitter, Injectable} from '@angular/core';
import {ISessionService} from '../interfaces/ISessionService';
import {UserModel} from '../modules/data-services/models/User.model';
import {ApiClientService} from '../modules/data-services/services/api-client.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {catchError} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {LoginModel} from '../models/login.model';
import {RegistrationModel} from '../models/registration.model';

@Injectable()
export class SessionService implements ISessionService {
  private _token: string;
  private _currentUserReplaySubject = new ReplaySubject<UserModel>(1);
  private _currentUser: UserModel = null;
  private _tokenRefreshedEvent = new EventEmitter<string>();

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

  constructor(private _apiServise: ApiClientService, private _localStorageService: LocalStorageService) {
    this._currentUserReplaySubject.subscribe(user => {
      this._currentUser = user;
    });

    this.reinitTokenFromLocalStorage();
  }

  private reinitTokenFromLocalStorage(): void {
    this._token = this._localStorageService.get('jwt_token');
  }

  private processTokenResponse(response): boolean {
    const data = response.body && response.body['data'];
    const token = data.token;
    if (token) {
      this._token = token;
      this._localStorageService.set('token', token);
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

  // public registerLocal(registrationModel: RegistrationModel): Observable<UserModel | any> {
  //   return Observable.create(observer => {
  //     if (!registrationModel) {
  //       observer.throw('wrong login');
  //       observer.complete();
  //       return;
  //     }
  //
  //     if (!password) {
  //       observer.throw('wrong password');
  //       observer.complete();
  //       return;
  //     }
  //
  //     const newFictiveUser = new UserModel('1', login, login);
  //
  //     this._currentUserReplaySubject.next(newFictiveUser);
  //     observer.next(newFictiveUser);
  //     observer.complete();
  //   });
  // }

  public loginLocal(loginModel: LoginModel): Observable<UserModel | any> {
    return Observable.create(observer => {
      if (!loginModel.login) {
        observer.throw('wrong login');
        observer.complete();
        return;
      }

      if (!loginModel.password) {
        observer.throw('wrong password');
        observer.complete();
        return;
      }

      const newFictiveUser = new UserModel('1', loginModel.login, loginModel.password);

      this._currentUserReplaySubject.next(newFictiveUser);
      observer.next(newFictiveUser);
      observer.complete();
    });
  }

  public login(login: string, password: string): Observable<UserModel | any> {
    return Observable.create(observer => {
      this._apiServise.post('/auth/signin', {login: login, password: password})
        .catch(this.handleError)
        .subscribe(resp => {
          const isTokenProcessed = this.processTokenResponse(resp);
          if (isTokenProcessed) {
            this.reinitCurrentUser().subscribe(userModel => {
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
    return Observable.throw(error || 'Server error');
  }

  public logout(): Subject<boolean> {
    const logoutSubject = new Subject<any>();
    this._apiServise.get('/api/signout')
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
    this._token = null;
    this._currentUserReplaySubject.next(null);
  }

  public reinitCurrentUser(): Observable<UserModel> {
    this.reinitTokenFromLocalStorage();
    if (!this._token) {
      return Observable.create(observer => observer.next(null));
    }

    return Observable.create(observer => {
      this._apiServise.get('/auth/current_user')
        .subscribe(response => {
          const data = response.body['data'];
          const parsedUser = UserModel.FromJson(data.user);
          this._currentUserReplaySubject.next(parsedUser);
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

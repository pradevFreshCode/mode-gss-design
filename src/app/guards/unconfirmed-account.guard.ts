import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {SessionService} from '../services/session.service';

@Injectable()
export class UnconfirmedAccountGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      if (this._sessionService.Token) {
        this._sessionService.CurrentUserReplaySubject.subscribe(currentUser => {
          if (!!currentUser) {
            if (!!currentUser && !currentUser.confirmedAt) {
              resolve(true);
            } else {
              this._router.navigate(['/']);
              resolve(false);
            }
          } else {
            this._router.navigate(['/auth/login']);
            resolve(false);
          }
        });
      } else {
        this._router.navigate(['/']);
        resolve(false);
      }
    });
  }

  constructor(private _router: Router, private _sessionService: SessionService) {}
}

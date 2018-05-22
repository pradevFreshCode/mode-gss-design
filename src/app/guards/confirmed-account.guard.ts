import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {SessionService} from '../services/session.service';

@Injectable()
export class ConfirmedAccountGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      const currentUser = this._sessionService.CurrentUser;
      if (!!currentUser) {
        if (!!currentUser && !!currentUser.confirmedAt) {
          resolve(true);
        } else {
          this._router.navigate(['/not-confirmed']);
          reject(false);
        }
      } else {
        this._router.navigate(['/auth/login']);
        reject(false);
      }
    });
  }

  constructor(private _router: Router, private _sessionService: SessionService) {}
}

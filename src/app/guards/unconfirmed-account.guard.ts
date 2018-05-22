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
      const currentUser = this._sessionService.CurrentUser;
      if (!!currentUser) {
        if (!!currentUser && !currentUser.confirmedAt) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        this._router.navigate(['/auth/login']);
        resolve(false);
      }
    });
  }

  constructor(private _router: Router, private _sessionService: SessionService) {}
}

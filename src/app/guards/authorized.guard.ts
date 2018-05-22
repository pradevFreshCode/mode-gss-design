import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {SessionService} from '../services/session.service';
import {AccessService} from '../services/access.service';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      if (this._accessService.IsAuthorized()) {
        resolve(true);
      } else {
        this._router.navigate(['/login']);
        reject(false);
      }
    });
  }

  constructor(private _router: Router, private _accessService: AccessService) {}
}

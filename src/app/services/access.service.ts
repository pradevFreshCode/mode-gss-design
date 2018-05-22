import { Injectable } from '@angular/core';
import {SessionService} from './session.service';
import {UserRoleModel} from '../modules/data-services/models/UserRole.model';
import {UserRolesService} from '../modules/data-services/services/userRolesService';

@Injectable()
export class AccessService {

  constructor(private _sessionService: SessionService) { }

  public IsAdmin(strict: boolean = false) {
    if (!strict) {
      return this.HasRole(UserRoleModel.ROLE_ID_ADMIN);
    } else {
      return this.HasStrictRole(UserRoleModel.ROLE_ID_ADMIN);
    }
  }

  public IsUser(strict: boolean = false) {
    if (!strict) {
      return this.HasRole(UserRoleModel.ROLE_ID_USER);
    } else {
      return this.HasStrictRole(UserRoleModel.ROLE_ID_USER);
    }
  }

  public IsAuthorized() {
    return !!this._sessionService.CurrentUser;
  }

  public HasRole(role) {
    const user = this._sessionService.CurrentUser;

    if (!user || !user.roleId) {
      return false;
    }

    const roleOrder = UserRolesService.ROLE_ORDER;

    return roleOrder[user.roleId] >= roleOrder[role];
  }

  public HasStrictRole(role) {
    const user = this._sessionService.CurrentUser;
    if (!user || !user.roleId) {
      return false;
    }
    return user.roleId === role;
  }
}

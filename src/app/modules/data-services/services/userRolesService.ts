import {Injectable} from '@angular/core';
import {NamedClientService} from './named-api-client.service';
import {UserRoleModel} from '../models/UserRole.model';

@Injectable()
export class UserRolesService extends NamedClientService<UserRoleModel> {
  public static ROLE_ORDER = {
    [UserRoleModel.ROLE_ID_ADMIN]: 100,
    [UserRoleModel.ROLE_ID_USER]: 1
  };

  getApiBasePath(): string {
    return 'user_roles';
  }

  public getServiceName() {
    return 'UserRolesService';
  }

  public fromJson(json: any): UserRoleModel {
    return UserRoleModel.FromJson(json);
  }

  public toJson(entity: UserRoleModel): any {
    return entity.toJson();
  }
}

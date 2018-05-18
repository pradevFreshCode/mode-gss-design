import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserModel} from '../models/User.model';
import {NamedClientService} from './named-api-client.service';

@Injectable()
export class UsersService extends NamedClientService<UserModel> {
  getApiBasePath(): string {
    return 'users';
  }

  public getServiceName() {
    return 'UsersService';
  }

  public fromJson(json: any): UserModel {
    return UserModel.FromJson(json);
  }

  public toJson(entity: UserModel): any {
    return entity.toJson();
  }
}

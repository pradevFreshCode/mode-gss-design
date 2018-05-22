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

  public sendConfirmationEmail(userId: string) {
    return this.get(`${this.apiBasePath}/confirm_email/${userId}`)
      .map(response => {
        return this.handleResponse(response);
      })
      .catch(err => this.handleError(err));
  }

  public confirmEmail(userId: string, confirmationCode: string) {
    return this.post(`${this.apiBasePath}/confirm_email`, {userId: userId, confirmationCode: confirmationCode})
      .map(response => {
        return this.handleResponse(response);
      })
      .catch(err => this.handleError(err));
  }
}

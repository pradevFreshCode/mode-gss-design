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
    return this.post(`${this.apiBasePath}/confirm_email/${userId}`, {confirmationCode: confirmationCode})
      .map(response => {
        return this.handleResponse(response);
      })
      .catch(err => this.handleError(err));
  }

  public sendPasswordChangeEmail(login: string) {
    return this.get(`${this.apiBasePath}/change_password/${login}`)
      .map(response => {
        return this.handleResponse(response);
      })
      .catch(err => this.handleError(err));
  }

  public changePassword(login: string, confirmationCode: string, newPassword: string) {
    const requestData = {
      confirmationCode: confirmationCode,
      newPassword: newPassword
    };
    return this.post(`${this.apiBasePath}/change_password/${login}`, requestData)
      .map(response => {
        return this.handleResponse(response);
      })
      .catch(err => this.handleError(err));
  }
}

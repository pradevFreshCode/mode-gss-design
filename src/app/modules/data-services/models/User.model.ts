import {BaseSerializableModel} from './BaseSerializableModel';
import {UserRoleModel} from './UserRole.model';
import {UtilsDateTime} from '../../../Utils/utilsDateTime';
import * as moment from 'moment';

export class UserModel extends BaseSerializableModel {
  constructor(_id: string = null,
              public login: string = null,
              public firstName: string = null,
              public lastName: string = null,
              public email: string = null,
              public phone: string = null,
              public password: string = null,
              public smallAvatarUrl: string = 'http://semantic-ui.com/images/avatar/small/stevie.jpg',
              public confirmedAt: moment.Moment = null,
              public roleId: string = null,
              public role: UserRoleModel = null) {
    super(_id);
  }

  public static FromJson(json: any) {
    return new UserModel(
      json['_id'],
      json['login'],
      json['firstName'],
      json['lastName'],
      json['email'],
      json['phone'],
      json['password'],
      json['smallAvatarUrl'],
      UtilsDateTime.GetMomentFromString(json['confirmedAt']),
      typeof json['role'] === 'object' ? json['role']['_id'] : json['role'],
      typeof json['role'] === 'object' ? UserRoleModel.FromJson(json['role']) : json['role']
    );
  }

  public toJson(): any {
    const obj = {
      _id: this._id,
      login: this.login,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      role: this.roleId
    };

    if (!this._id) {
      obj['password'] = this.password;
    }

    return obj;
  }
}

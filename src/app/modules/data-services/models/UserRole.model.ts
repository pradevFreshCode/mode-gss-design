import {BaseSerializableModel} from './BaseSerializableModel';
import {UserModel} from './User.model';

export class UserRoleModel extends BaseSerializableModel {
  public static readonly ROLE_ID_ADMIN = '5b02c74243da4239b8fb1e0f';
  public static readonly ROLE_ID_USER = '5b02c74243da4239b8fb1e0e';

  constructor(_id: string = null,
              public name: string = null) {
    super(_id);
  }

  public static FromJson(json: any) {
    return new UserRoleModel(
      json['_id'],
      json['name']
    );
  }

  public toJson(): any {
    return {
      _id: this._id,
      name: this.name
    };
  }
}

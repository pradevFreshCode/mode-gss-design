import {BaseSerializableModel} from './BaseSerializableModel';
import {PropsCompatibilityPair} from '../../../models/props-compatibility-pair';

export class UserModel extends BaseSerializableModel {
  constructor(id: string = null,
              public login: string = null,
              public firstName: string = null,
              public lastName: string = null,
              public email: string = null,
              public smallAvatarUrl: string = 'http://semantic-ui.com/images/avatar/small/stevie.jpg') {
    super(id);
  }

  public static create(): UserModel {
    return new UserModel();
  }

  public static FromJson(json: any): UserModel {
    return <UserModel>super.FromJson(json);
  }

  afterRefillAction() {
  }

  public getFromJsonNeededPropertiesMap(): PropsCompatibilityPair[] {
    return [
      new PropsCompatibilityPair('login', 'login'),
      new PropsCompatibilityPair('name', 'name'),
    ];
  }

  public getToJsonNeededPropertiesMap(): PropsCompatibilityPair[] {
    return [
      new PropsCompatibilityPair('login', 'login'),
      new PropsCompatibilityPair('name', 'name'),
    ];
  }
}

import {BaseSerializableModel} from './BaseSerializableModel';
import {PropsCompatibilityPair} from '../../../models/props-compatibility-pair';

export class UserModel extends BaseSerializableModel {
  constructor(id: string,
              public login: string,
              public name: string,
              public smallAvatarUrl: string = 'http://semantic-ui.com/images/avatar/small/stevie.jpg') {
    super(id);
  }

  public static FromJson(json: any): UserModel {
    return <UserModel>super.FromJson(json);
  }

  afterRefillAction() {}

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

import {IRestAPICompatible} from '../../../interfaces/IRestAPICompatible';
import {PropsCompatibilityPair} from '../../../models/props-compatibility-pair';
import * as _ from 'lodash';

export abstract class BaseSerializableModel implements IRestAPICompatible {
  public _mergeAllJsonProps = true;

  constructor(public id: string) {
  }

  public static FromJson<T extends BaseSerializableModel>(json: any): IRestAPICompatible {
    console.log(this.constructor.prototype);
    const constPrototype = this.constructor.prototype;
    const newEntity =  <T>( new constPrototype() );
    newEntity.refillFromJson(json);
    return newEntity;
  }

  public abstract getFromJsonNeededPropertiesMap(): PropsCompatibilityPair[];

  public refillFromJson(parsedJson: any): IRestAPICompatible {
    if (this._mergeAllJsonProps) {
      _.merge(this, parsedJson);
    }

    const propertiesMap = this.getFromJsonNeededPropertiesMap();

    propertiesMap.forEach(pair => {
      this[pair.localPropName] = parsedJson[pair.externalPropName];
    });

    this.afterRefillAction();

    return this;
  }

  /**
   * @desc Pass here any action that must be executed right after refill
   */
  public abstract afterRefillAction(): void;

  public abstract getToJsonNeededPropertiesMap(): PropsCompatibilityPair[];

  public toJson(): any {
    const jsonObject = {};

    const propertiesMap = this.getToJsonNeededPropertiesMap();

    propertiesMap.forEach( pair => {
      jsonObject[pair.externalPropName] = this[pair.localPropName];
    });

    return jsonObject;
  }
}

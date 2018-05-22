import {IRestAPICompatible} from '../../../interfaces/IRestAPICompatible';

export abstract class BaseSerializableModel implements IRestAPICompatible {
  constructor(public _id: string) {
  }

  public abstract toJson(): any;
}

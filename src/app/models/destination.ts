import {Address} from '../address';
import {IRestAPICompatible} from '../interfaces/IRestAPICompatible';

export class Destination implements IRestAPICompatible {
  _id: string = null;
  Id: number = null;
  Name: string = null;
  Address: Address = null;
  ContactPerson: string = null;
  PhoneNumber: string = null;
  Email: string = null;
  DeliveryInstructions: string = null;
  IsRural?: boolean = false;
  SendTrackingEmail?: boolean = false;

  public static FromJson(json): Destination {
    const newEntity = new Destination();
    newEntity.fillFromJson(json);
    return newEntity;
  }

  public fillFromJson(json) {
    this._id = json['_id'];
    this.Id = json['Id'];
    this.Name = json['Name'];
    this.Address = json['Address'] ? Address.FromJson(json['Address']) : null;
    this.ContactPerson = json['ContactPerson'];
    this.PhoneNumber = json['PhoneNumber'];
    this.Email = json['Email'];
    this.DeliveryInstructions = json['DeliveryInstructions'];
    this.IsRural = json['IsRural'];
    this.SendTrackingEmail = json['SendTrackingEmail'];
  }
}

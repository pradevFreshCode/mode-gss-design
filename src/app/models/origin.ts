import {Address} from '../address';
import {IRestAPICompatible} from '../interfaces/IRestAPICompatible';

export class Origin implements IRestAPICompatible {
  public _id: string = null;
  public Id: number = null;
  public Name: string = null;
  public Address: Address = new Address();
  public ContactPerson: string = null;
  public PhoneNumber: string = null;
  public Email: string = null;
  public IsRural: boolean = false;

  public static FromJson(json): Origin {
    const newEntity = new Origin();
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
    this.IsRural = json['IsRural'];
  }
}

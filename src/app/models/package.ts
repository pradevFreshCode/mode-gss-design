import {Destination} from './destination';
import {BaseSerializableModel} from '../modules/data-services/models/BaseSerializableModel';
import {IRestAPICompatible} from '../interfaces/IRestAPICompatible';

export class Package implements IRestAPICompatible {
  constructor(public Id: number = null,
              public Unit: number = null,
              public Height: number = null,
              public Length: number = null,
              public Width: number = null,
              public Kg: number = null,
              public Name: string = null,
              public Title: string = null,
              public PackageCode: string = null,
              public Type: string = null,
              public Description: string = null,
              public Price: number = null,
              public _id: string = null) {
  }

  public static FromJson(json): Package {
    const newEntity = new Package();
    newEntity.fillFromJson(json);
    return newEntity;
  }

  public fillFromJson(json) {
    this._id = json['_id'];
    this.Id = json['Id'];
    this.Unit = json['Unit'];
    this.Height = json['Height'];
    this.Length = json['Length'];
    this.Width = json['Width'];
    this.Kg = json['Kg'];
    this.Name = json['Name'];
    this.Title = json['Title'];
    this.PackageCode = json['PackageCode'];
    this.Type = json['Type'];
    this.Description = json['Description'];
    this.Price = json['Price'];
  }
}

export class Address {
    BuildingName: string;
    StreetAddress: string;
    Suburb: string;
    City: string;
    PostCode: string;
    CountryCode: string;

  public static FromJson(json): Address {
    const newEntity = new Address();
    newEntity.fillFromJson(json);
    return newEntity;
  }

  public fillFromJson(json) {
    this.BuildingName = json['BuildingName'];
    this.StreetAddress = json['StreetAddress'];
    this.Suburb = json['Suburb'];
    this.City = json['City'];
    this.PostCode = json['PostCode'];
    this.CountryCode = json['CountryCode'];
  }
}

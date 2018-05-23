import {IRestAPICompatible} from '../interfaces/IRestAPICompatible';

export class ConsignmentModel implements IRestAPICompatible {
  constructor (
    public Connote: string,
    public TrackingUrl: string,
    public Cost: number,
    public CarrierType: number,
    public IsSaturdayDelivery: boolean,
    public IsRural: boolean,
    public IsOvernight: boolean,
    public HasTrackPaks: boolean,
    public ConsignmentId: number,
    public OutputFiles: boolean,
    public Items: any[],
    public _id: string = null
  ) {}

  public static FromJson(json): ConsignmentModel {
    return new ConsignmentModel(
      json['Connote'],
      json['TrackingUrl'],
      json['Cost'],
      json['CarrierType'],
      json['IsSaturdayDelivery'],
      json['IsRural'],
      json['IsOvernight'],
      json['HasTrackPaks'],
      json['ConsignmentId'],
      json['OutputFiles'],
      json['Items'] ? json['Items'] : [],
      json['_id']
    );
  }
}

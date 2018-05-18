export class ConsignmentModel {
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
    public Items: boolean,
  ) {}
}

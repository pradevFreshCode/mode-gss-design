export class PickupRequestModel {
  constructor (public Connote: PickupRequestConnoteModel = new PickupRequestConnoteModel(),
               public SiteId: number = null,
               public CloseTime: number = 9,
               public Message: string = '') {}
}

export class PickupRequestConnoteModel {
  constructor (public ConsignmentId: number = null,
               public ConsignmentNumber: string = null) {}
}

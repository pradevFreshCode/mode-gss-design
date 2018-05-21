export class PickupRequestModel {
  constructor (public ConnoteConsignmentId: number = null,
               public ConnoteConsignmentNumber: string = null,
               public SiteId: number = null,
               public CloseTime: number = 9,
               public Message: string = '') {}
}

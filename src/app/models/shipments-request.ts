import {Origin} from './origin';
import {Destination} from './destination';
import {Package} from './package';
import {ConsignmentModel} from './consignment.model';
import {ProcessedShipmentModel} from './processed-shipment.model';
import {IRestAPICompatible} from '../interfaces/IRestAPICompatible';

export class ShipmentsRequest implements IRestAPICompatible {
  public _id: string = null;
  public Origin: Origin = null;
  public Destination: Destination = null;
  public Packages: Package[] = [];
  public Commodities: any = null;
  public IsSaturdayDelivery: boolean = false;
  public IsSignatureRequired: boolean = true;
  public IsUrgentCouriers: boolean = false;
  public DutiesAndTaxesByReceiver: boolean = false;
  public DeliveryReference: string = null;
  public PrintToPrinter: boolean = true;
  public Outputs: any = null;
  public CarrierId: number = null;
  public Carrier: string = null;
  public Service: string = null;
  public SiteId: number = 0;
  public IncludeLineDetails: boolean = false;
  public ShipType: number = 1;
  public HasDG: boolean = false;
  public DangerousGoods: any = null;
  public DisableFreightForwardEmails: boolean = false;
  public IncludeInsurance: boolean = false;
  public StringChargeResponse: any = null;
  public Cost: number = null;

  public static FromJson(json): ShipmentsRequest {
    const newEntity = new ShipmentsRequest();
    newEntity.fillFromJson(json);
    return newEntity;
  }

  public fillFromJson(json) {
    this._id = json['_id'];
    this.Origin = json['Origin'] ? Origin.FromJson(json['Origin']) : null;
    this.Destination = json['Destination'] ? Destination.FromJson(json['Destination']) : null;
    this.Packages = json['Packages'] ? json['Packages'].map(x => Package.FromJson(x)) : [];
    this.Commodities = json['Commodities'];
    this.IsSaturdayDelivery = json['IsSaturdayDelivery'];
    this.IsSignatureRequired = json['IsSignatureRequired'];
    this.IsUrgentCouriers = json['IsUrgentCouriers'];
    this.DutiesAndTaxesByReceiver = json['DutiesAndTaxesByReceiver'];
    this.DeliveryReference = json['DeliveryReference'];
    this.PrintToPrinter = json['PrintToPrinter'];
    this.Outputs = json['Outputs'];
    this.CarrierId = json['CarrierId'];
    this.Carrier = json['Carrier'];
    this.Service = json['Service'];
    this.SiteId = json['SiteId'];
    this.IncludeLineDetails = json['IncludeLineDetails'];
    this.ShipType = json['ShipType'];
    this.HasDG = json['HasDG'];
    this.DangerousGoods = json['DangerousGoods'] ? json['DangerousGoods'] : [];
    this.DisableFreightForwardEmails = json['DisableFreightForwardEmails'];
    this.IncludeInsurance = json['IncludeInsurance'];
    this.StringChargeResponse = json['StringChargeResponse'];
    this.Cost = json['Cost'];
  }
}

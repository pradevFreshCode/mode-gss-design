import { Origin } from './origin';
import { Destination } from './destination';
import { Package } from './package';

export class ShipmentsRequest {
    Origin: Origin;
    Destination: Destination;
    Packages: Package[];
    Commodities: any;
    IsSaturdayDelivery: boolean;
    IsSignatureRequired: boolean;
    IsUrgentCouriers: boolean;
    DutiesAndTaxesByReceiver: boolean;
    DeliveryReference: string;
    PrintToPrinter: boolean;
    Outputs: any;
    CarrierId: number;
    Carrier: string;
    Service: string;
    SiteId: number;
    IncludeLineDetails: boolean;
    ShipType: number;
    HasDG: boolean;
    DangerousGoods: any;
    DisableFreightForwardEmails: boolean;
    IncludeInsurance: boolean;
}

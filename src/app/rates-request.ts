import { Origin } from './origin';
import { Destination } from './destination';
import { Package } from './package';

export class RatesRequest {
    DeliveryReference: string;
    Origin: Origin;
    Destination: Destination;
    IsSaturdayDelivery: boolean;
    IsSignatureRequired: boolean;
    Packages: Package[];
}

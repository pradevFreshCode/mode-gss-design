import { Address } from './address';

export class Destination {
    Id: number;
    Name: string;
    Address: Address;
    ContactPerson: string;
    PhoneNumber: string;
    Email: string;
    DeliveryInstructions: string;
    IsRural?: boolean;
    SendTrackingEmail?: boolean;
}

import {ShipmentsRequest} from './shipments-request';
import {ConsignmentModel} from './consignment.model';
import {UtilsDateTime} from '../Utils/utilsDateTime';
import * as moment from 'moment';
import {UserModel} from '../modules/data-services/models/User.model';

export class ProcessedShipmentModel extends ShipmentsRequest {
  constructor() {
    super();
  }

  CarrierName: string;
  IsFreightForward: boolean;
  IsOvernight: boolean;
  IsRural: boolean;
  HasTrackPaks: boolean;
  Message: string;
  AddressLabelMessage: string;
  AddressLabelError: any;
  Errors: any[];
  Consignments: ConsignmentModel[];
  Downloads: any[];
  CarrierType: number;
  AlertPath: any;
  Notifications: any[];
  HasSaturdayDeliveryLabel: boolean;

  created: moment.Moment = null;
  createdAtString: string = null;

  user: string|UserModel = null;

  public static FromJson(json): ProcessedShipmentModel {
    const newEntity = new ProcessedShipmentModel();
    newEntity.fillFromJson(json);
    return newEntity;
  }

  public fillFromJson(json) {
    super.fillFromJson(json);
    this.CarrierId = json['CarrierId'];
    this.CarrierName = json['CarrierName'];
    this.IsFreightForward = json['IsFreightForward'];
    this.IsOvernight = json['IsOvernight'];
    this.IsRural = json['IsRural'];
    this.HasTrackPaks = json['HasTrackPaks'];
    this.Message = json['Message'];
    this.AddressLabelMessage = json['AddressLabelMessage'];
    this.AddressLabelError = json['AddressLabelError'];
    this.Errors = json['Errors'] ? json['Errors'] : [];
    this.Consignments = json['Consignments'] ? json['Consignments'].map(x => ConsignmentModel.FromJson(x)) : [];
    this.Downloads = json['Downloads'] ? json['Downloads'] : [];
    this.CarrierType = json['CarrierType'];
    this.AlertPath = json['AlertPath'];
    this.Notifications = json['Notifications'] ? json['Notifications'] : [];
    this.HasSaturdayDeliveryLabel = json['HasSaturdayDeliveryLabel'];
    this.created = json['created'] ? moment(json['created']) : null;
    this.createdAtString = this.created ? this.created.format(UtilsDateTime.DateTimeDisplayFormat) : null;
    this.user = json['user'] ? json['user']['_id'] ? UserModel.FromJson(json['user']) : json['user'] : null;
  }
}

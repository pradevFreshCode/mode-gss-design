import {Injectable} from '@angular/core';
import {NamedClientService} from './named-api-client.service';
import {UserRoleModel} from '../models/UserRole.model';
import {ProcessedShipmentModel} from '../../../models/processed-shipment.model';

@Injectable()
export class ProcessedShipmentsService extends NamedClientService<ProcessedShipmentModel> {
  public static ROLE_ORDER = {
    [UserRoleModel.ROLE_ID_ADMIN]: 100,
    [UserRoleModel.ROLE_ID_USER]: 1
  };

  getApiBasePath(): string {
    return 'processed_shipments';
  }

  public getServiceName() {
    return 'ProcessedShipmentsService';
  }

  public fromJson(json: any): ProcessedShipmentModel {
    return ProcessedShipmentModel.FromJson(json);
  }

  public toJson(entity: ProcessedShipmentModel): any {
    return entity;
  }
}

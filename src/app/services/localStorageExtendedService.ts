import {LocalStorageService} from "angular-2-local-storage";
import {EventEmitter} from "@angular/core";


export class LocalStorageExtendedService extends LocalStorageService {
  public static message$ = new EventEmitter<any>();

  constructor() {
    super({
      prefix: 'en',
      storageType: 'localStorage'
    });
    $(window).on('storage', this.receiveMessage);
  }

  broadcastMessage(object: any) {
    localStorage.setItem('message', JSON.stringify(object));
    localStorage.removeItem('message');
  }

  private receiveMessage(event) {
    if (event.originalEvent.key !== 'message') {
      return;
    }
    const message = JSON.parse(event.originalEvent.newValue);
    if (!message) {
      return;
    }

    LocalStorageExtendedService.message$.emit(message);
  }

}

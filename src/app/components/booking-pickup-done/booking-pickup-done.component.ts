import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-booking-pickup-done',
  templateUrl: './booking-pickup-done.component.html'
})
export class BookingPickupDoneComponent implements OnInit {
  @Output() goToStartClicked = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  goToStart() {
    this.goToStartClicked.emit(true);
  }
}

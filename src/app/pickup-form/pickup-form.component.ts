import { Component, OnInit, Input } from '@angular/core';
import { RatesRequest } from '../rates-request';

@Component({
  selector: 'app-pickup-form',
  templateUrl: './pickup-form.component.html',
  styleUrls: ['./pickup-form.component.css']
})
export class PickupFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;

  constructor() { }

  ngOnInit() {
  }

}

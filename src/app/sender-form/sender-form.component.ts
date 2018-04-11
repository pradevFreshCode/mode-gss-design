import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ControlContainer, NgForm, FormControl } from '@angular/forms';
import { RatesRequest } from '../rates-request';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import {} from 'googlemaps';

import { GeocodingService } from '../geocoding.service';

@Component({
  selector: 'app-sender-form',
  templateUrl: './sender-form.component.html',
  styleUrls: ['./sender-form.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class SenderFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @ViewChild('OriginStreet') public searchElementRef: ElementRef;

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public searchControl: FormControl;
  public isStreetTouched: boolean;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private geocodingService: GeocodingService
  ) { }

  ngOnInit() {
    // set the country to NZ
    this.ratesRequest.Origin.Address.CountryCode = 'NZ';
    this.isStreetTouched = false;
    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,
      {
        types: ['address']
      });

      autocomplete.setComponentRestrictions({'country': ['nz']});

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // console.log(place);

          let street_number = '';
          let route = '';

          place.address_components.forEach(
            addr_component => {
              const type = addr_component.types[0];
              if (type === 'street_number') {
                street_number = addr_component.short_name;
              } else if (type === 'route') {
                route = addr_component.long_name;
              } else if (type === 'sublocality_level_1') {
                this.ratesRequest.Origin.Address.Suburb = addr_component.long_name;
              } else if (type === 'locality') {
                this.ratesRequest.Origin.Address.City = addr_component.long_name;
              } else if (type === 'country') {
                this.ratesRequest.Origin.Address.CountryCode = addr_component.short_name;
              } else if (type === 'postal_code') {
                this.ratesRequest.Origin.Address.PostCode = addr_component.short_name;
              }
            }
          );

          this.ratesRequest.Origin.Address.StreetAddress = street_number + ' ' + route;

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;
        });
      });
    });

    this.ratesRequest.Origin.Address.CountryCode = 'NZ';
  }

  public isStreetValid() {
    if (this.ratesRequest.Origin.Address.StreetAddress === undefined
      || this.ratesRequest.Origin.Address.StreetAddress === null
      || this.ratesRequest.Origin.Address.StreetAddress.trim() === '') {
        return false;
      }

      return true;
  }

  public setStreetTouched() {
    this.isStreetTouched = true;
  }
}

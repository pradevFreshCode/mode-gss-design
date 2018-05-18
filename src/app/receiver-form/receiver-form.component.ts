import {Component, OnInit, Input, ViewChild, ElementRef, NgZone} from '@angular/core';
import {ControlContainer, NgForm, FormControl} from '@angular/forms';
import {RatesRequest} from '../rates-request';

import {AgmCoreModule, MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';

import {GeocodingService} from '../geocoding.service';
import {CountryWithCodeModel} from '../models/country-with-code.model';
import {CountriesListProviderService} from '../services/countries-list-provider.service';

@Component({
  selector: 'app-receiver-form',
  templateUrl: './receiver-form.component.html',
  styleUrls: ['./receiver-form.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ReceiverFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @ViewChild('DestinationStreet') public searchElementRef: ElementRef;

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public searchControl: FormControl;
  public isStreetTouched: boolean;

  public countriesList: CountryWithCodeModel[] = [];

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private geocodingService: GeocodingService,
              private _countriesListProviderService: CountriesListProviderService) {
  }

  ngOnInit() {
    this.countriesList = this._countriesListProviderService.FullCountriesList;

    this.isStreetTouched = false;
    this.searchControl = new FormControl();

    this.ratesRequest.Destination.Address.CountryCode = 'NZ';
    this.ratesRequest.Destination.Name = 'Retail On Sale NZ Ltd t/a Mode.co.nz';
    this.ratesRequest.Destination.Address.StreetAddress = '115A Nayland Street';
    this.ratesRequest.Destination.Address.Suburb = 'Sumner';
    this.ratesRequest.Destination.Address.City = 'Christchurch';
    this.ratesRequest.Destination.Address.PostCode = '8081';
    this.ratesRequest.Destination.ContactPerson = 'Joel Kendall';
    this.ratesRequest.Destination.PhoneNumber = '021440424';
    this.ratesRequest.Destination.Email = 'joel@mode.co.nz';

    this.lookupAddress();

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
                this.ratesRequest.Destination.Address.Suburb = addr_component.long_name;
              } else if (type === 'locality') {
                this.ratesRequest.Destination.Address.City = addr_component.long_name;
              } else if (type === 'country') {
                this.ratesRequest.Destination.Address.CountryCode = addr_component.short_name;
              } else if (type === 'postal_code') {
                this.ratesRequest.Destination.Address.PostCode = addr_component.short_name;
              }
            }
          );

          this.ratesRequest.Destination.Address.StreetAddress = street_number + ' ' + route;

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 15;
        });
      });
    });
  }

  public lookupAddress() {
    // console.log('lookupAddress');
    // console.log(this.geocoder);
    const address = (this.ratesRequest.Destination.Address.StreetAddress || '')
      + ' ' + (this.ratesRequest.Destination.Address.Suburb || '')
      + ' ' + (this.ratesRequest.Destination.Address.City || '')
      + ' ' + (this.ratesRequest.Destination.Address.CountryCode || '');

    // console.log(address);
    this.geocodingService.codeAddress(address).subscribe(
      (result => {
        if (result.length > 0) {
          // console.log(result[0].geometry.location.lat());
          // console.log(result[0].geometry.location.lng());

          this.latitude = result[0].geometry.location.lat();
          this.longitude = result[0].geometry.location.lng();
          this.zoom = 15;
        }
      }));
  }

  public isStreetValid() {
    if (this.ratesRequest.Destination.Address.StreetAddress === undefined
      || this.ratesRequest.Destination.Address.StreetAddress === null
      || this.ratesRequest.Destination.Address.StreetAddress.trim() === '') {
      return false;
    }

    return true;
  }

  public setStreetTouched() {
    this.isStreetTouched = true;
  }
}

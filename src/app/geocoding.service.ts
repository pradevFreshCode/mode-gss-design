import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

import { AgmCoreModule, MapsAPILoader } from '@agm/core';

@Injectable()
export class GeocodingService {

  geocoder: google.maps.Geocoder;

  constructor(
    private mapAPILoader: MapsAPILoader
  ) {
    this.mapAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  /**
   * Reverse geocoding by location.
   */
  geocode(latLng: google.maps.LatLng): Observable<google.maps.GeocoderResult[]> {
    return Observable.create((observer: Observer<google.maps.GeocoderResult[]>) => {
      // Invokes geocode method of Google Maps API geocoding.
      this.geocoder.geocode({ location: latLng }, (
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.OK) {
            observer.next(results);
            observer.complete();
          } else {
            console.log('Geocoding service: geocoder failed due to: ' + status);
            observer.error(status);
          }
        })
      );
    });
  }

  /**
   * Geocoding service.
   *
   * Wraps the Google Maps API geocoding service into an observable.
   *
   * @param address The address to be searched
   * @return An observable of GeocoderResult
   */
  codeAddress(address: string): Observable<google.maps.GeocoderResult[]> {
    return Observable.create((observer: Observer<google.maps.GeocoderResult[]>) => {
      // Invokes geocode method of Google Maps API geocoding.
      if (!this.geocoder) {
        this.mapAPILoader.load().then(() => {
          this.geocoder = new google.maps.Geocoder();
          this.geocoder.geocode({ address: address }, (
            (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
              if (status === google.maps.GeocoderStatus.OK) {
                observer.next(results);
                observer.complete();
              } else {
                console.log(
                  'Geocoding service: geocode was not successful for the following reason: '
                  + status
                );
                observer.error(status);
              }
            })
          );
        });
      } else {
        this.geocoder.geocode({ address: address }, (
          (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === google.maps.GeocoderStatus.OK) {
              observer.next(results);
              observer.complete();
            } else {
              console.log(
                'Geocoding service: geocode was not successful for the following reason: '
                + status
              );
              observer.error(status);
            }
          })
        );
      }
    });
  }
}

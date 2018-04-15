import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { RatesRequest } from '../rates-request';
import { GssRequestService } from '../gss-request.service';
import { Package } from '../package';
import { Available } from '../available';
import { environment } from '../../environments/environment';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-carrier-form',
  templateUrl: './carrier-form.component.html',
  styleUrls: ['./carrier-form.component.css']
})
export class CarrierFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Output() onGo = new EventEmitter<any>();

  loaderpath = environment.assets_dir + 'ajax-loader.gif';
  isLoading: boolean;
  available: any;
  errorResponse: any;

  constructor(
    private gssRequestService: GssRequestService,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.errorResponse = null;
    this.available = {};
    this.available.Available = [];

    // reorganize Package: remove Unit
    const toGo = Object.assign({}, this.ratesRequest);

    // remove Packages
    toGo.Packages = [];
    // console.log(copy);

    this.ratesRequest.Packages.forEach(pkg => {
      let i = 0;
      for (i; i < pkg.Unit; i++) {
        const togoPkg = new Package();
        togoPkg.Id = pkg.Id;
        togoPkg.Length = pkg.Length;
        togoPkg.Width = pkg.Width;
        togoPkg.Height = pkg.Height;
        togoPkg.Name = pkg.Name;
        togoPkg.Kg = pkg.Kg;
        togoPkg.PackageCode = pkg.PackageCode;
        togoPkg.Type = pkg.Type;

        toGo.Packages.push(togoPkg);
      }
    });

    // console.log(toGo);
    this.getAvails(toGo);
  }

  getAvails(ratesRequest: RatesRequest): void {
    this.gssRequestService.getAvails(ratesRequest)
      .subscribe(
        avails => {
          this.isLoading = false;
          this.available = avails;
        },
        err => {
          this.isLoading = false;
          this.errorResponse = err;
        }
      );
  }

  public GoWithTheCarrier(avail: Available, isEmail: boolean = true) {
    avail.IsEmail = isEmail;
    this.onGo.emit(avail);

    // show StripeCardComponent
    // document.getElementById('btnShowStripe').click();
  }
}

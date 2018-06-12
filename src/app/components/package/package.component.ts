import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ControlContainer, NgForm, FormControl} from '@angular/forms';
import {GssRequestService} from '../../services/gss-request.service';
import {RatesRequest} from '../../models/rates-request';
import {Package} from '../../models/package';
import {Available} from '../../models/available';
import {PACKAGE_OPTIONS} from '../../models/package-options';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Output() goClicked = new EventEmitter<any>();

  loaderpath = environment.assets_dir + 'ajax-loader.gif';
  packageOptions = PACKAGE_OPTIONS;
  // selectedOption = Package;
  customRate = 0.0;
  customWidth: number;
  customLength: number;
  customHeight: number;
  customWeight: number;

  isCustomLoading: boolean;
  customAvailable: any;
  customErrorResponse: any;
  isNoCustomAvails: boolean;

  available: any;
  isAvailLoading: boolean[] = [];
  isLoading: boolean;

  constructor(private gssRequestService: GssRequestService) {
  }

  ngOnInit() {
    this.isCustomLoading = false;
    this.isNoCustomAvails = false;
    this.available = {};
    this.available.Available = [];
    this.isAvailLoading = [];
    this.packageOptions.forEach((value, index) => {
      this.isAvailLoading[index] = false;
    });
  }

  getCustomAvail() {
    this.customRate = 0.0;
    this.isCustomLoading = true;
    this.customErrorResponse = null;
    this.customAvailable = {};
    this.customAvailable.Available = [];

    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    // create Packages
    toGo.Packages = [];

    const customPkg = new Package();
    customPkg.Id = 0;
    customPkg.Length = this.customLength;
    customPkg.Width = this.customWidth;
    customPkg.Height = this.customHeight;
    customPkg.Name = 'custom';
    customPkg.Kg = this.customWeight;
    customPkg.PackageCode = '';
    customPkg.Type = 'Box';
    toGo.Packages.push(customPkg);

    this.gssRequestService.getAvails(toGo)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.customAvailable = avails;
          if (this.customAvailable.Available.length === 0) {
            this.isNoCustomAvails = true;
            setTimeout(() => {
              this.isNoCustomAvails = false;
            }, 3000);
          } else {
            // TODO
            this.customRate = this.customAvailable.Available[0].Cost + environment.return_charge;
          }
        },
        err => {
          this.customErrorResponse = err;
          this.isNoCustomAvails = true;
          setTimeout(() => {
            this.isNoCustomAvails = false;
          }, 3000);
        },
        () => {
          this.isCustomLoading = false;
        }
      );
  }

  public goWithCustom(isEmail: boolean = true) {
    // create Packages
    this.ratesRequest.Packages = [];

    const customPkg = new Package();
    customPkg.Id = 0;
    customPkg.Length = this.customLength;
    customPkg.Width = this.customWidth;
    customPkg.Height = this.customHeight;
    customPkg.Name = 'custom';
    customPkg.Kg = this.customWeight;
    customPkg.PackageCode = '';
    customPkg.Type = 'Box';

    this.ratesRequest.Packages.push(customPkg);

    this.customAvailable.Available[0].IsEmail = isEmail;
    this.customAvailable.Available[0].Cost = this.customRate;
    this.goClicked.emit(this.customAvailable.Available[0]);
  }

  public goWithIt(idx: number) {
    // create Packages
    this.ratesRequest.Packages = [];

    const pkg = new Package();

    pkg.Id = 0;
    pkg.Length = PACKAGE_OPTIONS[idx].Length;
    pkg.Width = PACKAGE_OPTIONS[idx].Width;
    pkg.Height = PACKAGE_OPTIONS[idx].Height;
    pkg.Name = PACKAGE_OPTIONS[idx].Name;
    pkg.Kg = PACKAGE_OPTIONS[idx].Kg;
    pkg.PackageCode = PACKAGE_OPTIONS[idx].PackageCode;
    pkg.Type = 'Box';

    this.ratesRequest.Packages.push(pkg);

    ///
    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    this.setAvailLoading(idx);
    this.isLoading = true;
    this.gssRequestService.getAvails(this.ratesRequest)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.available = avails;
          if (this.available.Available.length) {
            this.available.Available[0].IsEmail = false;
            this.available.Available[0].Cost = PACKAGE_OPTIONS[idx].Price;

            this.goClicked.emit(this.available.Available[0]);
          } else {
            alert('No availables.');
          }
          this.setAvailLoading(idx, false);
          this.isLoading = false;
        },
        err => {
          // TODO error
          alert('error occurred.');
          console.log('err', err);
          this.setAvailLoading(idx, false);
          this.isLoading = false;
        }
      );

  }

  public setAvailLoading(idx: number, state: boolean = true) {
    this.isAvailLoading[idx] = state;
  }
}
